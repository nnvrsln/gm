import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { faqAnswer } from '../data/faq'
import { legalDoc } from '../data/legal'
import { learningItem } from '../data/learning'
import {
  PAY_METHODS,
  PAY_PROVIDER,
  RESERVE_AMOUNT,
  formatPrice,
  highlightsOf,
  tariff,
  whatsappHref,
  type PayAction,
  type Tariff,
  type TariffId,
} from '../data/tariffs'
import { PAY_FORM_ID, PayForm } from './PayForm'
import sbpLogo from '../assets/sbp.svg'
import {
  CardIcon,
  CheckIcon,
  CloseIcon,
  ManagerIcon,
  WhatsAppIcon,
  InstallmentIcon,
  LockIcon,
} from './icons'

const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

const RESERVE_ACCENT = '#21B365'

const INK = '#07101A'

export type PayTarget = { id: TariffId; action: PayAction }

export function PaySheet({ target, onClose }: { target: PayTarget | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  const [shown, setShown] = useState<PayTarget | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !target) return
    setShown(target)
    setClosing(false)
    setChecked(false)
    if (!dialog.open) dialog.showModal()
  }, [target])

  const requestClose = () => {
    const dialog = ref.current
    if (!dialog || !dialog.open || closing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close()
      return
    }
    setClosing(true)
  }

  const t = shown ? tariff(shown.id) : null
  const reserve = shown?.action === 'reserve'
  const color = !t || reserve ? RESERVE_ACCENT : t.accent
  const due = !t ? 0 : reserve ? RESERVE_AMOUNT : t.price
  const offer = legalDoc('offer')

  return (
    <dialog
      ref={ref}
      aria-labelledby="pay-title"
      className={`pay-dialog ${closing ? 'is-closing' : ''}`}
      onClick={(event) => {
        if (event.target === ref.current) requestClose()
      }}
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClose={() => {
        setClosing(false)
        setShown(null)
        onClose()
      }}
    >
      {t && (
        <div
          style={{ '--pay-accent': color } as CSSProperties}
          className={`pay-sheet ${closing ? 'pay-sheet-closing' : ''}`}
          onAnimationEnd={() => {
            if (closing) ref.current?.close()
          }}
        >
          <div className="shrink-0 border-b border-white/8">
            <div className="flex justify-center pt-2.5">
              <span aria-hidden="true" className="pay-grabber" />
            </div>

            <div className="flex items-center gap-2 px-5 pb-3.5 pt-3">
              <h2
                id="pay-title"
                style={BEBAS}
                className="min-w-0 flex-1 text-[24px] uppercase leading-none tracking-title text-white"
              >
                {reserve ? 'Бронь места' : 'Оплата курса'}
              </h2>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={requestClose}
                className="-mr-2.5 flex size-11 shrink-0 items-center justify-center rounded-[10px] text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>
          </div>

          <div className="pay-scroll px-5 pb-6 pt-4">
            <OrderSummary item={t} reserve={reserve} color={color} />
            <Included item={t} color={color} />
            <PayMethods />
            <PayForm onValid={() => setChecked(true)} onDirty={() => setChecked(false)} />
          </div>

          <div className="pay-footer shrink-0 border-t border-white/8 px-5 pt-3.5">
            {checked && (
              <p
                role="status"
                className="mb-3 rounded-[10px] border px-3.5 py-3 text-[13px] leading-[1.45] text-white/85"
                style={{ borderColor: `${color}40`, backgroundColor: `${color}12` }}
              >
                Данные проверены. Приём оплаты ещё не подключён — кнопка
                заработает вместе с {PAY_PROVIDER}.
              </p>
            )}

            <button
              type="submit"
              form={PAY_FORM_ID}
              style={{ backgroundColor: color, color: INK }}
              className="pay-cta"
            >
              {reserve ? 'Забронировать за' : 'Оплатить'} {formatPrice(due)}
            </button>

            <p className="mt-2.5 text-center text-[11.5px] leading-[1.4] text-white/40">
              Нажимая кнопку, вы принимаете условия{' '}
              {offer.href ? (
                <a
                  href={offer.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 underline decoration-white/30 underline-offset-4"
                >
                  договора оферты
                </a>
              ) : (
                <span className="underline decoration-dotted decoration-white/25 underline-offset-4">
                  договора оферты
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </dialog>
  )
}

function OrderSummary({
  item,
  reserve,
  color,
}: {
  item: Tariff
  reserve: boolean
  color: string
}) {
  return (
    <div className="pay-panel p-4">
      <Row label="Тариф">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-white">{item.name}</span>
          {item.hit && (
            <span
              className="rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[.08em]"
              style={{ backgroundColor: `${item.accent}22`, color: item.accent }}
            >
              Хит
            </span>
          )}
        </span>
      </Row>

      {reserve && (
        <Row label="Стоимость курса">
          <span className="text-[15px] text-white/75 tabular-nums">{formatPrice(item.price)}</span>
        </Row>
      )}

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/8 pt-3">
        <span className="pb-1 text-[13px] text-white/60">
          {reserve ? 'Вносится сейчас' : 'К оплате'}
        </span>
        <span
          style={{ ...BEBAS, color }}
          className="text-[34px] leading-none tracking-[1px] tabular-nums"
        >
          {formatPrice(reserve ? RESERVE_AMOUNT : item.price)}
        </span>
      </div>

      {reserve && (
        <>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[13px] text-white/45">Остаток</span>
            <span className="text-[14px] text-white/55 tabular-nums">
              {formatPrice(item.price - RESERVE_AMOUNT)}
            </span>
          </div>

          <p className="mt-3 border-t border-white/8 pt-3 text-[12.5px] leading-[1.45] text-white/45">
            {faqAnswer('booking')}
          </p>
        </>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 first:mt-0 [&+&]:mt-2.5">
      <span className="text-[13px] text-white/60">{label}</span>
      {children}
    </div>
  )
}

function Included({ item, color }: { item: Tariff; color: string }) {
  return (
    <section className="mt-6">
      <h3 className="text-[15px] font-semibold text-white">Что входит в тариф</h3>

      <ul className="mt-3 flex flex-col gap-3">
        {highlightsOf(item.id).map((feature) => {
          const learning = feature.learningKey ? learningItem(feature.learningKey) : null
          const generic = feature.learningKey === 'feedback'

          return (
            <li key={feature.key} className="flex gap-2.5">
              <CheckIcon
                aria-hidden="true"
                className="mt-[3px] size-4 shrink-0"
                style={{ color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium leading-[1.3] text-white">
                  {learning && !generic ? learning.title : feature.title}
                </p>
                {learning && !generic && (
                  <p className="mt-0.5 text-[12.5px] leading-[1.4] text-white/45">
                    {learning.text}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const METHOD_ICONS = {
  card: CardIcon,
  installment: InstallmentIcon,
  islamic: ManagerIcon,
} as const

const WA_GREEN = '#25D366'
const WA_INK = '#08291A'

function PayMethods() {
  return (
    <section className="mt-6">
      <h3 className="text-[15px] font-semibold text-white">Способы оплаты</h3>

      <ul className="pay-panel mt-3 overflow-hidden">
        {PAY_METHODS.map((method) => {
          const Icon = method.key === 'sbp' ? null : METHOD_ICONS[method.key]
          const href = method.message ? whatsappHref(method.message) : undefined

          return (
            <li
              key={method.key}
              className="flex items-center gap-3 border-b border-white/6 px-3.5 py-3 last:border-b-0"
            >
              <span className="flex w-6 shrink-0 items-center justify-center">
                {Icon ? (
                  <Icon aria-hidden="true" className="size-[19px] text-white/60" />
                ) : (
                  <img src={sbpLogo} alt="" className="h-[19px] w-auto" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium leading-[1.25] text-white">{method.title}</p>
                <p className="mt-0.5 text-[12px] leading-[1.35] text-white/45">{method.desc}</p>
              </div>

              {method.message && (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: WA_GREEN, color: WA_INK }}
                  className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-[13px] font-semibold transition-transform duration-150 active:scale-[.97]"
                >
                  <WhatsAppIcon aria-hidden="true" className="size-[15px] fill-[#08291A]" />
                  Менеджер
                </a>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-2.5 flex items-center gap-2 text-[12px] leading-[1.35] text-white/40">
        <LockIcon aria-hidden="true" className="size-[14px] shrink-0" />
        Оплата проходит на защищённой странице {PAY_PROVIDER}
      </p>
    </section>
  )
}
