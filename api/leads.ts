import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDatabase } from './_lib/db'
import { leads } from './_lib/schema'

const PHONE_RE = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/

type LeadInput = {
  name?: unknown
  phone?: unknown
  instagram?: unknown
  motivation?: unknown
  consent?: unknown
  marketingConsent?: unknown
  website?: unknown
}

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function parseBody(body: unknown): LeadInput {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as LeadInput
    } catch {
      return {}
    }
  }

  return body && typeof body === 'object' ? (body as LeadInput) : {}
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const body = parseBody(request.body)

  // Боты часто заполняют скрытое поле. Отвечаем успешно, но ничего не сохраняем.
  if (textValue(body.website, 200)) {
    return response.status(201).json({ ok: true })
  }

  const name = textValue(body.name, 100)
  const phone = textValue(body.phone, 32)
  const instagram = textValue(body.instagram, 100).replace(/^@/, '')
  const motivation = textValue(body.motivation, 2_000)

  if (
    name.length < 2 ||
    !PHONE_RE.test(phone) ||
    !instagram ||
    motivation.length < 10 ||
    body.consent !== true
  ) {
    return response.status(400).json({ error: 'Проверьте заполнение формы' })
  }

  try {
    const [lead] = await getDatabase()
      .insert(leads)
      .values({
        name,
        phone,
        instagram,
        motivation,
        marketingConsent: body.marketingConsent === true,
      })
      .returning({ id: leads.id })

    return response.status(201).json({ ok: true, id: lead.id })
  } catch (error) {
    console.error('Failed to create lead', error)
    return response.status(500).json({ error: 'Не удалось сохранить заявку. Попробуйте ещё раз.' })
  }
}
