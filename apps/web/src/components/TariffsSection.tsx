import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import {
  CONTACT_ACTION,
  MATRIX_FOLDED,
  PAY_BUTTONS,
  TARIFFS,
  formatPrice,
  tariff,
  whatsappHref,
  type PayAction,
  type Tariff,
  type TariffId,
} from '../data/tariffs'
import { PaySheet, type PayTarget } from './PaySheet'
import { StarIcon, WhatsAppIcon } from './icons'

const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

const CARD = 262
const GAP = 12
const BLEED = 20

const SIDE_PAD = `calc(50% + ${BLEED}px - ${CARD / 2}px)`

export function TariffsSection() {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<TariffId>('premium')
  const [pay, setPay] = useState<PayTarget | null>(null)

  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    el.scrollLeft = centerOf(el, 1)
  }, [])

  const scrollTo = (index: number) => {
    const el = track.current
    if (!el) return
    el.scrollLeft = centerOf(el, index)
    setActive(TARIFFS[index].id)
  }

  return (
    <section
      id="tariffs"
      aria-labelledby="tariffs-title"
      className="section-rhythm relative z-10 px-5"
    >

      <h2 id="tariffs-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        Выбери свой тариф
      </h2>

      <div
        ref={track}
        style={{ paddingInline: SIDE_PAD }}
        className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(event) => {
          const el = event.currentTarget
          const index = Math.round(el.scrollLeft / (CARD + GAP))
          setActive(TARIFFS[Math.min(Math.max(index, 0), TARIFFS.length - 1)].id)
        }}
      >
        {TARIFFS.map((item) => (
          <TariffCard
            key={item.id}
            item={item}
            active={active === item.id}
            onPay={(action) => setPay({ id: item.id, action })}
          />
        ))}
      </div>

      <div className="mt-1 flex justify-center gap-1">
        {TARIFFS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Тариф ${item.name}`}
            aria-current={active === item.id}
            onClick={() => scrollTo(i)}
            className="flex size-11 items-center justify-center"
          >
            <span
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: active === item.id ? 20 : 6,
                backgroundColor: active === item.id ? item.accent : 'rgba(255,255,255,.22)',
              }}
            />
          </button>
        ))}
      </div>

      <ContactBlock />

      <PaySheet target={pay} onClose={() => setPay(null)} />
    </section>
  )
}

function centerOf(track: HTMLElement, index: number) {
  const card = track.children[index] as HTMLElement | undefined
  if (!card) return track.scrollLeft
  const trackBox = track.getBoundingClientRect()
  const cardBox = card.getBoundingClientRect()
  return track.scrollLeft + (cardBox.left - trackBox.left) - (trackBox.width - cardBox.width) / 2
}

function TariffCard({
  item,
  active,
  onPay,
}: {
  item: Tariff
  active: boolean
  onPay: (action: PayAction) => void
}) {
  const hit = Boolean(item.hit)
  const accent = item.accent

  return (
    <article
      style={{
        width: CARD,
        borderColor: hit ? `${accent}A6` : `${accent}33`,
        backgroundColor: hit ? 'rgba(76,141,255,.09)' : `${accent}08`,
        boxShadow: hit ? '0 14px 36px rgba(30,91,255,.24)' : 'none',
        opacity: active ? 1 : 0.52,
        filter: active ? 'none' : 'saturate(.6)',
        transition: 'opacity 240ms var(--ease-mass), filter 240ms var(--ease-mass)',
      }}
      className="relative shrink-0 snap-center overflow-hidden rounded-[6px] border"
    >
      {hit ? (
        <div
          style={{ ...BEBAS, backgroundColor: accent, color: '#0A1220' }}
          className="flex items-center justify-center gap-1.5 py-[7px] text-[15px] uppercase leading-none tracking-[1.5px]"
        >
          <StarIcon aria-hidden="true" className="size-[13px]" />
          Хит
        </div>
      ) : (
        item.id === 'vip' && (
          <div aria-hidden="true" className="h-[2px]" style={{ backgroundColor: accent }} />
        )
      )}

      <div className="relative p-4">
        {!hit && <LightEdge opacity={0.24} />}

        <StepMeter item={item} />

        <div className="mt-3 flex items-center gap-2">
          <h3
            style={BEBAS}
            className="min-w-0 flex-1 text-[30px] uppercase leading-none tracking-[1px] text-white"
          >
            {item.name}
          </h3>
        </div>
        <p
          style={{ ...BEBAS, color: hit ? '#DCE9FF' : '#FFFFFF' }}
          className="mt-2 text-[38px] leading-none tracking-[1px] tabular-nums"
        >
          {formatPrice(item.price)}
        </p>

        <ul className="mt-4 border-t border-white/8">
          {MATRIX_FOLDED.map((feature) => {
            const on = feature.in[item.id]
            return (
              <li
                key={feature.key}
                className="flex items-start gap-2.5 border-b border-white/8 py-2.5 last:border-b-0"
              >
                <span className="mt-[3px] flex size-[13px] shrink-0 items-center justify-center">
                  <Mark on={on} color={accent} />
                </span>
                <span className={`text-[12px] leading-[1.35] ${on ? 'text-white/78' : 'text-white/28'}`}>
                  {feature.title}
                </span>
              </li>
            )
          })}
        </ul>

        <PayButtons id={item.id} accent={hit ? undefined : accent} onPay={onPay} />
      </div>
    </article>
  )
}

function StepMeter({ item }: { item: Tariff }) {
  const step = TARIFFS.findIndex((t) => t.id === item.id)

  return (
    <span aria-hidden="true" className="flex gap-1">
      {TARIFFS.map((_, i) => (
        <span
          key={i}
          className="h-[3px] w-[15px] rounded-full"
          style={{ backgroundColor: i <= step ? item.accent : 'rgba(255,255,255,.22)' }}
        />
      ))}
    </span>
  )
}

function Mark({ on, color }: { on: boolean; color: string }) {
  if (!on) return <span aria-hidden="true" className="block h-px w-[9px] bg-white/22" />

  return (
    <svg viewBox="0 0 14 12" aria-hidden="true" className="block size-[13px]" fill="none">
      <path
        d="M1.4 6.2l3.6 3.8L12.6 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PayButtons({
  id,
  accent,
  onPay,
}: {
  id: TariffId
  accent?: string
  onPay: (action: PayAction) => void
}) {
  const name = tariff(id).name

  return (
    <div className="mt-4 grid gap-2">
      {PAY_BUTTONS.map((button) => {
        const loud = button.emphasis === 'loud'
        const tinted = loud && accent

        return (
          <button
            key={button.action}
            type="button"
            aria-label={`${button.label} — тариф ${name}`}
            onClick={() => onPay(button.action)}
            style={
              tinted
                ? { color: accent, border: `1px solid ${accent}80`, backgroundColor: `${accent}1F` }
                : undefined
            }
            className={`btn-hero w-full ${loud ? (tinted ? '' : 'btn-hero-primary') : 'btn-hero-secondary'}`}
          >
            {button.label}
          </button>
        )
      })}
    </div>
  )
}

function ContactBlock() {
  return (
    <div
      className="relative mt-7 rounded-[6px] border border-[#25D366]/26 p-4"
      style={{
        backgroundImage: 'linear-gradient(168deg,rgba(37,211,102,.075) 0%,rgba(37,211,102,.02) 100%)',
        boxShadow: '0 10px 40px rgba(37,211,102,.10)',
      }}
    >
      <LightEdge opacity={0.22} />
      <p className="text-[13px] leading-[1.45] text-white/70">
        Не подошёл ни один вариант? Напишите в WhatsApp:
      </p>
      <a
        href={whatsappHref(CONTACT_ACTION.message)}
        style={{
          boxShadow: '0 3px 12px rgba(37,211,102,.22), 0 12px 32px rgba(37,211,102,.3)',
        }}
        className="mt-3.5 flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-[6px] bg-[#25D366] px-4 text-center text-[14px] font-semibold leading-[1.2] text-[#08291A] transition-[filter,transform,box-shadow] duration-150 active:scale-[.99] active:brightness-95"
      >
        <WhatsAppIcon className="size-[19px] shrink-0 fill-[#08291A]" />
        {CONTACT_ACTION.label}
      </a>
    </div>
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
