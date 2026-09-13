export const PHONE_RE = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-zА-Яа-я]{2,}$/

export const TELEGRAM_RE = /^@?[A-Za-z0-9_]{5,32}$/

export function normalizeTelegram(value: string) {
  return value.trim().replace(/^@/, '')
}
