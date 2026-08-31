import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

/** Значок «проверено» в бейдже героя. */
export function VerifiedIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.3 12.35L11.25 14.3L15.25 9.9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.25L14.05 5.02L16.76 4.9L17.62 7.48L19.94 8.88L19.28 11.52L20.25 14.05L18.08 15.68L17.52 18.34L14.8 18.55L12.6 20.15L10.28 18.74L7.59 19.17L6.72 16.6L4.31 15.35L4.96 12.72L3.75 10.28L5.91 8.64L6.28 5.95L8.99 5.72L12 3.25Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowRightIcon({ strokeWidth = 2.2, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12H18.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M13.7 6.8L18.9 12L13.7 17.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Треугольник «play» на кнопке «Посмотреть программу». */
export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8.4 5.4a.9.9 0 011.36-.77l9.1 6.6a.9.9 0 010 1.54l-9.1 6.6a.9.9 0 01-1.36-.77V5.4z" />
    </svg>
  )
}

/* ── Иконки чипов героя ──────────────────────────────────────────────────
   Один стиль на все четыре: контур 1.6, viewBox 24, без заливок — иначе
   в квадратах 18px они читаются как разные наборы. */

/** «Онлайн» — монитор. */
export function MonitorIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="4" width="19" height="13" rx="2.5" />
      <path d="M12 17v3.5M8.5 20.5h7" />
    </svg>
  )
}

/** «Практика» — тактическая доска. */
export function TacticsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M12 4.5v15M3 9.5h2.6v5H3M21 9.5h-2.6v5H21" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  )
}

/** «Авторский курс» — наградная медаль. */
export function AwardIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="9" r="5.4" />
      <path d="M8.6 13.4L7.2 21l4.8-2.5 4.8 2.5-1.4-7.6" />
    </svg>
  )
}

/** «Для тренеров» — свисток. */
export function WhistleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="9" cy="14" r="5.6" />
      <circle cx="9" cy="14" r="1.7" />
      <path d="M13.6 10.8h5.6a1.9 1.9 0 010 3.8h-2.4" />
      <path d="M6.4 8.8V6.9A1.3 1.3 0 017.7 5.6h3" />
    </svg>
  )
}

/* ── Иконки списка «О курсе» ─────────────────────────────────────────────
   Tabler Icons (MIT, © 2020-2026 Paweł Kuna), https://tabler.io/icons —
   геометрия контуров взята из набора без изменений. Библиотека не ставится
   пакетом: нужны три иконки, а зависимость ради них потянула бы в бандл
   несколько тысяч. Толщина обводки снижена с родных 2 до 1.6 — по общему
   правилу иконок проекта (см. чипы героя выше), иначе набор распадается
   на два разных. */

/** «Актуальная методология» — разметка футбольного поля. */
export function SoccerFieldIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M3 9h3v6h-3l0 -6" />
      <path d="M18 9h3v6h-3l0 -6" />
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M12 5l0 14" />
    </svg>
  )
}

/** «Практика и реальные кейсы» — футбольный мяч. */
export function FootballIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55l4.76 -3.45" />
      <path d="M12 7v-4m3 13l2.5 3m-.74 -8.55l3.74 -1.45m-11.44 7.05l-2.56 2.95m.74 -8.55l-3.74 -1.45" />
    </svg>
  )
}

/** «Системное развитие» — ступени роста. */
export function GrowthIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 21v-14" />
      <path d="M9 15l3 -3l3 3" />
      <path d="M15 10l3 -3l3 3" />
      <path d="M3 21l18 0" />
      <path d="M12 21l0 -9" />
      <path d="M3 6l3 -3l3 3" />
      <path d="M6 21v-18" />
    </svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.857L.057 23.856a.5.5 0 0 0 .609.61l6.101-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.733 9.733 0 0 1-4.964-1.358l-.356-.212-3.69.891.924-3.593-.232-.37A9.716 9.716 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
    </svg>
  )
}

/**
 * Звёздочка у тарифа «ХИТ» — прямое требование ТЗ слайда 6: «нужно выделить
 * цветом 2-ой тариф и добавить туда значок звездочки и слово: ХИТ».
 *
 * Заливкой, а не контуром, в отличие от иконок слайда 5: она стоит рядом со
 * словом «ХИТ» в размере 11–13px, и контур в 1.6 на такой величине
 * превращается в кляксу. По той же причине пятиконечная звезда нарисована
 * с чуть притупленными вершинами — острые на 12px рвутся сглаживанием.
 */
export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.6l2.62 5.75 6.28.72a.62.62 0 01.35 1.08l-4.66 4.25 1.26 6.19a.62.62 0 01-.92.66L12 18.16l-5.53 3.09a.62.62 0 01-.92-.66l1.26-6.19-4.66-4.25a.62.62 0 01.35-1.08l6.28-.72L12 2.6z" />
    </svg>
  )
}

/** Мелкая галочка внутри кастомного чекбокса (viewBox 12×10). */
export function CheckMarkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 12 10" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 5l3.5 3.5L11 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Крупная галочка на кнопке после успешной отправки. */
export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 12l5 5L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
        fill="url(#heart-gradient)"
        stroke="none"
      />
      <defs>
        <linearGradient id="heart-gradient" x1="3" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e10922" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── Иконки «Как проходит обучение» (слайд 5) ────────────────────────────
   Одиннадцать фишек обучения, у каждой свой значок. Набор нарисован в общей
   системе проекта: viewBox 24, обводка 1.6, скруглённые концы, без заливок —
   те же параметры, что у чипов героя и у иконок Tabler выше, иначе на одной
   странице читаются два разных набора.

   Одиннадцатая иконка отдельно не заводится: «ПРАКТИКА» берёт готовый
   SoccerFieldIcon — «переносить знания на поле» это ровно разметка поля.

   Это временное решение по Q14: заказчик просил визуальный ряд («важно
   визуально отразить то, о чём мы говорим»), и когда он придёт, контур в
   плитке меняется на картинку — правка в одном компоненте FeatureTile.
   NANOFOOTBALL и SCOUTWAY ждут своих логотипов отдельно (Q15). */

/** «Онлайн-платформа» — монитор с треугольником записи. */
export function PlatformIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="3.5" width="19" height="13.5" rx="2.5" />
      <path d="M12 17v3.5M8.5 20.5h7" />
      <path d="M10.5 7.9l4 2.4-4 2.4V7.9z" />
    </svg>
  )
}

/** «Обратная связь» — два облака реплик. */
export function FeedbackIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.8 6.6a2 2 0 012-2h8.4a2 2 0 012 2v3.8a2 2 0 01-2 2H8.4l-3.4 2.8v-2.8h-.2a2 2 0 01-2-2V6.6z" />
      <path d="M17.4 8.4h1.8a2 2 0 012 2v3.4a2 2 0 01-2 2h-.4v2.6l-3-2.6h-3.2" />
    </svg>
  )
}

/** «Команда» — двое рядом, один чуть позади. */
export function TeamIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="9.2" cy="8.4" r="3.2" />
      <path d="M3.2 19.6c0-3.1 2.7-5.5 6-5.5s6 2.4 6 5.5" />
      <path d="M16.4 6.5a3 3 0 010 5.6" />
      <path d="M17.6 14.5c2 .8 3.4 2.6 3.4 5.1" />
    </svg>
  )
}

/** «Разработка тренировок в микрогруппах» — три узла одной схемы. */
export function MicrogroupIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="6.2" cy="7.4" r="2.2" />
      <circle cx="17.8" cy="7.4" r="2.2" />
      <circle cx="12" cy="17.6" r="2.2" />
      <path d="M8.4 7.4h7.2" />
      <path d="M7.3 9.3l3.6 6.4" />
      <path d="M16.7 9.3l-3.6 6.4" />
    </svg>
  )
}

/** NANOFOOTBALL — конструктор: сетка блоков и плюс. */
export function ConstructorIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3.4" width="7.6" height="7.6" rx="1.8" />
      <rect x="13.4" y="3.4" width="7.6" height="7.6" rx="1.8" />
      <rect x="3" y="13.4" width="7.6" height="7.6" rx="1.8" />
      <path d="M17.2 13.4v7.6M13.4 17.2h7.6" />
    </svg>
  )
}

/** SCOUTWAY — поиск игрока: фигура в лупе. */
export function ScoutIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="10.4" cy="10.4" r="6.4" />
      <path d="M15 15l5.4 5.4" />
      <circle cx="10.4" cy="8.9" r="1.9" />
      <path d="M7.3 14.3c.5-1.6 1.7-2.5 3.1-2.5s2.6.9 3.1 2.5" />
    </svg>
  )
}

/** «Разборы тренировок» — кадр с линией разбора. */
export function ReviewIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="2.4" />
      <path d="M6.6 15.4l3.3-3.7 2.6 2.2 4.9-5.1" />
      <path d="M15 8.8h2.4v2.4" />
    </svg>
  )
}

/** «Сертификат» — лист с печатью и лентой. */
export function CertificateIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.6 14.4H4.6A1.6 1.6 0 013 12.8V4.9a1.6 1.6 0 011.6-1.6h14.8A1.6 1.6 0 0121 4.9v6.2" />
      <path d="M6.4 7h8.2M6.4 10.4h4.6" />
      <circle cx="16.8" cy="15.6" r="3" />
      <path d="M14.7 17.9v3.8l2.1-1.2 2.1 1.2v-3.8" />
    </svg>
  )
}

/** «Тренерское портфолио» — папка-портфель. */
export function PortfolioIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.8" y="6.8" width="18.4" height="13" rx="2.4" />
      <path d="M8.8 6.8V5.5a1.9 1.9 0 011.9-1.9h2.6a1.9 1.9 0 011.9 1.9v1.3" />
      <path d="M2.8 12.2h18.4" />
      <path d="M10.4 12.2v2.2h3.2v-2.2" />
    </svg>
  )
}

/** «Закрытое тренерское сообщество» — облако реплики с замком. */
export function LockedChatIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 11.4c0 4.1-4 7.4-9 7.4-1.1 0-2.1-.16-3.1-.45L3.7 20.6l1.4-3.9C3.8 15.3 3 13.4 3 11.4 3 7.3 7 4 12 4s9 3.3 9 7.4z" />
      <path d="M9.9 11.1V9.7a2.1 2.1 0 014.2 0v1.4" />
      <rect x="9.1" y="11.1" width="5.8" height="4.1" rx="1.2" />
    </svg>
  )
}
