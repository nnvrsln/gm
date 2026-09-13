export type LegalDoc = {
  id: string
  title: string
  href: string
}

export const LEGAL_DOCS: LegalDoc[] = [
  { id: 'privacy', title: 'Политика обработки персональных данных', href: '' },
  { id: 'offer', title: 'Договор оферта', href: '' },
]

export function legalDoc(id: string): LegalDoc {
  const found = LEGAL_DOCS.find((doc) => doc.id === id)
  if (!found) throw new Error(`Нет документа с ключом «${id}»`)
  return found
}

export const SELLER = {
  form: 'Индивидуальный предприниматель',
  fullName: 'Гаджиев Муслим Гаджиевич',
  inn: '772973273225',
  ogrnip: '325050000186699',
  phone: '+7 989 399 9947',
  email: 'gadzhimr@gmail.com',
} as const

export const SELLER_PHONE_HREF = `tel:${SELLER.phone.replace(/\s/g, '')}`
