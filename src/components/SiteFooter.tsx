import type { CSSProperties } from 'react'
import { LEGAL_DOCS, sellerLine } from '../data/legal'
import { whatsappHref } from '../data/tariffs'
import { HeartIcon } from './icons'

/**
 * Мини-подвал: навигация по странице, правовой блок, копирайт и подпись
 * студии.
 *
 * В ТЗ подвала нет вовсе, но страница продаёт услугу и будет принимать
 * оплату, а значит по закону обязана показывать до оплаты политику обработки
 * персональных данных (152-ФЗ, ч. 2 ст. 18.1), публичную оферту (ст. 437 ГК
 * плюс правила дистанционной продажи) и реквизиты продавца (ЗоЗПП, ст. 8–10).
 * Разбор — в `src/data/legal.ts` и в Q24.
 *
 * ── Из чего собран ───────────────────────────────────────────────────────
 * Четыре яруса, разделённые волосяными линиями `white/[.07]` — теми же, что
 * делят вопросы FAQ. Ниже тарифов на странице нет ни одной рамки, и подвал
 * не заводит новую: он собран из линий, капслока и воздуха.
 *
 *   1. **Название академии** — дословно строка первого экрана, ничего
 *      нового не сочинено. Подвал должен называть, чей это сайт;
 *   2. **навигация** — шесть секций в две колонки, Bebas-капслоком, как
 *      набраны заголовки самих секций и вопросы FAQ. Это единственная
 *      навигация на странице: шапки в макете нет, и с низа страницы вернуться
 *      к тарифам было нечем;
 *   3. **правовой ярус** — документы и реквизиты;
 *   4. **нижняя строка** — копирайт и подпись студии.
 *
 * ── Почему ссылки выглядят по-разному ────────────────────────────────────
 * Навигация — Bebas 13px, это переходы по своей же странице, их жмут чаще
 * всего. Правовые документы — Onest 11.5px с подчёркиванием: подчёркивание
 * здесь не украшение, а обещание, что ссылка ведёт в документ.
 *
 * **Документа ещё нет — ссылки нет.** Пустой `href` рисуется приглушённой
 * надписью с пунктирным подчёркиванием: пунктир говорит «документ
 * готовится», сплошная линия обещала бы работающую ссылку. Тот же приём, что
 * у кнопок WhatsApp в тарифах без номера. Так же спрятана и строка
 * реквизитов, и контакт в WhatsApp — появятся в данных, появятся на странице.
 *
 * Тач-цель у всех ссылок — 44px по высоте (`min-h-11`), как у точек ленты
 * сегментов и кнопок аккордеона.
 */

// Bebas инлайновым стилем, а не утилитой font-[...]: имя шрифта с пробелами
// Tailwind как arbitrary-значение не разбирает. Так же во всех секциях.
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/**
 * Навигация по секциям. Подписи — сокращённые заголовки самих секций, а не
 * новые формулировки; порядок — порядок страницы. «Автор обучения» взят из
 * надзаголовка слайда 3: его заголовок — имя, и в списке ссылок имя рядом с
 * «Программой» читалось бы разделом про человека, а не переходом.
 */
const FOOTER_NAV = [
  { href: '#audience', label: 'Для кого?' },
  { href: '#coach', label: 'Автор обучения' },
  { href: '#program', label: 'Программа обучения' },
  { href: '#learning', label: 'Как проходит обучение' },
  { href: '#tariffs', label: 'Выбери свой тариф' },
  { href: '#faq', label: 'Частые вопросы' },
]

/** Обращение в WhatsApp из подвала. Номера нет — блока контакта нет. */
const CONTACT_MESSAGE = 'Здравствуйте! Хочу узнать подробнее об обучении'

export function SiteFooter() {
  const seller = sellerLine()
  const contact = whatsappHref(CONTACT_MESSAGE)
  // Год берётся с часов, а не вписан числом: копирайт с прошлогодней датой —
  // первое, что выдаёт заброшенный сайт.
  const year = new Date().getFullYear()

  return (
    // relative z-10: общий фон секций (CourseBackdrop) — слой с z-[3], и он
    // тянется ниже своей обёртки; без подъёма подвал уходит под слой.
    <footer className="relative z-10 px-5 pb-5 pt-1">
      <span aria-hidden="true" className="block h-px bg-white/[.07]" />

      {/* ── 1. Кто это ─────────────────────────────────────────────────── */}
      <p className="mt-6 max-w-[290px] font-badge text-[11px] font-bold uppercase leading-[1.45] tracking-[.04em] text-white/58">
        Онлайн-академия футбольных тренеров <span className="text-white/85">Гаджи Гаджиева</span>
      </p>

      {/* ── 2. Навигация ───────────────────────────────────────────────── */}
      {/* Две колонки, а не одна: шесть строк по 44px в столбик — это 264px
          подвала, больше половины экрана телефона. */}
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

      {/* ── 3. Право ───────────────────────────────────────────────────── */}
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
                // Документа ещё нет: пунктир вместо сплошной линии говорит,
                // что он готовится, а не что ссылка сломалась.
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

      {seller && <p className="mt-1 font-badge text-[10.5px] leading-[1.5] text-white/40">{seller}</p>}

      {/* ── 4. Нижняя строка ───────────────────────────────────────────── */}
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
            // min-h-11 и здесь: ссылка мелкая, но это ссылка, а тач-цель
            // меньше 44px на телефоне промахивается.
            className="flex min-h-11 items-center font-badge text-[11px] font-semibold tracking-wide text-[#6AA0FF] transition-colors hover:text-white"
          >
            nunaev.ru
          </a>
        </span>
      </div>
    </footer>
  )
}
