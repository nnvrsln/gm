import type { CSSProperties } from 'react'
import { LEGAL_DOCS, SELLER, SELLER_PHONE_HREF } from '../data/legal'
import { whatsappHref } from '../data/tariffs'
import { HeartIcon } from './icons'

const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

const FOOTER_NAV = [
  { href: '#audience', label: 'Для кого?' },
  { href: '#coach', label: 'Автор обучения' },
  { href: '#program', label: 'Программа обучения' },
  { href: '#learning', label: 'Как проходит обучение' },
  { href: '#tariffs', label: 'Выбери свой тариф' },
  { href: '#authority', label: 'Признание коллег' },
  { href: '#faq', label: 'Частые вопросы' },
]

const CONTACT_MESSAGE = 'Здравствуйте! Хочу узнать подробнее об обучении'

export function SiteFooter() {
  const contact = whatsappHref(CONTACT_MESSAGE)
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 px-5 pb-5 pt-1">
      <span aria-hidden="true" className="block h-px bg-white/[.07]" />

      <p className="mt-6 max-w-[290px] font-badge text-[11px] font-bold uppercase leading-[1.45] tracking-[.04em] text-white/58">
        Практическая система подготовки от <span className="text-white/85">Гаджиева Гаджи Муслимовича</span>
      </p>

      <nav aria-label="Разделы страницы" className="mt-4">
        <ul className="grid grid-cols-2 gap-x-4">
          {FOOTER_NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                style={BEBAS}
                className="flex min-h-11 items-center text-[13px] uppercase leading-[1.1] tracking-[1px] text-white/62 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <span aria-hidden="true" className="mt-4 block h-px bg-white/[.07]" />

      <nav aria-label="Правовая информация">
        <ul className="flex flex-col">
          {LEGAL_DOCS.map((doc) => (
            <li key={doc.id}>
              {doc.href ? (
                <a
                  href={doc.href}
                  className="flex min-h-11 items-center text-[11.5px] leading-[1.4] text-white/58 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
                >
                  {doc.title}
                </a>
              ) : (
                <span className="flex min-h-11 items-center text-[11.5px] leading-[1.4] text-white/42 underline decoration-dotted decoration-white/20 underline-offset-4">
                  {doc.title}
                </span>
              )}
            </li>
          ))}
        </ul>

        {contact && (
          <a
            href={contact}
            target="_blank"
            rel="noopener"
            className="flex min-h-11 items-center text-[11.5px] leading-[1.4] text-[#6AA0FF] underline decoration-[#6AA0FF]/35 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
          >
            Написать в WhatsApp
          </a>
        )}
      </nav>

      <address className="mt-2 font-badge text-[11px] not-italic leading-[1.5] text-white/45">
        <p className="text-white/40">Контакты для связи:</p>
        <a
          href={SELLER_PHONE_HREF}
          className="flex min-h-11 w-fit items-center text-[12px] text-white/62 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
        >
          {SELLER.phone}
        </a>
        <a
          href={`mailto:${SELLER.email}`}
          className="flex min-h-11 w-fit items-center text-[12px] text-white/62 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
        >
          {SELLER.email}
        </a>

        <p className="mt-3 text-white/58">
          {SELLER.form}
          <br />
          {SELLER.fullName}
        </p>
        <p className="mt-1.5">ИНН: {SELLER.inn}</p>
        <p>ОГРНИП: {SELLER.ogrnip}</p>
      </address>

      <span aria-hidden="true" className="mt-4 block h-px bg-white/[.07]" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="font-badge text-[10.5px] font-medium tracking-wide text-white/40">
          © {year}. Все права защищены
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-badge text-[11px] font-medium tracking-wide text-white/35">Создано с любовью</span>
          <HeartIcon className="size-3.5 shrink-0" />
          <a
            href="https://t.me/nnvrsln"
            target="_blank"
            rel="noopener"
            className="flex min-h-11 items-center font-badge text-[11px] font-semibold tracking-wide text-[#6AA0FF] transition-colors hover:text-white"
          >
            nunaev.ru
          </a>
        </span>
      </div>
    </footer>
  )
}
