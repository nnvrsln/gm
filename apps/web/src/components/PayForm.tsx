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

/**
 * Форма покупки внутри листа оплаты: контакты, согласия, проверка.
 *
 * ── Что просил владелец ──────────────────────────────────────────────────
 * «Поля ввода mail, telegram (если есть), whatsapp (если есть). А также
 * номер телефона (обязательно). Снизу чекбоксы с политикой и обработкой
 * данных.» Отсюда четыре поля и два согласия; телефон и почта обязательны,
 * Telegram и WhatsApp — нет, и это сказано подписью «необязательно», а не
 * звёздочкой: звёздочку надо расшифровывать сноской, слово — не надо.
 *
 * ── Чего форма НЕ делает ─────────────────────────────────────────────────
 * Никуда не отправляет. Бэкенда в проекте нет по условию (CLAUDE.md), приём
 * оплаты пойдёт через Prodamus отдельным этапом (`04-PLAN.md`, этап 10).
 * Поэтому форма честно доводит дело до проверки и останавливается: при
 * успехе зовёт `onValid`, а лист рисует под кнопкой строку о том, что
 * оплата ещё не подключена. Собирать данные, которые некуда положить, —
 * хуже, чем не собирать: человек решит, что заявка ушла.
 *
 * ── Два согласия, а не одно ──────────────────────────────────────────────
 * Так требует Q24 (`03-QUESTIONS.md`): согласие на обработку персональных
 * данных и согласие на рекламную рассылку — разные основания, и ст. 18
 * закона «О рекламе» требует отдельного предварительного согласия именно на
 * рекламу; одним чекбоксом его не закрыть. Оба сняты по умолчанию:
 * предзаполненная галочка согласием не считается (152-ФЗ). Обязательно
 * только первое — второе живёт без ошибки и без звёздочки.
 *
 * Ссылка на политику стоит прямо в подписи чекбокса, а не в подвале: до
 * согласия человек должен иметь возможность прочитать, на что соглашается.
 * Документа пока нет (`LEGAL_DOCS`, href пустой), и тогда рисуется не
 * ссылка, а пунктирная надпись — тем же приёмом, что в подвале: битая
 * ссылка на «Политику» хуже её отсутствия.
 *
 * ── Как проверяются поля ─────────────────────────────────────────────────
 * Правила взяты из UX-набора (`ui-ux-pro-max`, категория Forms): проверка
 * на blur, а не только по кнопке; ошибка стоит под своим полем и связана с
 * ним через `aria-describedby`; при неудачной отправке сверху появляется
 * сводка со ссылками на проваленные поля, и фокус уезжает в неё.
 *
 * Ввод ошибку не зажигает, только гасит уже показанную: подсвечивать
 * «неверный e-mail» на второй букве — травля. На blur ошибка показывается
 * только если поле трогали или оно уже горело.
 */

// EMAIL_RE (нестрогая проверка почты) и TELEGRAM_RE (латиница, цифры и
// подчёркивание, 5–32 знака, собачка необязательна) переехали в
// `@gm/shared`: теми же правилами проверяет вход сервер.

type FieldId = 'phone' | 'email' | 'telegram' | 'whatsapp'

const CHECKS: Record<FieldId, (value: string) => boolean> = {
  phone: (v) => PHONE_RE.test(v),
  email: (v) => EMAIL_RE.test(v.trim()),
  // Необязательные: пустое поле — верное поле. Заполненное проверяется.
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

/** Порядок полей в форме — он же порядок строк в сводке ошибок. */
const ORDER: FieldId[] = ['phone', 'email', 'telegram', 'whatsapp']

/** Идентификатор формы. Кнопка отправки живёт в подвале листа, вне <form>. */
export const PAY_FORM_ID = 'pay-form'

export function PayForm({ onValid, onDirty }: { onValid: () => void; onDirty: () => void }) {
  const phone = usePhoneMask()
  const whatsapp = usePhoneMask()
  const [text, setText] = useState({ email: '', telegram: '' })
  const [invalid, setInvalid] = useState<Invalid>(NONE)
  const [consent, setConsent] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [consentInvalid, setConsentInvalid] = useState(false)

  // Значение телефонов меняет маска, а не onChange поля, поэтому ошибку по
  // ним снимаем реактивно — и только если она уже показана.
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
      // Сводки ошибок над формой больше нет — владелец снял её, потому что
      // ошибку показывает само поле. Но одну её работу пришлось оставить:
      // кнопка стоит в подвале листа, а проваленное поле может быть выше
      // границы прокрутки, и без этого человек нажимает «Оплатить» и не
      // видит, что изменилось. Поэтому лист сам подводит к первой ошибке.
      const target = firstBad
        ? document.getElementById(`pay-${firstBad}`)
        : document.getElementById('pay-consent')
      const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Прокручиваем подпись, а не сам инпут согласия: инпут прозрачный и
      // лежит поверх квадрата, и в центре экрана оказался бы один квадрат
      // без текста, к которому он относится.
      const seen = firstBad ? target : target?.closest('label')
      seen?.scrollIntoView({ block: 'center', behavior: quiet ? 'auto' : 'smooth' })
      // preventScroll: прокрутку уже сделали сами, и без флага браузер
      // доводил бы элемент до края области, отменяя центрирование.
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
        {/* Телефон первым: он единственный обязательный по прямому
            требованию владельца, и по нему с покупателем свяжутся, если
            оплата сорвётся. */}
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
            // Документа ещё нет: пунктир говорит, что он готовится, а не
            // что ссылка сломалась. Тот же приём, что в подвале.
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

/**
 * Поле формы: подпись, коробка со значком и место под ошибку.
 *
 * Подпись отдельной строкой, а не плейсхолдером: плейсхолдер исчезает при
 * первом же знаке, и заполненная форма превращается в четыре одинаковые
 * строки без имён. Плейсхолдер остаётся, но показывает **формат**, а не
 * название поля.
 */
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
        {/* У значка WhatsApp рисунок заливкой, а не контуром, — ему нужен
            явный fill, иначе он остаётся чёрным на тёмной подложке. */}
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

      {/* Текст ошибки появляется внутри уже существующего <p>: role=alert
          срабатывает на изменение содержимого, а не на монтирование узла, —
          и заодно коробке есть что анимировать при раскрытии. */}
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

/**
 * Согласие. Настоящий <input type="checkbox">, визуально скрытый, но
 * фокусируемый: без него таб-навигация по форме слепая, а квадрат из <div>
 * не переключается пробелом.
 */
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
  /** Текст ошибки. Есть только у обязательного согласия. */
  error?: string
  onChange: (next: boolean) => void
  children: ReactNode
}) {
  return (
    <div>
      {/* relative обязателен: внутри лежит абсолютный <input>, и без него
          его содержащим блоком становится .pay-sheet — разбор в index.css
          рядом с .pay-check-input. */}
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

      {/* Согласие говорит о своей ошибке словами, а не одной красной
          рамкой квадрата: рамка в 1px на 21px — самый тихий сигнал в
          форме, и после снятия сводки ошибок он остался бы единственным.
          Текст появляется внутри уже существующего <p>, чтобы role=alert
          сработал на изменение содержимого, — как у полей ввода. */}
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
