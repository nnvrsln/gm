import { useEffect, useRef, useState } from 'react'
import { PROGRAM, type ProgramModule } from '../data/program'
import { ArrowRightIcon } from './icons'

export function ProgramSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="program"
      aria-labelledby="program-title"
      className="section-rhythm relative z-10 px-5"
    >
      <h2 id="program-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        Программа обучения
      </h2>

      <ol className="mt-6 flex flex-col gap-2.5">
        {PROGRAM.map((module, index) => (
          <ModuleCard
            key={module.title}
            module={module}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </ol>

      <div className="relative mt-7 flex">
        <a href="#tariffs" className="btn-hero btn-hero-turf w-full">
          Посмотреть тарифы
          <ArrowRightIcon className="size-5 shrink-0" />
        </a>
      </div>
    </section>
  )
}

function ModuleCard({
  module,
  isOpen,
  onToggle,
}: {
  module: ProgramModule
  isOpen: boolean
  onToggle: () => void
}) {
  const panelId = `program-panel-${module.num ?? 'bonus'}`
  const hasLessons = module.lessons.length > 0

  const panelRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [measured, setMeasured] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
      setMeasured(true)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const headerInner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 z-0 transition-colors duration-300 ${
          module.bonus
            ? 'bg-[linear-gradient(104deg,rgba(46,35,17,.96)_0%,rgba(24,19,12,.94)_58%,rgba(13,13,15,.94)_100%)]'
            : isOpen
              ? 'bg-[linear-gradient(104deg,rgba(22,38,62,.96)_0%,rgba(12,20,32,.94)_58%,rgba(9,15,24,.94)_100%)]'
              : 'bg-[linear-gradient(104deg,rgba(16,26,40,.9)_0%,rgba(10,16,25,.9)_58%,rgba(8,13,20,.9)_100%)]'
        }`}
      />

      <span
        aria-hidden="true"
        className={`absolute inset-0 z-0 ${
          module.bonus
            ? 'bg-[radial-gradient(58%_120%_at_2%_50%,rgba(255,193,74,.2)_0%,rgba(255,193,74,.06)_44%,transparent_76%)]'
            : 'bg-[radial-gradient(58%_120%_at_2%_50%,rgba(30,91,255,.26)_0%,rgba(30,91,255,.08)_44%,transparent_76%)]'
        }`}
      />

      {module.bonus && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,222,160,.6)_26%,rgba(255,214,140,.18)_68%,transparent_100%)]"
        />
      )}

      <span className="relative z-10 flex min-w-0 flex-1 items-baseline gap-3">
        {module.num ? (
          <span className="segment-index shrink-0 text-[15px] leading-none">{module.num}</span>
        ) : (
          <span className="segment-index segment-index-gold shrink-0 text-[15px] leading-none">Бонус</span>
        )}

        <span
          className={`min-w-0 flex-1 font-display text-[14px] font-bold uppercase leading-[1.14] tracking-[.01em] ${
            module.bonus ? 'text-[#FFE7C2]' : 'text-white'
          }`}
        >
          {module.title}
        </span>
      </span>

      <span className="relative z-10 flex shrink-0 items-center gap-2.5">
        {hasLessons ? (
          <span className="w-[34px] text-right">
            <span className="block font-badge text-[15px] font-extrabold leading-none text-white/86 tabular-nums">
              {module.lessons.length}
            </span>
            <span className="mt-0.5 block text-[8.5px] uppercase tracking-[.1em] text-white/40">
              {plural(module.lessons.length)}
            </span>
          </span>
        ) : (
          <span aria-hidden="true" className="flex w-[34px] justify-end">
            <span
              className={`h-px w-3.5 border-t border-dashed ${
                module.bonus ? 'border-[#FFC14A]/40' : 'border-white/22'
              }`}
            />
          </span>
        )}

        {hasLessons && (
          <span
            aria-hidden="true"
            className={`relative flex size-6 items-center justify-center rounded-full border transition-colors duration-300 ${
              isOpen
                ? module.bonus
                  ? 'border-[#FFC14A]/60 bg-[#FFC14A]/14'
                  : 'border-[#6AA0FF]/60 bg-[#6AA0FF]/14'
                : module.bonus
                  ? 'border-[#FFC14A]/30'
                  : 'border-white/16'
            }`}
          >
            <span
              className={`absolute h-px w-2.5 rounded-full ${
                module.bonus ? 'bg-[#FFD68C]' : 'bg-[#6AA0FF]'
              }`}
            />
            <span
              className={`absolute h-2.5 w-px rounded-full transition-transform duration-300 ${
                module.bonus ? 'bg-[#FFD68C]' : 'bg-[#6AA0FF]'
              } ${isOpen ? 'scale-y-0' : ''}`}
            />
          </span>
        )}
      </span>
    </>
  )

  const headerClass =
    'relative flex min-h-[64px] w-full items-center gap-3 overflow-hidden px-3.5 py-3 text-left'

  return (
    <li
      className={`program-card overflow-hidden rounded-[14px] border transition-colors duration-300 ${
        module.bonus
          ? 'program-card-gold'
          : isOpen
            ? 'program-card-open border-[#6AA0FF]/34'
            : 'border-white/10'
      }`}
    >
      {hasLessons ? (
        <button
          type="button"
          onClick={() => {
            setAnimating(true)
            onToggle()
          }}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={headerClass}
        >
          {headerInner}
        </button>
      ) : (
        <div className={headerClass}>{headerInner}</div>
      )}

      {hasLessons && (
        <div
          id={panelId}
          aria-hidden={!isOpen}
          style={{ height: isOpen ? height : 0 }}
          onTransitionEnd={(event) => {
            if (event.propertyName === 'height') setAnimating(false)
          }}
          className={`overflow-hidden bg-[rgba(6,10,16,.72)] motion-reduce:transition-none ${
            animating ? 'program-panel-animating' : ''
          } ${measured ? 'transition-[height] duration-[380ms] ease-[var(--ease-mass)]' : ''}`}
        >
          <div
            ref={panelRef}
            className={`transition-opacity duration-300 ease-[var(--ease-mass)] motion-reduce:transition-none ${
              isOpen ? 'opacity-100 delay-100' : 'opacity-0'
            }`}
          >
            <ol className="px-3.5 py-4">
              {module.lessons.map((lesson, i) => (
                <li key={lesson} className="flex items-start gap-3 pb-[18px] last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`-mt-px flex size-5 shrink-0 items-center justify-center rounded-full border font-badge text-[10px] font-extrabold leading-none tabular-nums ${
                      module.bonus
                        ? 'border-[#FFC14A]/34 bg-[#FFC14A]/10 text-[#FFD68C]'
                        : 'border-[#6AA0FF]/34 bg-[#6AA0FF]/10 text-[#8FB8FF]'
                    }`}
                  >
                    {i + 1}
                  </span>

                  <span className="min-w-0 flex-1 text-[12px] leading-[1.42] text-white/82">{lesson}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {(hasLessons || module.result) && (
        <div className="border-t border-white/8 bg-[rgba(6,10,16,.5)] px-3.5 py-3">
          {!hasLessons && <PendingLine>Программа модуля утверждается</PendingLine>}

          {module.result ? (
            <p className={`text-[12px] leading-[1.5] text-white/70 ${hasLessons ? '' : 'mt-2.5'}`}>
              <span
                className={`font-display font-bold uppercase tracking-[.02em] ${
                  module.bonus ? 'text-[#FFD68C]' : 'text-[#6AA0FF]'
                }`}
              >
                {resultLead(module.result)}
              </span>{' '}
              {resultBody(module.result)}
            </p>
          ) : (
            <PendingLine>Результат модуля утверждается</PendingLine>
          )}
        </div>
      )}
    </li>
  )
}

function PendingLine({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 text-[11px] leading-[1.4] text-white/42">
      <span aria-hidden="true" className="h-px w-3 shrink-0 bg-white/22" />
      {children}
    </p>
  )
}

function resultLead(result: string) {
  const colon = result.indexOf(':')
  return colon === -1 ? '' : result.slice(0, colon + 1)
}

function resultBody(result: string) {
  const colon = result.indexOf(':')
  return colon === -1 ? result : result.slice(colon + 1).trim()
}

function plural(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'урок'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'урока'
  return 'уроков'
}
