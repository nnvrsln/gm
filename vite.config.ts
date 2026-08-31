import type { IncomingMessage, ServerResponse } from 'node:http'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import leadHandler from './api/leads'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Vite загружает .env.local для клиентского import.meta.env, а серверный код
  // читает process.env. Передаём только серверный секрет и не отправляем его в браузер.
  if (env.DATABASE_URL) process.env.DATABASE_URL = env.DATABASE_URL

  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
  }
})

function localApiPlugin(): Plugin {
  return {
    name: 'gm-local-api',
    configureServer(server) {
      server.middlewares.use('/api/leads', async (request, response) => {
        try {
          const body = await readJsonBody(request)
          await leadHandler(
            Object.assign(request, { body }) as VercelRequest,
            createVercelResponse(response),
          )
        } catch (error) {
          console.error('Local API request failed', error)
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify({ error: 'Некорректный запрос' }))
        }
      })
    },
  }
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 32_000) throw new Error('Request body is too large')
    chunks.push(buffer)
  }

  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

function createVercelResponse(response: ServerResponse) {
  const adapter = {
    setHeader(name: string, value: number | string | readonly string[]) {
      response.setHeader(name, value)
      return adapter
    },
    status(code: number) {
      response.statusCode = code
      return adapter
    },
    json(payload: unknown) {
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.end(JSON.stringify(payload))
      return adapter
    },
  }

  return adapter as unknown as VercelResponse
}
