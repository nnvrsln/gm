import { drizzle } from 'drizzle-orm/node-postgres'
import { sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Pool } from 'pg'
import { config } from '../config'
import * as schema from '../db/schema'

export type Database = ReturnType<typeof drizzle<typeof schema>>

declare module 'fastify' {
  interface FastifyInstance {
    db: Database
    pingDatabase: () => Promise<void>
  }
}

async function databasePlugin(app: FastifyInstance) {
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  })

  pool.on('error', (error) => {
    app.log.error({ err: error }, 'Ошибка простаивающего соединения с базой')
  })

  const db = drizzle({ client: pool, schema })

  app.decorate('db', db)
  app.decorate('pingDatabase', async () => {
    await db.execute(sql`select 1`)
  })

  app.addHook('onClose', async () => {
    await pool.end()
  })
}

export default fp(databasePlugin, { name: 'db' })
