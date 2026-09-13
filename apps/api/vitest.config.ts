import { readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { defineConfig } from 'vitest/config'

function envFromFile(path: string): Record<string, string> {
  try {
    return parseEnv(readFileSync(path, 'utf8')) as Record<string, string>
  } catch {
    return {}
  }
}

const fromFile = envFromFile(new URL('../../.env', import.meta.url).pathname.slice(1))

export default defineConfig({
  test: {
    env: {
      DATABASE_URL_TEST: process.env.DATABASE_URL_TEST ?? fromFile.DATABASE_URL_TEST ?? '',
    },
    fileParallelism: false,
  },
})
