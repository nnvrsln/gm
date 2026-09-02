/**
 * Подключение к Postgres: пул `pg` + Drizzle поверх него.
 *
 * Плагин обёрнут в `fastify-plugin`, то есть намеренно **ломает**
 * изоляцию: подключение к базе нужно всем модулям, и заводить его каждому
 * по отдельности значит завести несколько пулов к одной базе.
 *
 * Размер пула маленький и это не экономия на спичках. VPS один процессор,
 * Postgres настроен на `max_connections=20`, а очередь pg-boss возьмёт
 * оттуда же свою долю. Десять соединений на API — с запасом: при десятках
 * заказов в день одновременных запросов почти не бывает.
 */

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
    /** Быстрая проверка живости соединения для `/health`. */
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

  // Пул переживает разрыв соединения сам, но молча: без этого обработчика
  // ошибка простаивающего клиента роняет процесс целиком.
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
