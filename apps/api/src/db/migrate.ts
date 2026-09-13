import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { config } from '../config'

const pool = new Pool({ connectionString: config.DATABASE_URL, max: 1 })

try {
  await migrate(drizzle({ client: pool }), { migrationsFolder: 'drizzle' })
  console.log('Миграции накатаны')
} catch (error) {
  console.error('Миграции не накатились:', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
