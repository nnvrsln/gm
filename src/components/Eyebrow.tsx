import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type EyebrowProps = {
  children: ReactNode
  /** Классы самого абзаца — отступы и размер шрифта задаёт секция. */
  className?: string
  /** Классы декоративной черты слева. */
  lineClassName?: string
  /** В новом макете надзаголовок идёт без черты — только капслок. */
  line?: boolean
}

/** Надзаголовок секции: короткая синяя черта + капслок. */
export function Eyebrow({ children, className, lineClassName, line = true }: EyebrowProps) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 font-badge font-bold uppercase tracking-course text-[#6AA0FF]',
        className,
      )}
    >
      {line && (
        <span className={cn('h-px rounded-full bg-linear-to-r from-[#1E5BFF] to-[#6AA0FF]', lineClassName)} />
      )}
      {children}
    </p>
  )
}
