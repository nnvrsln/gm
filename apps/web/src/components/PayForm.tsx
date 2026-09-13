import { useEffect, useState } from 'react'
import type {
  ChangeEvent,
  ComponentPropsWithRef,
  ComponentType,
  FocusEvent,
  FormEvent,
  ReactNode,
  SVGProps,
} from 'react'
import { usePhoneMask } from '../hooks/usePhoneMask'
import { legalDoc } from '../data/legal'
import { cn } from '../lib/cn'
import { EMAIL_RE, TELEGRAM_RE } from '@gm/shared'
import { PHONE_RE } from '../lib/phone'
import { CheckIcon, MailIcon, PhoneIcon, TelegramIcon, WhatsAppIcon } from './icons'

type FieldId = 'phone' | 'email' | 'telegram' | 'whatsapp'

const CHECKS: Record<FieldId, (value: string) => boolean> = {
  phone: (v) => PHONE_RE.test(v),
  email: (v) => EMAIL_RE.test(v.trim()),
  telegram: (v) => !v.trim() || TELEGRAM_RE.test(v.trim()),
  whatsapp: (v) => !v || PHONE_RE.test(v),
}

const ERRORS: Record<FieldId, string> = {
  phone: 'Введите номер в формате +7(999)000-00-00',
  email: 'Введите адрес в формате name@mail.ru',
  telegram: 'Ник в Telegram: латиница, цифры и подчёркивание, от 5 знаков',
  whatsapp: 'Введите номер в формате +7(999)000-00-00',
}

const LABELS: Record<FieldId, string> = {
  phone: 'Телефон',
  email: 'E-mail',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
}

type Invalid = Record<FieldId, boolean>
const NONE: Invalid = { phone: false, email: false, telegram: false, whatsapp: false }

const ORDER: FieldId[] = ['phone', 'email', 'telegram', 'whatsapp']

export const PAY_FORM_ID = 'pay-form'

export function PayForm({ onValid, onDirty }: { onValid: () => void; onDirty: () => void }) {
  const phone = usePhoneMask()
  const whatsapp = usePhoneMask()
  const [text, setText] = useState({ email: '', telegram: '' })
  const [invalid, setInvalid] = useState<Invalid>(NONE)
  const [consent, setConsent] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [consentInvalid, setConsentInvalid] = useState(false)

  useEffect(() => {
    setInvalid((prev) => (prev.phone ? { ...prev, phone: !CHECKS.phone(phone.value) } : prev))
  }, [phone.value])

  useEffect(() => {
    setInvalid((prev) =>
      prev.whatsapp ? { ...prev, whatsapp: !CHECKS.whatsapp(whatsapp.value) } : prev,
    )
  }, [whatsapp.value])

  const values: Record<FieldId, string> = {
    phone: phone.value,
    email: text.email,
    telegram: text.telegram,
    whatsapp: whatsapp.value,
  }

  const change = (id: 'email' | 'telegram') => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setText((prev) => ({ ...prev, [id]: value }))
    setInvalid((prev) => (prev[id] ? { ...prev, [id]: !CHECKS[id](value) } : prev))
    onDirty()
  }

  const blur = (id: FieldId) => (event: FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInvalid((prev) =>
      prev[id] || value.trim() ? { ...prev, [id]: !CHECKS[id](value) } : prev,
    )
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const next: Invalid = {
      phone: !CHECKS.phone(values.phone),
      email: !CHECKS.email(values.email),
      telegram: !CHECKS.telegram(values.telegram),
      whatsapp: !CHECKS.whatsapp(values.whatsapp),
    }
    setInvalid(next)
    setConsentInvalid(!consent)

    const firstBad = ORDER.find((id) => next[id])
    if (firstBad || !consent) {
      const target = firstBad
        ? document.getElementById(`pay-${firstBad}`)
        : document.getElementById('pay-consent')
      const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const seen = firstBad ? target : target?.closest('label')
      seen?.scrollIntoView({ block: 'center', behavior: quiet ? 'auto' : 'smooth' })
      target?.focus({ preventScroll: true })
      return
    }

    onValid()
  }

  const privacy = legalDoc('privacy')

  return (
    <form id={PAY_FORM_ID} onSubmit={submit} noValidate className="mt-5">
      <h3 className="text-[15px] font-semibold text-white">Контактные данные</h3>
      <p className="mt-1 text-[12.5px] leading-[1.4] text-white/45">
        По ним подтвердим оплату и пришлём доступ к платформе.
      </p>

      <div className="mt-3.5 flex flex-col gap-3.5">
        <PayField
          id="phone"
          icon={PhoneIcon}
          invalid={invalid.phone}
          inputProps={{
            ref: phone.ref,
            value: phone.value,
            inputMode: 'tel',
            autoComplete: 'tel',
            placeholder: '+7(999)000-00-00',
            onFocus: phone.handlers.onFocus,
            onChange: (event) => {
              phone.handlers.onChange(event)
              onDirty()
            },
            onKeyDown: phone.handlers.onKeyDown,
            onBlur: (event) => {
              phone.handlers.onBlur()
              blur('phone')(event)
            },
          }}
        />

        <PayField
          id="email"
          icon={MailIcon}
          invalid={invalid.email}
          inputProps={{
            type: 'email',
            value: text.email,
            inputMode: 'email',
            autoComplete: 'email',
            autoCapitalize: 'none',
            spellCheck: false,
            placeholder: 'name@mail.ru',
            onChange: change('email'),
            onBlur: blur('email'),
          }}
        />

        <PayField
          id="telegram"
          icon={TelegramIcon}
          optional
          invalid={invalid.telegram}
          inputProps={{
            value: text.telegram,
            autoCapitalize: 'none',
            spellCheck: false,
            placeholder: '@username',
            onChange: change('telegram'),
            onBlur: blur('telegram'),
          }}
        />

        <PayField
          id="whatsapp"
          icon={WhatsAppIcon}
          iconFilled
          optional
          invalid={invalid.whatsapp}
          inputProps={{
            ref: whatsapp.ref,
            value: whatsapp.value,
            inputMode: 'tel',
            placeholder: '+7(999)000-00-00',
            onFocus: whatsapp.handlers.onFocus,
            onChange: (event) => {
              whatsapp.handlers.onChange(event)
              onDirty()
            },
            onKeyDown: whatsapp.handlers.onKeyDown,
            onBlur: (event) => {
              whatsapp.handlers.onBlur()
              blur('whatsapp')(event)
            },
          }}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3.5 border-t border-white/8 pt-5">
        <Consent
          id="pay-consent"
          checked={consent}
          invalid={consentInvalid}
          error="Без согласия на обработку данных оплата невозможна"
          onChange={(next) => {
            setConsent(next)
            if (next) setConsentInvalid(false)
            onDirty()
          }}
        >
          Согласен на обработку персональных данных и принимаю{' '}
          {privacy.href ? (
            <a
              href={privacy.href}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="text-white underline decoration-white/40 underline-offset-4"
            >
              политику их обработки
            </a>
          ) : (
            <span className="text-white/75 underline decoration-dotted decoration-white/30 underline-offset-4">
              политику их обработки
            </span>
          )}
        </Consent>

        <Consent
          id="pay-marketing"
          checked={marketing}
          invalid={false}
          onChange={(next) => {
            setMarketing(next)
            onDirty()
          }}
        >
          Хочу получать новости курса и специальные предложения
        </Consent>
      </div>
    </form>
  )
}

type InputProps = Omit<ComponentPropsWithRef<'input'>, 'id' | 'className'>

function PayField({
  id,
  icon: Icon,
  iconFilled,
  optional,
  invalid,
  inputProps,
}: {
  id: FieldId
  icon: ComponentType<SVGProps<SVGSVGElement>>
  iconFilled?: boolean
  optional?: boolean
  invalid: boolean
  inputProps: InputProps
}) {
  return (
    <div>
      <label htmlFor={`pay-${id}`} className="pay-label">
        <span>{LABELS[id]}</span>
        {optional && (
          <span className="text-[12px] text-white/35">необязательно</span>
        )}
      </label>

      <div className={cn('pay-box', invalid && 'is-error')}>
        <Icon className="pay-box-icon" {...(iconFilled ? { fill: 'currentColor' } : {})} />
        <input
          id={`pay-${id}`}
          className="pay-input"
          aria-invalid={invalid || undefined}
          aria-describedby={`pay-${id}-error`}
          aria-required={optional ? undefined : true}
          {...inputProps}
        />
      </div>

      <p
        id={`pay-${id}-error`}
        role="alert"
        className={cn('pay-error', invalid && 'is-shown')}
      >
        {invalid ? ERRORS[id] : ''}
      </p>
    </div>
  )
}

function Consent({
  id,
  checked,
  invalid,
  error,
  onChange,
  children,
}: {
  id: string
  checked: boolean
  invalid: boolean
  error?: string
  onChange: (next: boolean) => void
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="relative flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn('pay-check-input', invalid && 'is-error')}
        />
        <span className="pay-check mt-[1px]">
          <CheckIcon className="size-[13px] text-[#07101A]" />
        </span>
        <span className="text-[13px] leading-[1.45] text-white/60">{children}</span>
      </label>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className={cn('pay-error ml-[33px]', invalid && 'is-shown')}
        >
          {invalid ? error : ''}
        </p>
      )}
    </div>
  )
}
