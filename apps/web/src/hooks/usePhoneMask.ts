import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'
import { applyPhoneMask, caretAfterDigit, digitsBefore } from '../lib/phone'

export type PhoneMask = {
  ref: RefObject<HTMLInputElement | null>
  value: string
  reset: () => void
  handlers: {
    onFocus: () => void
    onBlur: () => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  }
}

export function usePhoneMask(): PhoneMask {
  const ref = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const caret = useRef<number | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || caret.current === null) return
    el.setSelectionRange(caret.current, caret.current)
    caret.current = null
  })

  const commit = useCallback((raw: string, nat: number) => {
    const next = applyPhoneMask(raw)
    caret.current = caretAfterDigit(next, nat)
    setValue(next)
  }, [])

  const onFocus = useCallback(() => {
    if (ref.current?.value) return
    caret.current = 2
    setValue('+7')
  }, [])

  const onBlur = useCallback(() => {
    setValue((v) => (v === '+7' ? '' : v))
  }, [])

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const el = e.currentTarget
      commit(el.value, digitsBefore(el.value, el.selectionStart ?? el.value.length))
    },
    [commit],
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const el = e.currentTarget
      if (el.selectionStart !== el.selectionEnd) return
      const pos = el.selectionStart ?? 0

      if (e.key === 'Backspace') {
        e.preventDefault()
        let i = pos - 1
        while (i >= 2 && !/\d/.test(el.value[i])) i--
        if (i < 2) {
          caret.current = null
          setValue('')
          return
        }
        commit(el.value.slice(0, i) + el.value.slice(i + 1), digitsBefore(el.value, i))
        return
      }

      if (e.key === 'Delete') {
        e.preventDefault()
        let i = pos
        while (i < el.value.length && !/\d/.test(el.value[i])) i++
        if (i >= el.value.length) return
        commit(el.value.slice(0, i) + el.value.slice(i + 1), digitsBefore(el.value, pos))
      }
    },
    [commit],
  )

  const reset = useCallback(() => {
    caret.current = null
    setValue('')
  }, [])

  return { ref, value, reset, handlers: { onFocus, onBlur, onChange, onKeyDown } }
}
