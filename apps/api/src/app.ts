/**
 * Сборка приложения. Отдельно от запуска (`server.ts`) намеренно: тесты
 * поднимают `buildApp()` и стучатся через `app.inject()`, не занимая порт.
 *
 * ── Структура ────────────────────────────────────────────────────────────
 * Модули лежат в `modules/<имя>/` и регистрируются здесь одной строкой.
 * Каждый плагин Fastify получает свой скоуп: модуль не видит внутренностей
 * соседа. Общими становятся только вещи, обёрнутые в `fastify-plugin` —
 * сейчас это подключение к базе.
 */

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
      // Тело запроса в журнал не попадает никогда: в нём телефон и почта
      // покупателя. Пишем только то, по чему потом ищут проблему.
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      serializers: {
        req: (request) => ({ method: request.method, url: request.url }),
      },
    },
    // За Caddy: без этого в журнале будет IP прокси, а не покупателя, и
    // сломается ограничение частоты запросов.
    trustProxy: true,
    // Prodamus присылает вебхук как обычную форму; тело нужно и сырым, для
    // проверки подписи, поэтому лимит сознательно небольшой.
    bodyLimit: 256 * 1024,
    // Строка на каждый запрос пишется всегда: на платёжном бэкенде именно
    // по ней потом восстанавливают, что происходило. От шума спасает не
    // отключение, а `logLevel` на конкретных маршрутах — так сделан
    // `/health`, куда раз в минуту стучится пинговалка.
  }).withTypeProvider<ZodTypeProvider>()

  // Zod проверяет вход и сериализует выход: одна декларация схемы даёт и
  // валидацию, и типы обработчика.
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(databasePlugin)

  // Глобального лимита нет: он одинаково душил бы и создание заказа, и
  // вебхук платёжки, которому мешать нельзя. Ограничение включается на
  // конкретных маршрутах через `config.rateLimit`.
  await app.register(rateLimit, { global: false })

  await app.register(healthRoutes, { prefix: '/api' })
  await app.register(orderRoutes, { prefix: '/api' })

  return app
}
