import type { CSSProperties } from 'react'
import coachCheer from '../assets/coach-cheer.webp'
import { QUOTE } from '../data/quote'

const SERIF: CSSProperties = { fontFamily: 'Georgia, "Times New Roman", "Noto Serif", serif' }

export function QuoteSection() {
  return (
    <section id="quote" aria-label="Цитата автора обучения" className="relative z-10 overflow-hidden">
      <span aria-hidden="true" className="absolute inset-x-5 top-0 block h-px bg-white/[.07]" />

      <img
        src={coachCheer}
        alt="Гаджи Гаджиев"
        loading="lazy"
        width={760}
        height={1466}
        className="final-figure pointer-events-none absolute right-[-16%] top-9 h-[640px] w-auto max-w-none select-none"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,transparent_0%,rgba(8,13,20,.86)_46%,#05080b_100%)]"
      />

      <figure className="relative flex min-h-[500px] flex-col justify-end px-5 pb-10 pt-[196px]">
        <blockquote className="max-w-[88%]">
          <p
            style={{ ...SERIF, hyphens: 'auto', WebkitHyphens: 'auto' } as CSSProperties}
            className="final-quote text-[20px] leading-[1.32] tracking-[-.02em] text-[#F2F6FB]"
          >
            <span aria-hidden="true" className="text-[#6AA0FF]">
              «
            </span>
            {QUOTE.text}
          </p>
        </blockquote>

        <figcaption className="mt-7 text-[14px] leading-[1.4] text-[#A9B6C6]">{QUOTE.signature}</figcaption>
      </figure>
    </section>
  )
}
