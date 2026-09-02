/**
 * Тесты читают тот же `.env`, что и приложение, но берут из него отдельную
 * строку подключения — `DATABASE_URL_TEST`. База под тесты отдельная (`gm_test`)
 * потому, что они чистят таблицы между проверками: направить их на рабочую
 * базу значит однажды стереть заказы.
 *
 * Разбор файла — штатным `util.parseEnv` из Node, без библиотек.
 */

import { readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { defineConfig } from 'vitest/config'

function envFromFile(path: string): Record<string, string> {
  try {
    return parseEnv(readFileSync(path, 'utf8')) as Record<string, string>
  } catch {
    // Файла нет — это нормально: в CI переменные приходят из окружения.
    return {}
  }
}

const fromFile = envFromFile(new URL('../../.env', import.meta.url).pathname.slice(1))

export default defineConfig({
  test: {
    env: {
      // Окружение важнее файла: так CI перебивает локальные значения.
      DATABASE_URL_TEST: process.env.DATABASE_URL_TEST ?? fromFile.DATABASE_URL_TEST ?? '',
    },
    // Тесты с базой делят одну схему и чистят её между собой, поэтому
    // файлы идут по очереди, а не параллельно.
    fileParallelism: false,
  },
})
