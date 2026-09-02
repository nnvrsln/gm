/**
 * Тесты того, что можно проверить без базы: расчёт денег, проверка входа и
 * формат номера заказа.
 *
 * Поведение самих маршрутов (идемпотентность, транзакция с согласиями)
 * проверяется против живого Postgres и появится вместе с ним: подделывать
 * базу заглушками ради «зелёных» тестов на платёжном бэкенде бессмысленно —
 * ровно в различиях между заглушкой и настоящей БД и живут ошибки.
 */

import { RESERVE_AMOUNT, TARIFF_PRICES, orderAmounts } from '@gm/shared'
import { describe, expect, it } from 'vitest'
import { createOrderBody } from './schema'
import { publicId } from './service'

const valid = {
  tariffId: 'premium',
  action: 'full',
  phone: '+7(999)123-45-67',
  email: 'coach@example.com',
  consentPd: true,
  consentAds: false,
  idempotencyKey: 'a1b2c3d4e5f6',
}

describe('расчёт сумм', () => {
  it('полная оплата берёт цену тарифа целиком', () => {
    const amounts = orderAmounts('premium', 'full')

    expect(amounts.total).toBe(TARIFF_PRICES.premium * 100)
    expect(amounts.charge).toBe(amounts.total)
    expect(amounts.remainder).toBe(0)
  })

  it('бронь списывает 10 000 ₽ и оставляет остаток', () => {
    const amounts = orderAmounts('vip', 'reserve')

    expect(amounts.charge).toBe(RESERVE_AMOUNT * 100)
    expect(amounts.total).toBe(TARIFF_PRICES.vip * 100)
    expect(amounts.remainder).toBe((TARIFF_PRICES.vip - RESERVE_AMOUNT) * 100)
  })

  it('полная стоимость у брони не теряется — иначе не посчитать доплату', () => {
    for (const tariff of ['standard', 'premium', 'vip'] as const) {
      const amounts = orderAmounts(tariff, 'reserve')
      expect(amounts.charge + amounts.remainder).toBe(amounts.total)
    }
  })
})

describe('проверка входа', () => {
  it('пропускает заполненную форму', () => {
    expect(createOrderBody.safeParse(valid).success).toBe(true)
  })

  it('не принимает сумму от клиента: лишние поля отбрасываются', () => {
    const parsed = createOrderBody.parse({ ...valid, totalKopecks: 1, price: 100 })

    expect(parsed).not.toHaveProperty('totalKopecks')
    expect(parsed).not.toHaveProperty('price')
  })

  it('отклоняет несуществующий тариф', () => {
    expect(createOrderBody.safeParse({ ...valid, tariffId: 'platinum' }).success).toBe(false)
  })

  it('отклоняет телефон не по маске формы', () => {
    for (const phone of ['79991234567', '+7 999 123 45 67', '8(999)123-45-67', '']) {
      expect(createOrderBody.safeParse({ ...valid, phone }).success).toBe(false)
    }
  })

  it('без согласия на обработку данных заказа нет', () => {
    expect(createOrderBody.safeParse({ ...valid, consentPd: false }).success).toBe(false)
  })

  it('согласие на рекламу необязательно и по умолчанию снято', () => {
    const { consentAds: _omitted, ...withoutAds } = valid

    expect(createOrderBody.parse(withoutAds).consentAds).toBe(false)
  })

  it('пустые необязательные поля не считаются ошибкой', () => {
    const parsed = createOrderBody.safeParse({ ...valid, telegram: '', whatsapp: '' })

    expect(parsed.success).toBe(true)
  })

  it('заполненный Telegram проверяется', () => {
    expect(createOrderBody.safeParse({ ...valid, telegram: '@coach_gm' }).success).toBe(true)
    expect(createOrderBody.safeParse({ ...valid, telegram: 'ы' }).success).toBe(false)
  })
})

describe('номер заказа', () => {
  it('не содержит символов, которые путают при переписывании', () => {
    const ids = Array.from({ length: 500 }, () => publicId())

    for (const id of ids) {
      expect(id).toMatch(/^GM-[2-9A-HJ-NP-Z]{8}$/)
    }
  })

  it('не повторяется', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => publicId()))

    expect(ids.size).toBe(1000)
  })
})
