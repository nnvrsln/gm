import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

let database: ReturnType<typeof createDatabase> | undefined

function createDatabase() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured')
  }

  const pool = new Pool({
    connectionString,
    // В Vercel используем pooled URL Neon/Supabase и не размножаем TCP-соединения.
    max: process.env.VERCEL ? 1 : 5,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  })

  return drizzle({ client: pool, schema })
}

export function getDatabase() {
  database ??= createDatabase()
  return database
}
