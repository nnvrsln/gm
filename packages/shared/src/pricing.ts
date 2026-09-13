export type TariffId = 'standard' | 'premium' | 'vip'

export type PayAction = 'full' | 'reserve'

export const TARIFF_ORDER = ['standard', 'premium', 'vip'] as const satisfies readonly TariffId[]

export const TARIFF_NAMES: Record<TariffId, string> = {
  standard: 'Стандарт',
  premium: 'Премиум',
  vip: 'ВИП',
}

export const TARIFF_PRICES: Record<TariffId, number> = {
  standard: 49_900,
  premium: 64_900,
  vip: 99_900,
}

export const RESERVE_AMOUNT = 10_000

export function isTariffId(value: unknown): value is TariffId {
  return typeof value === 'string' && value in TARIFF_PRICES
}

export function isPayAction(value: unknown): value is PayAction {
  return value === 'full' || value === 'reserve'
}

export function toKopecks(rubles: number) {
  return Math.round(rubles * 100)
}

export function orderAmounts(tariffId: TariffId, action: PayAction) {
  const total = toKopecks(TARIFF_PRICES[tariffId])
  const charge = action === 'reserve' ? toKopecks(RESERVE_AMOUNT) : total

  return { total, charge, remainder: total - charge }
}
