import type { CSSProperties } from 'react'
import { CATEGORIES, pickLearning, type LearningCategory } from '../data/learning'

const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

const MINT = '#3FE0B0'
const GOLD = '#FFC14A'

export function LearningSection() {
  const [process, free, after] = CATEGORIES

  return (
    <section
      id="learning"
      aria-labelledby="learning-title"
      className="section-rhythm relative z-10 px-5"
    >

      <h2 id="learning-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        Как проходит обучение?
      </h2>

      <ol className="mt-6">
        {pickLearning(...process.keys).map((item, i) => (
          <li key={item.key} className="relative border-b border-white/8 py-3.5 pl-9 last:border-b-0">
            <span
              aria-hidden="true"
              style={{ ...BEBAS, color: process.color }}
              className="absolute left-0 top-[15px] text-[19px] leading-none tracking-[1px] tabular-nums opacity-70"
            >
              {`0${i + 1}`}
            </span>
            <h3 style={BEBAS} className="text-[23px] uppercase leading-[.94] tracking-[1px] text-white">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-white/55">{item.text}</p>
          </li>
        ))}
      </ol>

      <CategoryLabel category={free} className="mt-8" />
      <ul className="mt-2 flex flex-col gap-2">
        {pickLearning(...free.keys).map((item) => (
          <li
            key={item.key}
            className="relative overflow-hidden rounded-[6px] border px-4 py-3.5"
            style={{ borderColor: `${MINT}4D`, backgroundColor: 'rgba(63,224,176,.045)' }}
          >
            <LightEdge opacity={0.3} />
            <div className="flex items-center gap-2.5">
              <h3 className="min-w-0 flex-1 text-[20px] font-extrabold uppercase leading-none tracking-[.04em] text-white">
                {item.title}
              </h3>
              <span
                className="shrink-0 rounded-[3px] px-1.5 py-1 text-[9px] uppercase leading-none tracking-[.12em]"
                style={{ color: MINT, backgroundColor: `${MINT}24` }}
              >
                бесплатно
              </span>
            </div>
            <p className="mt-2.5 text-[12px] leading-[1.5] text-white/60">{item.text}</p>
          </li>
        ))}
      </ul>

      <CategoryLabel category={after} className="mt-8" />
      <ul className="mt-1">
        {pickLearning(...after.keys).map((item) => (
          <li key={item.key} className="relative border-b border-white/8 py-3.5 pl-9 last:border-b-0">
            <item.icon
              aria-hidden="true"
              className="absolute left-0 top-[13px] size-[21px]"
              style={{ color: GOLD }}
            />
            <h3 style={BEBAS} className="text-[21px] uppercase leading-[.94] tracking-[1px] text-white">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-white/55">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function LightEdge({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{
        backgroundImage: `linear-gradient(90deg,transparent,rgba(255,255,255,${opacity}),transparent)`,
      }}
    />
  )
}

function CategoryLabel({ category, className = '' }: { category: LearningCategory; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span
        className="text-[10.5px] uppercase leading-none tracking-[.18em]"
        style={{ color: category.color }}
      >
        {category.label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
    </div>
  )
}
