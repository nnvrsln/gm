/**
 * Подключение к тестовой базе.
 *
 * Это **настоящий** PostgreSQL, а не заглушка: проверять на подделке
 * идемпотентность и ограничения таблиц бессмысленно — ровно в различиях
 * между подделкой и живой базой ошибки и живут. Транзакции, `ON CONFLICT`
 * и `CHECK` должны быть теми же, что в проде.
 *
 * Схема накатывается той же миграцией, что и на рабочую базу: если
 * миграция сломана, тесты обязаны падать первыми.
 *
 * Файл намеренно не импортирует `config.ts` — тот проверяет `DATABASE_URL`
 * и завершает процесс, а тестам нужна другая строка подключения.
 */

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { sql } from 'drizzle-orm'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const url = process.env.DATABASE_URL_TEST

if (!url) {
  throw new Error(
    'Нет DATABASE_URL_TEST. Тесты с базой требуют отдельной базы: ' +
      'создайте gm_test и пропишите строку подключения в .env',
  )
}

const pool = new Pool({ connectionString: url, max: 4 })

export const testDb = drizzle({ client: pool, schema })

let migrated = false

export async function prepareDatabase() {
  if (!migrated) {
    await migrate(testDb, { migrationsFolder: 'drizzle' })
    migrated = true
  }

  await truncateAll()
}

/**
 * Чистим таблицы, а не пересоздаём схему: так между тестами уходят секунды,
 * а не минуты. `restart identity cascade` заодно снимает зависимости по
 * внешним ключам, которых из-за `restrict` иначе не обойти.
 */
export async function truncateAll() {
  await testDb.execute(
    sql`truncate table payment_events, consents, payments, orders restart identity cascade`,
  )
}

export async function closeDatabase() {
  await pool.end()
}
