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

export async function truncateAll() {
  await testDb.execute(
    sql`truncate table payment_events, consents, payments, orders restart identity cascade`,
  )
}

export async function closeDatabase() {
  await pool.end()
}
