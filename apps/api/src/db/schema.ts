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

const createdAt = () => timestamp('created_at', { withTimezone: true }).defaultNow().notNull()

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    publicId: varchar('public_id', { length: 16 }).notNull().unique(),

    accessToken: varchar('access_token', { length: 64 }).notNull(),

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

    utm: jsonb('utm').$type<Record<string, string>>(),

    amoContactId: bigint('amo_contact_id', { mode: 'number' }),
    amoLeadId: bigint('amo_lead_id', { mode: 'number' }),

    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('orders_status_created_at_idx').on(table.status, table.createdAt),
    index('orders_customer_phone_idx').on(table.customerPhone),

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

    kind: varchar('kind', { length: 16 }).$type<'initial' | 'remainder'>().notNull(),

    amountKopecks: integer('amount_kopecks').notNull(),
    status: varchar('status', { length: 16 })
      .$type<'pending' | 'succeeded' | 'failed'>()
      .default('pending')
      .notNull(),

    provider: varchar('provider', { length: 16 }).default('prodamus').notNull(),
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

export const consents = pgTable(
  'consents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'restrict' }),

    kind: varchar('kind', { length: 8 }).$type<'pd' | 'ads'>().notNull(),
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
