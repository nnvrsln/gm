/**
 * Конфигурация из окружения.
 *
 * Читается и проверяется **один раз при старте**, до того как поднимется
 * сервер. Если переменной не хватает или она бессмысленна — процесс падает
 * с внятным перечнем проблем и не стартует вовсе.
 *
 * Так сделано намеренно. Платёжный бэкенд, который поднялся без
 * `DATABASE_URL` и выяснил это на первом заказе, теряет заказ. Лучше не
 * подняться совсем: контейнер уйдёт в рестарт-петлю, это видно сразу.
 *
 * Секреты Prodamus, amoCRM и Telegram появятся здесь по мере подключения
 * (`docs/tz/06-BACKEND.md`, раздел «Переменные окружения»). Добавлять их
 * заранее пустыми нельзя: тогда проверка перестанет что-либо значить.
 */

import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /** Слушаем 0.0.0.0: внутри контейнера localhost недоступен снаружи. */
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3000),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  DATABASE_URL: z
    .string({ error: 'не задан; строка подключения postgres://пользователь:пароль@хост:порт/база' })
    .url('должен быть строкой подключения postgres://…'),
})

export type Config = z.infer<typeof schema>

function load(): Config {
  const parsed = schema.safeParse(process.env)

  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(корень)'}: ${issue.message}`)
      .join('\n')

    // Не через логер: логер поднимается позже и сам зависит от конфига.
    console.error(`Окружение не проходит проверку:\n${problems}`)
    process.exit(1)
  }

  return parsed.data
}

export const config = load()

export const isProduction = config.NODE_ENV === 'production'
