import type { PayAction, TariffId } from './pricing'

export type OrderStatus =
  | 'new'
  | 'awaiting_payment'
  | 'partially_paid'
  | 'paid'
  | 'cancelled'

export type CreateOrderRequest = {
  tariffId: TariffId
  action: PayAction
  phone: string
  email: string
  telegram?: string
  whatsapp?: string
  consentPd: boolean
  consentAds: boolean
  idempotencyKey: string
  utm?: Record<string, string>
}

export type CreateOrderResponse = {
  publicId: string
  accessToken: string
  status: OrderStatus
  totalKopecks: number
  chargeKopecks: number
  paymentUrl: string | null
}

export type OrderStatusResponse = {
  publicId: string
  status: OrderStatus
  tariffId: TariffId
  action: PayAction
  totalKopecks: number
  paidKopecks: number
  remainderKopecks: number
}
