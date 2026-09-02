/**
 * Точка входа: поднимает порт и корректно гасит процесс.
 *
 * Аккуратное завершение здесь не украшение. `docker compose up -d` при
 * выкладке шлёт SIGTERM; если оборвать процесс на середине обработки
 * вебхука, платёж останется неотмеченным, а повтора от платёжки может и не
 * прийти. Поэтому по сигналу сервер перестаёт принимать новые запросы,
 * доигрывает текущие и только потом закрывает пул соединений.
 */

import { buildApp } from './app'
import { config } from './config'

const app = await buildApp()

async function shutdown(signal: string) {
  app.log.info({ signal }, 'Останавливаюсь')

  // Если за 10 секунд не управились — уходим жёстко, иначе контейнер
  // повиснет и его всё равно убьют, но уже без записи в журнале.
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
