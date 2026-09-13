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

      request.log.info(
        { publicId: order.publicId, tariffId: order.tariffId, action: order.action, repeated },
        repeated ? 'Повтор заказа по тому же ключу' : 'Заказ создан',
      )

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

      if (!status) return response.code(404).send({ message: 'Заказ не найден' })

      return status
    },
  )
}
