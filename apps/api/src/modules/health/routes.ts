/**
 * Проверка живости.
 *
 * Отвечает 200 только если жива **и** база: сервер, который отвечает «всё
 * хорошо» с отвалившимся Postgres, бесполезен — именно в этом состоянии
 * оплаты проходят у платёжки, а заказы у нас не отмечаются.
 *
 * По этому же адресу ходит healthcheck контейнера и внешняя пинговалка.
 * Отдельно от него нужно мониторить адрес вебхука Prodamus
 * (`docs/tz/06-BACKEND.md`): живой `/health` ещё не значит, что вебхук
 * принимается.
 */

import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

const reply = z.object({
  status: z.enum(['ok', 'degraded']),
  db: z.enum(['ok', 'down']),
  uptime: z.number(),
})

export async function healthRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health',
    {
      schema: { response: { 200: reply, 503: reply } },
      logLevel: 'warn', // иначе пинговалка забивает журнал строкой раз в минуту
    },
    async (_request, response) => {
      try {
        await app.pingDatabase()
      } catch (error) {
        app.log.error({ err: error }, 'База не отвечает')
        return response.code(503).send({ status: 'degraded', db: 'down', uptime: process.uptime() })
      }

      return { status: 'ok' as const, db: 'ok' as const, uptime: process.uptime() }
    },
  )
}
