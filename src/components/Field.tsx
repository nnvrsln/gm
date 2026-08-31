import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type FieldProps = {
  /** id управляющего элемента внутри — на него ссылается label. */
  id: string
  label: ReactNode
  error: string
  invalid: boolean
  children: ReactNode
  labelClassName?: string
  boxClassName?: string
}

/** Обёртка поля формы: подпись, рамка-контейнер и текст ошибки под ней. */
export function Field({ id, label, error, invalid, children, labelClassName, boxClassName }: FieldProps) {
  return (
    <div className="field-wrap">
      <label htmlFor={id} className={cn('fi-label', labelClassName)}>
        {label}
      </label>
      <div className={cn('fi-box', boxClassName, invalid && 'is-error')}>{children}</div>
      <p className={cn('fi-error', invalid && 'is-shown')}>{error}</p>
    </div>
  )
}
