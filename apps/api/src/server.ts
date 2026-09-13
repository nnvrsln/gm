import { buildApp } from './app'
import { config } from './config'

const app = await buildApp()

async function shutdown(signal: string) {
  app.log.info({ signal }, 'Останавливаюсь')

  const guard = setTimeout(() => {
    app.log.error('Не успел остановиться за 10 секунд, выхожу принудительно')
    process.exit(1)
  }, 10_000)
  guard.unref()

  try {
    await app.close()
    process.exit(0)
  } catch (error) {
    app.log.error({ err: error }, 'Ошибка при остановке')
    process.exit(1)
  }
}

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.once(signal, () => void shutdown(signal))
}

try {
  await app.listen({ host: config.HOST, port: config.PORT })
} catch (error) {
  app.log.fatal({ err: error }, 'Не удалось занять порт')
  process.exit(1)
}
