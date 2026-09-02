/**
 * Проверки против живого PostgreSQL: то, что нельзя доказать чистыми
 * функциями. Здесь проверяется поведение, за которое отвечает база —
 * транзакция, уникальный индекс, ограничения на суммы.
 */

import { RESERVE_AMOUNT, TARIFF_PRICES } from '@gm/shared'
import { eq, sql } from 'drizzle-orm'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { consents, orders } from '../../db/schema'
import { closeDatabase, prepareDatabase, testDb } from '../../test/db'
import { createOrder, findOrderStatus } from './service'
import type { CreateOrderBody } from './schema'

const meta = { ip: '203.0.113.10', userAgent: 'Mozilla/5.0 (тест)' }

/**
 * Имя сработавшего ограничения. Drizzle заворачивает ошибку драйвера, и в
 * тексте остаётся только «Failed query»; имя лежит в `cause.constraint` —
 * это поле ответа самого Postgres. Проверять по нему точнее, чем по
 * подстроке: видно, что упало именно нужное ограничение, а не соседнее.
 */
async function violatedConstraint(run: () => Promise<unknown>) {
  try {
    await run()
  } catch (error) {
    return (error as { cause?: { constraint?: string } }).cause?.constraint
  }

  throw new Error('Ожидалась ошибка ограничения, но запрос прошёл')
}

function body(overrides: Partial<CreateOrderBody> = {}): CreateOrderBody {
  return {
    tariffId: 'premium',
    action: 'full',
    phone: '+7(999)123-45-67',
    email: 'coach@example.com',
    consentPd: true,
    consentAds: false,
    idempotencyKey: `key-${Math.random().toString(36).slice(2, 12)}`,
    ...overrides,
  }
}

beforeEach(prepareDatabase)
afterAll(closeDatabase)

describe('создание заказа', () => {
  it('пишет заказ и согласие на обработку данных', async () => {
    const { order, repeated } = await createOrder(testDb, body(), meta)

    expect(repeated).toBe(false)
    expect(order.status).toBe('new')
    expect(order.paidKopecks).toBe(0)
    expect(order.totalKopecks).toBe(TARIFF_PRICES.premium * 100)

    const written = await testDb.select().from(consents).where(eq(consents.orderId, order.id))

    expect(written).toHaveLength(1)
    expect(written[0]?.kind).toBe('pd')
    expect(written[0]?.textVersion).toBe('1.0')
    // Адрес и клиент нужны как доказательство факта согласия по 152-ФЗ.
    expect(written[0]?.ip).toBe(meta.ip)
    expect(written[0]?.userAgent).toBe(meta.userAgent)
  })

  it('согласие на рекламу пишется отдельной строкой и только когда дано', async () => {
    const { order } = await createOrder(testDb, body({ consentAds: true }), meta)

    const written = await testDb.select().from(consents).where(eq(consents.orderId, order.id))

    expect(written.map((row) => row.kind).sort()).toEqual(['ads', 'pd'])
  })

  it('бронь хранит полную стоимость тарифа, иначе не посчитать остаток', async () => {
    const { order } = await createOrder(testDb, body({ tariffId: 'vip', action: 'reserve' }), meta)

    expect(order.totalKopecks).toBe(TARIFF_PRICES.vip * 100)
    expect(order.action).toBe('reserve')
  })

  it('чистит ник Telegram от собаки', async () => {
    const { order } = await createOrder(testDb, body({ telegram: '@coach_gm' }), meta)

    expect(order.customerTelegram).toBe('coach_gm')
  })

  it('номер заказа и токен у каждого заказа свои', async () => {
    const first = await createOrder(testDb, body(), meta)
    const second = await createOrder(testDb, body(), meta)

    expect(first.order.publicId).not.toBe(second.order.publicId)
    expect(first.order.accessToken).not.toBe(second.order.accessToken)
  })
})

describe('идемпотентность', () => {
  it('повтор с тем же ключом возвращает тот же заказ и не создаёт второй', async () => {
    const payload = body()

    const first = await createOrder(testDb, payload, meta)
    const second = await createOrder(testDb, payload, meta)

    expect(second.repeated).toBe(true)
    expect(second.order.id).toBe(first.order.id)
    expect(second.order.publicId).toBe(first.order.publicId)

    const rows = await testDb.select({ count: sql<number>`count(*)::int` }).from(orders)

    expect(rows[0]?.count).toBe(1)
  })

  it('повтор не добавляет вторую запись согласия', async () => {
    const payload = body({ consentAds: true })

    const { order } = await createOrder(testDb, payload, meta)
    await createOrder(testDb, payload, meta)

    const written = await testDb.select().from(consents).where(eq(consents.orderId, order.id))

    expect(written).toHaveLength(2)
  })

  it('одновременные запросы с одним ключом дают один заказ', async () => {
    const payload = body()

    // Настоящая гонка: пять параллельных соединений из пула. Это то, ради
    // чего идемпотентность сделана уникальным индексом, а не проверкой
    // «есть ли уже такой» перед вставкой.
    const results = await Promise.all(
      Array.from({ length: 5 }, () => createOrder(testDb, payload, meta)),
    )

    const ids = new Set(results.map((result) => result.order.id))
    expect(ids.size).toBe(1)
    expect(results.filter((result) => !result.repeated)).toHaveLength(1)
  })
})

describe('ограничения базы', () => {
  it('не даёт записать оплату больше стоимости заказа', async () => {
    const { order } = await createOrder(testDb, body(), meta)

    const constraint = await violatedConstraint(() =>
      testDb
        .update(orders)
        .set({ paidKopecks: order.totalKopecks + 1 })
        .where(eq(orders.id, order.id)),
    )

    expect(constraint).toBe('orders_paid_in_range')
  })

  it('не даёт отрицательную оплату', async () => {
    const { order } = await createOrder(testDb, body(), meta)

    const constraint = await violatedConstraint(() =>
      testDb.update(orders).set({ paidKopecks: -1 }).where(eq(orders.id, order.id)),
    )

    expect(constraint).toBe('orders_paid_in_range')
  })

  it('заказ на ноль рублей невозможен', async () => {
    const constraint = await violatedConstraint(() =>
      testDb.insert(orders).values({
        publicId: 'GM-ZERO0000',
        accessToken: 'x'.repeat(48),
        idempotencyKey: 'zero-order-key',
        tariffId: 'standard',
        action: 'full',
        totalKopecks: 0,
        customerPhone: '+7(999)123-45-67',
        customerEmail: 'zero@example.com',
      }),
    )

    expect(constraint).toBe('orders_total_positive')
  })
})

describe('статус заказа', () => {
  it('отдаётся по верному токену и считает остаток', async () => {
    const { order } = await createOrder(testDb, body({ action: 'reserve' }), meta)

    await testDb
      .update(orders)
      .set({ paidKopecks: RESERVE_AMOUNT * 100, status: 'partially_paid' })
      .where(eq(orders.id, order.id))

    const status = await findOrderStatus(testDb, order.publicId, order.accessToken)

    expect(status?.status).toBe('partially_paid')
    expect(status?.remainderKopecks).toBe((TARIFF_PRICES.premium - RESERVE_AMOUNT) * 100)
  })

  it('с чужим токеном отвечает так же, как на несуществующий заказ', async () => {
    const { order } = await createOrder(testDb, body(), meta)

    expect(await findOrderStatus(testDb, order.publicId, 'чужой-токен')).toBeNull()
    expect(await findOrderStatus(testDb, 'GM-NOSUCH00', order.accessToken)).toBeNull()
  })
})
