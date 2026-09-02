/**
 * Проверка входа при создании заказа.
 *
 * Правила для контактных полей взяты из `@gm/shared` — теми же проверяет
 * форма на странице. Разъехавшиеся правила дают худший из возможных
 * сценариев: страница говорит «всё верно», сервер тот же ввод отклоняет.
 *
 * Чего здесь принципиально нет — **суммы**. Клиент присылает тариф и
 * действие, рубли считает сервер. Иначе цену курса правят в консоли
 * браузера.
 */

import {
  EMAIL_RE,
  PHONE_RE,
  TARIFF_ORDER,
  TELEGRAM_RE,
  type CreateOrderRequest,
} from '@gm/shared'
import { z } from 'zod'

export const createOrderBody = z.object({
  tariffId: z.enum(TARIFF_ORDER),
  action: z.enum(['full', 'reserve']),

  phone: z.string().regex(PHONE_RE, 'Телефон в формате +7(999)000-00-00'),
  email: z.string().trim().max(320).regex(EMAIL_RE, 'Проверьте адрес почты'),

  // Необязательные поля: пустая строка и отсутствие значения — одно и то же.
  telegram: z
    .string()
    .trim()
    .max(100)
    .regex(TELEGRAM_RE, 'Ник в Telegram: латиница, цифры и подчёркивание')
    .optional()
    .or(z.literal('')),
  whatsapp: z
    .string()
    .regex(PHONE_RE, 'WhatsApp в формате +7(999)000-00-00')
    .optional()
    .or(z.literal('')),

  // Согласие на обработку данных обязательно и не может быть false: без
  // него нет законного основания хранить телефон и почту.
  consentPd: z.literal(true, { error: 'Без согласия на обработку данных заказ невозможен' }),
  consentAds: z.boolean().default(false),

  idempotencyKey: z.string().trim().min(8).max(64),

  // utm-меток может не быть вовсе; чужие ключи не фильтруем, но объём
  // ограничиваем — это поле приходит из адресной строки.
  utm: z.record(z.string().max(64), z.string().max(256)).optional(),
})

/** Тип из схемы обязан совпадать с общим контрактом — иначе не соберётся. */
export type CreateOrderBody = z.infer<typeof createOrderBody> & CreateOrderRequest

export const orderStatusParams = z.object({
  publicId: z.string().trim().min(4).max(16),
})

export const orderStatusQuery = z.object({
  token: z.string().trim().min(16).max(64),
})
