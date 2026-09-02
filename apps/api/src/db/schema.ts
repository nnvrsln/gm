/**
 * Схема базы. Расшифровка решений — `docs/tz/06-BACKEND.md`, раздел
 * «Схема БД»; здесь только то, что нужно помнить, глядя на код.
 *
 * ── Деньги ───────────────────────────────────────────────────────────────
 * Все суммы — целые копейки. Дробных денег в базе не бывает: `numeric`
 * пришлось бы приводить руками, а `real` теряет копейку на ровном месте.
 *
 * ── Почему у заказа две суммы ────────────────────────────────────────────
 * `totalKopecks` — тариф целиком, `paidKopecks` — сколько подтверждено.
 * Флага «оплачен» нет и быть не может: бронь за 10 000 ₽ это первый из двух
 * платежей, и без полной стоимости не посчитать остаток.
 *
 * ── Ничего не удаляем ────────────────────────────────────────────────────
 * Заказы и события платёжки — финансовый след. Отмена это статус
 * `cancelled`, а не `DELETE`. Поэтому у ссылок стоит `restrict`: строку,
 * на которую ссылается платёж, база не даст стереть даже по ошибке.
 */

import type { OrderStatus, PayAction, TariffId } from '@gm/shared'
import { relations, sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

/** Время везде в UTC. Показ в MSK — забота интерфейса, не базы. */
const createdAt = () => timestamp('created_at', { withTimezone: true }).defaultNow().notNull()

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    /** Короткий номер для человека: его называют в переписке и в платёжке. */
    publicId: varchar('public_id', { length: 16 }).notNull().unique(),

    /**
     * Ключ к статусу заказа. Страница «спасибо» знает `publicId` и этот
     * токен; без него по номеру заказа нельзя было бы отдавать ничего —
     * короткие номера перебираются.
     */
    accessToken: varchar('access_token', { length: 64 }).notNull(),

    /**
     * Ключ повтора. Уникальность — и есть механизм: повторная отправка с
     * тем же ключом не создаёт второй заказ, а возвращает первый.
     */
    idempotencyKey: varchar('idempotency_key', { length: 64 }).notNull().unique(),

    tariffId: varchar('tariff_id', { length: 16 }).$type<TariffId>().notNull(),
    action: varchar('action', { length: 16 }).$type<PayAction>().notNull(),

    totalKopecks: integer('total_kopecks').notNull(),
    paidKopecks: integer('paid_kopecks').default(0).notNull(),

    status: varchar('status', { length: 24 }).$type<OrderStatus>().default('new').notNull(),

    customerPhone: varchar('customer_phone', { length: 32 }).notNull(),
    customerEmail: varchar('customer_email', { length: 320 }).notNull(),
    customerTelegram: varchar('customer_telegram', { length: 100 }),
    customerWhatsapp: varchar('customer_whatsapp', { length: 32 }),

    /** Метки перехода: нужны маркетингу в карточке сделки amoCRM. */
    utm: jsonb('utm').$type<Record<string, string>>(),

    amoContactId: bigint('amo_contact_id', { mode: 'number' }),
    amoLeadId: bigint('amo_lead_id', { mode: 'number' }),

    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Обычный вопрос к базе: «покажи неоплаченные за последние сутки».
    index('orders_status_created_at_idx').on(table.status, table.createdAt),
    index('orders_customer_phone_idx').on(table.customerPhone),

    // Инварианты денег на уровне базы, а не приложения. Приложение можно
    // обойти — новым скриптом, ручным UPDATE, ошибкой в будущем коде;
    // ограничение таблицы обойти нельзя. Заказ на ноль рублей и
    // оплаченная сумма больше стоимости — это состояния, которых не бывает.
    check('orders_total_positive', sql`${table.totalKopecks} > 0`),
    check('orders_paid_in_range', sql`${table.paidKopecks} between 0 and ${table.totalKopecks}`),
  ],
)

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'restrict' }),

    /** `initial` — первый платёж (полный или бронь), `remainder` — доплата. */
    kind: varchar('kind', { length: 16 }).$type<'initial' | 'remainder'>().notNull(),

    amountKopecks: integer('amount_kopecks').notNull(),
    status: varchar('status', { length: 16 })
      .$type<'pending' | 'succeeded' | 'failed'>()
      .default('pending')
      .notNull(),

    provider: varchar('provider', { length: 16 }).default('prodamus').notNull(),
    /** Идентификатор на стороне платёжки. Уникален — по нему сверяют. */
    providerPaymentId: varchar('provider_payment_id', { length: 128 }).unique(),
    paymentUrl: text('payment_url'),

    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [
    index('payments_order_id_idx').on(table.orderId),
    check('payments_amount_positive', sql`${table.amountKopecks} > 0`),
  ],
)

/**
 * Журнал уведомлений от платёжки — и механизм идемпотентности.
 *
 * Уникальный `eventKey` делает повтор безвредным: вставка второго такого же
 * события отбрасывается, и обработчик просто ничего не делает. Платёжки шлют
 * дубли и ретраи всегда, это норма, а не сбой.
 *
 * События с неверной подписью тоже пишутся: по ним видно и попытку подделки,
 * и момент, когда у нас разъехался секретный ключ.
 */
export const paymentEvents = pgTable(
  'payment_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventKey: varchar('event_key', { length: 160 }).notNull().unique(),

    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'restrict' }),
    paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'restrict' }),

    signatureValid: boolean('signature_valid').notNull(),
    payload: jsonb('payload').notNull(),

    receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('payment_events_order_id_idx').on(table.orderId)],
)

/**
 * Согласия. Отдельной таблицей, а не флагами в заказе, потому что 152-ФЗ
 * требует доказуемости: доказуемость — это неизменяемая запись факта со
 * временем, адресом и версией текста, под которым человек подписался.
 * Флаг в изменяемой строке заказа доказательством не является.
 *
 * Два вида раздельно: ст. 18 закона «О рекламе» требует отдельного
 * предварительного согласия именно на рекламу.
 */
export const consents = pgTable(
  'consents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'restrict' }),

    kind: varchar('kind', { length: 8 }).$type<'pd' | 'ads'>().notNull(),
    /** Версия текста, под которым подписались: тексты меняются. */
    textVersion: varchar('text_version', { length: 20 }).notNull(),

    ip: varchar('ip', { length: 64 }),
    userAgent: text('user_agent'),

    acceptedAt: timestamp('accepted_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('consents_order_id_idx').on(table.orderId)],
)

export const ordersRelations = relations(orders, ({ many }) => ({
  payments: many(payments),
  consents: many(consents),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}))

export const consentsRelations = relations(consents, ({ one }) => ({
  order: one(orders, { fields: [consents.orderId], references: [orders.id] }),
}))

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
