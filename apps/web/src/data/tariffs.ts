import type { PayAction, TariffId } from '@gm/shared'
import { RESERVE_AMOUNT, TARIFF_NAMES, TARIFF_PRICES } from '@gm/shared'

export type { PayAction, TariffId }
export { RESERVE_AMOUNT }

export type Tariff = {
  id: TariffId
  name: string
  price: number
  hit?: boolean
  accent: string
}

export const TARIFFS: Tariff[] = [
  { id: 'standard', name: TARIFF_NAMES.standard, price: TARIFF_PRICES.standard, accent: '#9FB4CC' },
  {
    id: 'premium',
    name: TARIFF_NAMES.premium,
    price: TARIFF_PRICES.premium,
    hit: true,
    accent: '#6AA0FF',
  },
  { id: 'vip', name: TARIFF_NAMES.vip, price: TARIFF_PRICES.vip, accent: '#FFC14A' },
]

export function tariff(id: TariffId): Tariff {
  const found = TARIFFS.find((item) => item.id === id)
  if (!found) throw new Error(`Нет тарифа с ключом «${id}»`)
  return found
}

export function formatPrice(price: number) {
  return `${price.toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽`
}

export type TariffFeature = {
  key: string
  title: string
  in: Record<TariffId, boolean>
  learningKey?: string
  group?: 'modules'
}

export const FEATURES: TariffFeature[] = [
  {
    key: 'module-1',
    title: 'Модуль 1. Требования игры — основа планирования подготовки',
    group: 'modules',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'module-2',
    title: 'Модуль 2. Адаптационные возможности футболистов — основа планирования нагрузок',
    group: 'modules',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'module-3',
    title: 'Модуль 3. Тренировочная и соревновательная нагрузка',
    group: 'modules',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'module-4',
    title: 'Модуль 4. Планирование подготовки',
    group: 'modules',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'module-5',
    title: 'Модуль 5. Контроль состояния, тренировочных и соревновательных нагрузок',
    group: 'modules',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'bonus',
    title: 'Бонусный модуль: командная тактика',
    in: { standard: false, premium: true, vip: true },
  },
  {
    key: 'chat',
    title: 'Обратная связь в чате',
    learningKey: 'feedback',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'homework',
    title: 'Обратная связь при проверке домашних заданий',
    learningKey: 'feedback',
    in: { standard: false, premium: true, vip: true },
  },
  {
    key: 'practice',
    title: 'Практика',
    learningKey: 'practice',
    in: { standard: false, premium: true, vip: true },
  },
  {
    key: 'nanofootball',
    title: 'Бесплатный доступ к цифровой среде NANOFOOTBALL',
    learningKey: 'nanofootball',
    in: { standard: false, premium: true, vip: true },
  },
  {
    key: 'scoutway',
    title: 'Бесплатный доступ к платформе SCOUTWAY',
    learningKey: 'scoutway',
    in: { standard: false, premium: false, vip: true },
  },
  {
    key: 'reviews',
    title: 'Разборы тренировок',
    learningKey: 'reviews',
    in: { standard: false, premium: true, vip: true },
  },
  {
    key: 'certificate',
    title: 'Сертификат',
    learningKey: 'certificate',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'portfolio',
    title: 'Тренерское портфолио',
    learningKey: 'portfolio',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'community',
    title: 'Доступ в закрытое тренерское сообщество',
    learningKey: 'community',
    in: { standard: true, premium: true, vip: true },
  },
  {
    key: 'consultations',
    title: 'Индивидуальные консультации с Гаджиевым Гаджи Муслимовичем',
    in: { standard: false, premium: false, vip: true },
  },
]

export const MATRIX_FOLDED: TariffFeature[] = [
  {
    key: 'modules',
    title: 'Модули 1–5 программы',
    in: { standard: true, premium: true, vip: true },
  },
  ...FEATURES.filter((feature) => feature.group !== 'modules'),
]

export function includedIn(id: TariffId, list: TariffFeature[] = FEATURES) {
  return list.filter((feature) => feature.in[id])
}

export function addedIn(id: TariffId, list: TariffFeature[] = FEATURES) {
  const index = TARIFFS.findIndex((item) => item.id === id)
  const previous = TARIFFS[index - 1]
  if (!previous) return includedIn(id, list)
  return list.filter((feature) => feature.in[id] && !feature.in[previous.id])
}

export const HIGHLIGHTS: Record<TariffId, string[]> = {
  standard: ['modules', 'certificate', 'portfolio'],
  premium: ['practice', 'nanofootball', 'reviews'],
  vip: ['scoutway', 'nanofootball', 'consultations'],
}

export function highlightsOf(id: TariffId): TariffFeature[] {
  return HIGHLIGHTS[id].map((key) => {
    const found = MATRIX_FOLDED.find((feature) => feature.key === key)
    if (!found) throw new Error(`Нет позиции с ключом «${key}»`)
    return found
  })
}

export type PayMethod = {
  key: 'sbp' | 'card' | 'installment' | 'islamic'
  title: string
  desc: string
  message?: string
}

export const PAY_METHODS: PayMethod[] = [
  { key: 'sbp', title: 'СБП', desc: 'По QR-коду или из приложения банка' },
  {
    key: 'card',
    title: 'Оплата любой картой РФ',
    desc: 'МИР, Visa и Mastercard российских банков',
  },
  { key: 'installment', title: 'Банковская рассрочка', desc: 'Условия зависят от банка' },
  {
    key: 'islamic',
    title: 'Исламская рассрочка',
    desc: 'Оформляется индивидуально',
    message: 'Здравствуйте! Хочу оформить оплату курса по исламской рассрочке.',
  },
]

export const PAY_PROVIDER = 'Prodamus'

export type PayButton = {
  action: PayAction
  label: string
  emphasis: 'loud' | 'quiet'
}

export const PAY_BUTTONS: PayButton[] = [
  { action: 'reserve', label: `Забронировать за ${formatPrice(RESERVE_AMOUNT)}`, emphasis: 'quiet' },
  { action: 'full', label: 'Оплатить полностью', emphasis: 'loud' },
]

export const WHATSAPP_NUMBER = ''

export const CONTACT_LINKS: { key: string; label: string; message: string }[] = [
  {
    key: 'installment',
    label: 'Узнать про условия рассрочки',
    message: 'Здравствуйте! Расскажите, пожалуйста, про условия рассрочки на курс.',
  },
  {
    key: 'clubs',
    label: 'Узнать про условия для клубов и академий',
    message: 'Здравствуйте! Мы клуб/академия, хотим узнать условия для команды.',
  },
  {
    key: 'modules',
    label: 'Узнать про приобретение отдельных модулей',
    message: 'Здравствуйте! Интересует покупка отдельных модулей курса.',
  },
]

export const CONTACT_ACTION = CONTACT_LINKS[0]

export function whatsappHref(message: string) {
  if (!WHATSAPP_NUMBER) return undefined
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

