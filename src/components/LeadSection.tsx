import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { usePhoneMask } from '../hooks/usePhoneMask'
import { PHONE_RE } from '../lib/phone'
import { cn } from '../lib/cn'
import { Eyebrow } from './Eyebrow'
import { Field } from './Field'
import {
  ArrowRightIcon,
  CheckIcon,
  CheckMarkIcon,
  InfoIcon,
  InstagramIcon,
  PhoneIcon,
  UserIcon,
  WhatsAppIcon,
} from './icons'

type TextFieldId = 'name' | 'instagram' | 'why'
type FieldId = TextFieldId | 'phone'

const CHECKS: Record<FieldId, (v: string) => boolean> = {
  name: (v) => v.trim().length >= 2,
  phone: (v) => PHONE_RE.test(v),
  instagram: (v) => v.trim().length >= 1,
  why: (v) => v.trim().length >= 10,
}

const ERROR_TEXT: Record<FieldId, string> = {
  name: 'Введите ваше имя',
  phone: 'Введите номер в формате +7(999)000-00-00',
  instagram: 'Введите ник в Instagram',
  why: 'Расскажи о своей цели (минимум 10 символов)',
}

type Errors = Record<FieldId, boolean>
const NO_ERRORS: Errors = { name: false, phone: false, instagram: false, why: false }

type Status = 'idle' | 'sending' | 'sent'

const BTN_BASE =
  'relative mt-2 flex h-[56px] w-full cursor-pointer items-center overflow-hidden rounded-xl border px-5 font-display text-[15px] font-extrabold uppercase tracking-[.13em] text-white transition-all duration-500 ease-mass active:scale-[.98]'
const BTN_IDLE =
  'justify-between border-[#1E5BFF]/50 bg-linear-to-r from-[#1240CC] via-[#1E5BFF] to-[#3D7CFF] shadow-[0_0_32px_rgba(30,91,255,.5),0_0_60px_rgba(30,91,255,.2),inset_0_1px_0_rgba(255,255,255,.2)] hover:shadow-[0_0_44px_rgba(30,91,255,.7)]'
// В успешном состоянии галочка и текст идут парой по центру, а не разъезжаются по краям.
const BTN_SENT =
  'justify-center gap-3 border-transparent bg-linear-to-r from-green-800 via-green-600 to-green-500 shadow-[0_0_32px_rgba(34,197,94,.4)]'

export function LeadSection() {
  const phone = usePhoneMask()
  const [values, setValues] = useState<Record<TextFieldId, string>>({ name: '', instagram: '', why: '' })
  const [errors, setErrors] = useState<Errors>(NO_ERRORS)
  const [consent, setConsent] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [notice, setNotice] = useState<string | null>(null)

  // Значение телефона меняет маска, а не onChange поля, поэтому ошибку по нему
  // снимаем реактивно — и только если она уже показана, как в прежней версии.
  useEffect(() => {
    setErrors((prev) => (prev.phone ? { ...prev, phone: !CHECKS.phone(phone.value) } : prev))
  }, [phone.value])

  // Пока ошибка не показана, ввод её не зажигает — только гасит уже показанную.
  const handleChange =
    (id: TextFieldId) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value
      setValues((prev) => ({ ...prev, [id]: v }))
      setErrors((prev) => (prev[id] ? { ...prev, [id]: !CHECKS[id](v) } : prev))
    }

  // На blur ошибку показываем, только если пользователь реально трогал поле.
  const handleBlur = (id: TextFieldId) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value
    setErrors((prev) => (prev[id] || v.trim() ? { ...prev, [id]: !CHECKS[id](v) } : prev))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNotice(null)

    const next: Errors = {
      name: !CHECKS.name(values.name),
      phone: !CHECKS.phone(phone.value),
      instagram: !CHECKS.instagram(values.instagram),
      why: !CHECKS.why(values.why),
    }
    setErrors(next)
    setConsentError(!consent)
    if (Object.values(next).some(Boolean) || !consent) return

    setStatus('sending')

    try {
      const form = new FormData(e.currentTarget)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          phone: phone.value,
          instagram: values.instagram,
          motivation: values.why,
          consent,
          marketingConsent: marketing,
          website: form.get('website'),
        }),
      })

      const result = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) throw new Error(result?.error || 'Не удалось отправить заявку')

      setStatus('sent')
    } catch (error) {
      setStatus('idle')
      setNotice(error instanceof Error ? error.message : 'Не удалось отправить заявку. Попробуйте ещё раз.')
    }
  }

  return (
    <section id="lead" className="section-rhythm px-5">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-blood/40 bg-blood/10 px-3 py-1 font-badge text-[10px] font-bold uppercase tracking-[.1em] text-blood shadow-[0_0_12px_rgba(225,9,34,.2)]">
          <span className="blink-dot size-1.5 rounded-full bg-blood" />
          Места ограничены
        </span>
      </div>

      <Eyebrow className="text-[12px]" lineClassName="w-7">
        Предзапись
      </Eyebrow>
      <h2 className="section-title mt-2 text-[34px] uppercase leading-none tracking-title text-white">
        Оставить заявку
      </h2>
      <p className="mt-2 text-[13px] leading-[1.6] text-white/60">
        Участники предзаписи получают специальную цену и первыми узнают дату старта.
      </p>

      {notice && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#7CD4FF]/55 bg-[#8FDAFF]/15 px-3.5 py-3 shadow-[0_0_18px_rgba(124,212,255,.18)]"
        >
          <InfoIcon className="mt-px size-4 shrink-0 text-[#7CD4FF]" />
          <span className="text-[13px] leading-[1.5] text-[#dff3ff]">{notice}</span>
        </div>
      )}

      <form className="mt-6 space-y-3" onSubmit={handleSubmit} noValidate>
        {/* Honeypot: скрыто от людей, ловит ботов. Пригодится, когда вернётся бэкенд. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <Field id="f-name" label="Имя" error={ERROR_TEXT.name} invalid={errors.name}>
          <UserIcon className="fi-icon" />
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="given-name"
            placeholder="Как вас зовут?"
            className="fi-input"
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
          />
        </Field>

        <Field
          id="f-phone"
          labelClassName="flex items-center gap-2"
          label={
            <>
              Номер телефона
              <span className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#25D366]">
                <WhatsAppIcon className="size-2.5 fill-[#25D366]" />
                WhatsApp
              </span>
            </>
          }
          error={ERROR_TEXT.phone}
          invalid={errors.phone}
        >
          <PhoneIcon className="fi-icon" />
          <input
            ref={phone.ref}
            id="f-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="+7(999)000-00-00"
            maxLength={16}
            className="fi-input font-badge tracking-wide"
            value={phone.value}
            {...phone.handlers}
          />
        </Field>

        <Field id="f-insta" label="Ник в Instagram" error={ERROR_TEXT.instagram} invalid={errors.instagram}>
          <InstagramIcon className="fi-icon" />
          <span className="select-none pr-1 font-badge text-[14px] font-bold text-[#6AA0FF]">@</span>
          <input
            id="f-insta"
            name="instagram"
            type="text"
            autoComplete="off"
            placeholder="username"
            className="fi-input flex-1 pl-0"
            value={values.instagram}
            onChange={handleChange('instagram')}
            onBlur={handleBlur('instagram')}
          />
        </Field>

        <Field
          id="f-why"
          label="Почему хочешь пойти на курс?"
          boxClassName="items-start py-3"
          error={ERROR_TEXT.why}
          invalid={errors.why}
        >
          <textarea
            id="f-why"
            name="why"
            rows={4}
            placeholder="Расскажи коротко о себе и своей цели..."
            className="fi-input resize-none pl-0 leading-[1.6]"
            value={values.why}
            onChange={handleChange('why')}
            onBlur={handleBlur('why')}
          />
        </Field>

        {/* Согласие на обработку ПД (обязательное, 152-ФЗ) */}
        <ConsentCheckbox id="f-consent" checked={consent} onChange={setConsent}>
          Нажимая кнопку «Оставить заявку», я подтверждаю, что ознакомился(ась) с{' '}
          <ConsentLink href="/docs/privacy-policy.pdf">
            Политикой в отношении обработки персональных данных
          </ConsentLink>{' '}
          и даю{' '}
          <ConsentLink href="/docs/personal-data-consent.pdf">
            Согласие на обработку персональных данных
          </ConsentLink>
          .
        </ConsentCheckbox>

        {consentError && (
          <p className="text-center text-[11px] font-semibold text-[#ff2f43]">
            Необходимо согласие на обработку данных
          </p>
        )}

        {/* Согласие на рекламную рассылку (необязательное) */}
        <ConsentCheckbox id="f-marketing" checked={marketing} onChange={setMarketing}>
          Даю{' '}
          <ConsentLink href="/docs/marketing-consent.pdf">
            согласие на получение информационных и рекламных материалов
          </ConsentLink>{' '}
          об образовательных программах, курсах, мероприятиях, специальных предложениях и услугах Оператора.
        </ConsentCheckbox>

        <button
          type="submit"
          disabled={status !== 'idle'}
          className={cn(BTN_BASE, status === 'sent' ? BTN_SENT : BTN_IDLE)}
        >
          {status === 'idle' && (
            <>
              <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
              Оставить заявку
              <ArrowRightIcon className="size-5 shrink-0" />
            </>
          )}
          {status === 'sending' && <span>Отправляем…</span>}
          {status === 'sent' && (
            <>
              <CheckIcon className="size-5" />
              <span>Заявка отправлена</span>
            </>
          )}
        </button>
      </form>
    </section>
  )
}

type ConsentCheckboxProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

function ConsentCheckbox({ id, checked, onChange, children }: ConsentCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 pt-1">
      <div className="relative mt-0.5 shrink-0">
        <input
          id={id}
          type="checkbox"
          value="1"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="consent-input sr-only"
        />
        <div className="fi-checkbox">
          <CheckMarkIcon className="size-3 text-white" />
        </div>
      </div>
      <span className="text-[11px] leading-[1.65] text-white/55">{children}</span>
    </label>
  )
}

function ConsentLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="text-[#6AA0FF] underline underline-offset-2 transition-colors hover:text-white"
    >
      {children}
    </a>
  )
}
