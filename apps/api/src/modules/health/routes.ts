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
      logLevel: 'warn',
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
