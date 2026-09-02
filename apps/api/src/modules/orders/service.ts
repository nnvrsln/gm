/**
 * Создание заказа и чтение его статуса.
 *
 * ── Идемпотентность ──────────────────────────────────────────────────────
 * Двойной тап по кнопке на телефоне — не редкость, а норма: палец, лаг
 * сети, повтор. Страница присылает `idempotencyKey`, на нём в базе
 * уникальный индекс, и повторная отправка возвращает **тот же** заказ.
 * Сделано вставкой с `onConflictDoNothing`, а не проверкой «есть ли уже
 * такой»: проверка и вставка — это две операции, между которыми успевает
 * вклиниться второй запрос.
 *
 * ── Транзакция ───────────────────────────────────────────────────────────
 * Заказ и согласия пишутся вместе. Заказ без записи согласия — это
 * персональные данные без законного основания, и такого состояния в базе
 * быть не должно даже на миллисекунду.
 */

import { orderAmounts, normalizeTelegram, type OrderStatusResponse } from '@gm/shared'
import { randomBytes } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import type { Database } from '../../plugins/db'
import { consents, orders } from '../../db/schema'
import type { CreateOrderBody } from './schema'

/**
 * Версия текстов согласий. Меняется вместе с текстом «Политики» и оферты;
 * старые записи остаются со своей версией — в этом весь смысл поля.
 */
export const CONSENT_VERSION = '1.0'

/**
 * Алфавит номера заказа: без нуля, единицы, I и O. Номер называют вслух и
 * переписывают руками, а «0» и «O» в этот момент неразличимы.
 */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

export function publicId() {
  const bytes = randomBytes(8)
  let out = ''
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length]
  return `GM-${out}`
}

export function accessToken() {
  return randomBytes(24).toString('hex')
}

export type CreateOrderResult = {
  order: typeof orders.$inferSelect
  /** Заказ уже существовал: пришёл повтор с тем же ключом. */
  repeated: boolean
}

export async function createOrder(
  db: Database,
  body: CreateOrderBody,
  meta: { ip: string | undefined; userAgent: string | undefined },
): Promise<CreateOrderResult> {
  const amounts = orderAmounts(body.tariffId, body.action)

  const inserted = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(orders)
      .values({
        publicId: publicId(),
        accessToken: accessToken(),
        idempotencyKey: body.idempotencyKey,
        tariffId: body.tariffId,
        action: body.action,
        totalKopecks: amounts.total,
        customerPhone: body.phone,
        customerEmail: body.email.trim(),
        customerTelegram: body.telegram ? normalizeTelegram(body.telegram) : null,
        customerWhatsapp: body.whatsapp || null,
        utm: body.utm ?? null,
      })
      .onConflictDoNothing({ target: orders.idempotencyKey })
      .returning()

    // Повтор: заказ по этому ключу уже создан, ничего не пишем.
    if (!created) return null

    const records = [
      { orderId: created.id, kind: 'pd' as const },
      ...(body.consentAds ? [{ orderId: created.id, kind: 'ads' as const }] : []),
    ]

    await tx.insert(consents).values(
      records.map((record) => ({
        ...record,
        textVersion: CONSENT_VERSION,
        ip: meta.ip ?? null,
        userAgent: meta.userAgent?.slice(0, 500) ?? null,
      })),
    )

    return created
  })

  if (inserted) return { order: inserted, repeated: false }

  const [existing] = await db
    .select()
    .from(orders)
    .where(eq(orders.idempotencyKey, body.idempotencyKey))
    .limit(1)

  // Строка была занята конфликтом и тут же исчезла — такого не бывает:
  // заказы не удаляются. Если случилось, молчать нельзя.
  if (!existing) {
    throw new Error(`Заказ по ключу повтора не найден после конфликта: ${body.idempotencyKey}`)
  }

  return { order: existing, repeated: true }
}

export async function findOrderStatus(
  db: Database,
  publicIdValue: string,
  token: string,
): Promise<OrderStatusResponse | null> {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.publicId, publicIdValue), eq(orders.accessToken, token)))
    .limit(1)

  if (!order) return null

  return {
    publicId: order.publicId,
    status: order.status,
    tariffId: order.tariffId,
    action: order.action,
    totalKopecks: order.totalKopecks,
    paidKopecks: order.paidKopecks,
    remainderKopecks: Math.max(0, order.totalKopecks - order.paidKopecks),
  }
}
