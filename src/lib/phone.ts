/**
 * Маска российского номера: +7(999)000-00-00.
 * Функции чистые — вся работа с кареткой живёт в usePhoneMask.
 */

export const PHONE_RE = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/

/** Национальные цифры без префикса +7, максимум 10. */
export function phoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (d.startsWith('7')) d = d.slice(1)
  return d.slice(0, 10)
}

export function applyPhoneMask(raw: string): string {
  const d = phoneDigits(raw)
  let out = '+7'
  if (d.length > 0) out += '(' + d.slice(0, 3)
  if (d.length >= 3) out += ')' + d.slice(3, 6)
  if (d.length >= 6) out += '-' + d.slice(6, 8)
  if (d.length >= 8) out += '-' + d.slice(8, 10)
  return out
}

/** Сколько национальных цифр стоит до позиции pos (префикс +7 пропускаем). */
export function digitsBefore(str: string, pos: number): number {
  let n = 0
  for (let i = 2; i < pos && i < str.length; i++) {
    if (/\d/.test(str[i])) n++
  }
  return n
}

/** Позиция каретки сразу после n-й национальной цифры. */
export function caretAfterDigit(str: string, n: number): number {
  if (n <= 0) return Math.min(2, str.length)
  let seen = 0
  for (let i = 2; i < str.length; i++) {
    if (/\d/.test(str[i]) && ++seen === n) return i + 1
  }
  return str.length
}
