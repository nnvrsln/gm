import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { FAQ, FAQ_TITLE } from '../data/faq'

const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

const ACCENT = '#6AA0FF'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="section-rhythm relative z-10 px-5"
    >
      <h2 id="faq-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        {FAQ_TITLE}
      </h2>

      <ul className="mt-7 flex flex-col">
        {FAQ.map((item, i) => {
          const isOpen = open === i
          return (
            <li key={item.id} className="relative">
              <span
                aria-hidden="true"
                style={{
                  backgroundImage: `linear-gradient(180deg,${ACCENT} 0%,${ACCENT}66 62%,transparent 100%)`,
                  opacity: isOpen ? 1 : 0,
                }}
                className="absolute inset-y-2 left-0 w-[2px] rounded-full transition-opacity duration-300"
              />

              <div className={`transition-[padding] duration-300 ${isOpen ? 'pl-3.5' : 'pl-0'}`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  className="flex min-h-[56px] w-full items-start gap-3 py-3.5 text-left"
                >
                  <span
                    style={{
                      ...BEBAS,
                      color: isOpen ? '#EAF2FF' : 'rgba(255,255,255,.82)',
                      letterSpacing: '1px',
                    }}
                    className="min-w-0 flex-1 text-[17px] uppercase leading-[1.06] transition-colors duration-300"
                  >
                    {item.question}
                  </span>
                  <PlusMark open={isOpen} />
                </button>

                <Panel id={`faq-panel-${item.id}`} open={isOpen}>
                  <p className="pb-4 pr-9 text-[13px] leading-[1.58] text-white/68">{item.answer}</p>
                </Panel>
              </div>

              {i < FAQ.length - 1 && <span aria-hidden="true" className="block h-px bg-white/[.07]" />}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Panel({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [measured, setMeasured] = useState(false)

  useEffect(() => {
    const el = inner.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
      setMeasured(true)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      id={id}
      aria-hidden={!open}
      style={{ height: open ? height : 0 }}
      className={`overflow-hidden motion-reduce:transition-none ${
        measured ? 'transition-[height] duration-[340ms] ease-[var(--ease-mass)]' : ''
      }`}
    >
      <div
        ref={inner}
        className={`transition-opacity duration-300 ease-[var(--ease-mass)] motion-reduce:transition-none ${
          open ? 'opacity-100 delay-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function PlusMark({ open }: { open: boolean }) {
  const color = open ? ACCENT : '#8FA6C4'
  return (
    <span
      aria-hidden="true"
      className="relative mt-px flex size-[26px] shrink-0 items-center justify-center"
    >
      <span
        style={{ backgroundColor: color }}
        className="absolute h-px w-[11.5px] rounded-full transition-colors duration-300"
      />
      <span
        style={{ backgroundColor: color }}
        className={`absolute h-[11.5px] w-px rounded-full transition-[transform,background-color] duration-300 ${
          open ? 'scale-y-0' : ''
        }`}
      />
    </span>
  )
}
