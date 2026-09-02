/**
 * Маршруты заказа.
 *
 * Платёжки здесь ещё нет: `paymentUrl` в ответе всегда `null`, заказ
 * ложится в базу со статусом `new`. Ссылка появится следующим шагом
 * (`docs/tz/06-BACKEND.md`, этап 4) — поле в контракте уже есть, чтобы
 * страница не переписывалась дважды.
 */

import { orderAmounts } from '@gm/shared'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { createOrderBody, orderStatusParams, orderStatusQuery } from './schema'
import { createOrder, findOrderStatus } from './service'

export async function orderRoutes(app: FastifyInstance) {
  const routes = app.withTypeProvider<ZodTypeProvider>()

  routes.post(
    '/orders',
    {
      schema: { body: createOrderBody },
      config: {
        // Форму заполняют минуту, а не десять раз в минуту. Ограничение
        // бьёт по перебору и по скрипту, а живому человеку не мешает.
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
    },
    async (request, response) => {
      const body = request.body
      const amounts = orderAmounts(body.tariffId, body.action)

      const { order, repeated } = await createOrder(app.db, body, {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      })

      // Номер заказа в журнал пишем, контакты — нет: по номеру находится
      // всё остальное, а телефон и почта в логах не нужны никому.
      request.log.info(
        { publicId: order.publicId, tariffId: order.tariffId, action: order.action, repeated },
        repeated ? 'Повтор заказа по тому же ключу' : 'Заказ создан',
      )

      // Повтор — это не создание, поэтому 200, а не 201. Тело то же самое:
      // страница не должна различать первую отправку и вторую.
      return response.code(repeated ? 200 : 201).send({
        publicId: order.publicId,
        accessToken: order.accessToken,
        status: order.status,
        totalKopecks: order.totalKopecks,
        chargeKopecks: amounts.charge,
        paymentUrl: null,
      })
    },
  )

  routes.get(
    '/orders/:publicId',
    {
      schema: { params: orderStatusParams, querystring: orderStatusQuery },
    },
    async (request, response) => {
      const status = await findOrderStatus(app.db, request.params.publicId, request.query.token)

      // Неверный токен и несуществующий заказ отвечают одинаково: иначе по
      // разнице ответов перебирают номера заказов.
      if (!status) return response.code(404).send({ message: 'Заказ не найден' })

      return status
    },
  )
}
