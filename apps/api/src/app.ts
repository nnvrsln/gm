import rateLimit from '@fastify/rate-limit'
import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { config } from './config'
import databasePlugin from './plugins/db'
import { healthRoutes } from './modules/health/routes'
import { orderRoutes } from './modules/orders/routes'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      serializers: {
        req: (request) => ({ method: request.method, url: request.url }),
      },
    },
    trustProxy: 'loopback,uniquelocal',
    bodyLimit: 256 * 1024,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(databasePlugin)

  await app.register(rateLimit, { global: false })

  await app.register(healthRoutes, { prefix: '/api' })
  await app.register(orderRoutes, { prefix: '/api' })

  return app
}
