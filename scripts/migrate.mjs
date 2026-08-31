import { readFile } from 'node:fs/promises'
import process from 'node:process'
import pg from 'pg'

try {
  process.loadEnvFile('.env.local')
} catch (error) {
  if (error?.code === 'ENOENT') {
    throw new Error('Создайте .env.local по примеру .env.example')
  }
  throw error
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('В .env.local отсутствует DATABASE_URL')

const targetUrl = new URL(connectionString)
const databaseName = decodeURIComponent(targetUrl.pathname.slice(1))
if (!databaseName) throw new Error('В DATABASE_URL не указано имя базы')

const adminUrl = new URL(targetUrl)
adminUrl.pathname = '/postgres'

const admin = new pg.Client({ connectionString: adminUrl.toString() })
await admin.connect()

try {
  const existing = await admin.query('select 1 from pg_database where datname = $1', [databaseName])
  if (!existing.rowCount) {
    await admin.query(`create database ${quoteIdentifier(databaseName)}`)
    console.log(`Создана база ${databaseName}`)
  }
} finally {
  await admin.end()
}

const migration = await readFile('db/migrations/0000_initial.sql', 'utf8')
const database = new pg.Client({ connectionString })
await database.connect()

try {
  await database.query(migration)
  console.log('Схема локальной базы актуальна')
} finally {
  await database.end()
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`
}
