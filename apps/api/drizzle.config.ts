/**
 * drizzle-kit: генерация SQL-миграций из схемы.
 *
 * `npm run db:generate -w @gm/api` кладёт очередной файл в `drizzle/`.
 * Файлы миграций **коммитятся** и руками не правятся: правится схема, из
 * неё генерируется новая миграция. Накатывать — `npm run db:migrate`.
 */

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  casing: 'snake_case',
})
