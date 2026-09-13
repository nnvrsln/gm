import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

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

    console.error(`Окружение не проходит проверку:\n${problems}`)
    process.exit(1)
  }

  return parsed.data
}

export const config = load()

export const isProduction = config.NODE_ENV === 'production'
