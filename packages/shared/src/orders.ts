/**
 * Контракт заказа: что страница отправляет серверу и что получает назад.
 *
 * Здесь только типы — ни одной проверки во время работы. Это осознанно:
 * пакет тянут обе стороны, а на странице лендинга не должно появиться
 * библиотеки валидации ради одной формы. Проверяет вход сервер (Zod в
 * `apps/api/src/modules/orders/schema.ts`), а типы отсюда следят, чтобы
 * стороны говорили об одних и тех же полях.
 *
 * Регулярные выражения для полей — в `contacts.ts`, они общие.
 */

import type { PayAction, TariffId } from './pricing'

/**
 * Статусы заказа. `partially_paid` — это внесённая бронь: 10 000 ₽ есть,
 * остаток нет. Ради него у заказа и хранятся две суммы вместо флага
 * «оплачен».
 */
export type OrderStatus =
  | 'new'
  | 'awaiting_payment'
  | 'partially_paid'
  | 'paid'
  | 'cancelled'

export type CreateOrderRequest = {
  tariffId: TariffId
  action: PayAction
  /** Под маской: +7(999)000-00-00. */
  phone: string
  email: string
  telegram?: string
  whatsapp?: string
  /** Согласие на обработку персональных данных. Без него заказа нет. */
  consentPd: boolean
  /** Согласие на рекламную рассылку. Отдельное основание, может быть false. */
  consentAds: boolean
  /**
   * Ключ повтора. Генерируется страницей один раз на нажатие кнопки:
   * двойной тап по мобильной кнопке не должен создавать второй заказ.
   */
  idempotencyKey: string
  utm?: Record<string, string>
}

export type CreateOrderResponse = {
  /** Короткий номер, который называют человеку и по которому ищут заказ. */
  publicId: string
  /** Ключ к статусу заказа для страницы «спасибо». */
  accessToken: string
  status: OrderStatus
  /** Стоимость тарифа целиком. */
  totalKopecks: number
  /** Сколько платят на этом шаге: вся сумма или бронь. */
  chargeKopecks: number
  /** Ссылка на платёжную форму. Появится вместе с Prodamus. */
  paymentUrl: string | null
}

export type OrderStatusResponse = {
  publicId: string
  status: OrderStatus
  tariffId: TariffId
  action: PayAction
  totalKopecks: number
  paidKopecks: number
  /** Сколько осталось довнести. Ноль — заказ закрыт. */
  remainderKopecks: number
}
