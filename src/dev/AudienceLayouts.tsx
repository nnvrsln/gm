import { Fragment, useRef, useState, type ReactNode } from 'react'
import { AUDIENCE, type AudienceCard } from '../data/audience'
import { WhistleIcon } from '../components/icons'

/**
 * Макетная секции «Для кого?»: десять подач одного и того же содержимого.
 * Отдельная точка входа (audience.html → src/audience.tsx), в прод-сборку
 * не попадает — Vite собирает только index.html.
 *
 * Зачем: три предыдущие раскладки владелец отверг подряд, при этом
 * фотографии его устраивают — не нравится подача. Все три были структурно
 * одинаковы (вертикальный список строк, менялись пропорции кадра и текста),
 * поэтому здесь собраны подходы из мира мобильных приложений, а не
 * лендингов: карточка-поверхность, свайп с пагинацией, сегментированный
 * контрол, раскрывающийся список, карточка-обложка, сетка с раскрытием,
 * истории-кружки, фон-переключатель, постер-свайп и нижний лист.
 *
 * Правила взяты из app-чеклиста скилла ui-ux-pro-max (references/pro-rules.md):
 *   • тач-цель не меньше 44px, у иконок расширяем зону нажатия;
 *   • отклик на нажатие есть всегда и не двигает соседей — только opacity
 *     и transform самого элемента;
 *   • поверхности отделяются от фона (граница + внутренняя подсветка),
 *     разделители обязаны читаться в тёмной теме;
 *   • декоративные иконки скрыты из дерева доступности, у контролов есть
 *     имя и состояние (aria-selected / aria-expanded);
 *   • ритм отступов кратен 4.
 *
 * Собрано на настоящих токенах и классах проекта, поэтому выбранный вариант
 * переносится в боевые компоненты почти как есть.
 */

export function AudienceLayouts() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1500px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          «Для кого?» — десять подач
        </h1>
        <p className="mt-3 max-w-[72ch] text-[14px] leading-relaxed text-white/58">
          Четыре сегмента из ТЗ в десяти разных решениях. Подходы взяты из мобильных
          приложений, а не из лендингов: у нас только мобильная версия, и логика экрана
          приложения тут уместнее, чем логика страницы.
        </p>
        <p className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-white/40">
          Каждый вариант показан на проектных 430&nbsp;px и на 360&nbsp;px. Варианты 03, 04,
          06, 07, 08 и 10 интерактивные, 02 и 09 листаются пальцем — всё рабочее, можно
          потыкать. Оговорка: рамки — это блоки, а не окно браузера, поэтому медиазапросы по
          ширине вьюпорта внутри них не срабатывают.
        </p>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-10">
        <Frame
          n="01"
          name="Стеклянные карточки"
          why="Каждый сегмент — поверхность, приподнятая над фоном: подложка, светлая кромка сверху, тень. Кадр внутри карточки миниатюрой. Самый «интерфейсный» вариант, ближе всего к списку в приложении."
          tags={['Glassmorphism', 'класс .glass уже в проекте', '~840px', 'не интерактивный']}
        >
          <V1Glass />
        </Frame>

        <Frame
          n="02"
          name="Свайп с пагинацией"
          why="Один сегмент — один экран, листается пальцем, снизу точки. Стандартный паттерн онбординга в приложениях. Самый компактный: секция не растёт от числа сегментов."
          tags={['snap-карусель', 'рабочие точки', '~470px', 'три из четырёх за свайпом']}
        >
          <V2Swipe />
        </Frame>

        <Frame
          n="03"
          name="Сегментированный контрол"
          why="Четыре коротких чипа сверху, под ними одна панель. Все аудитории видны сразу списком чипов, человек тыкает в свою. Паттерн переключателя из iOS/Android."
          tags={['чипы + панель', 'тач-цель 44px', '~520px', 'описания скрыты']}
        >
          <V3Segmented />
        </Frame>

        <Frame
          n="04"
          name="Раскрывающийся список"
          why="Строка с миниатюрой и названием, описание раскрывается по нажатию. Все четыре названия помещаются в один экран — человек сканирует и открывает своё. Паттерн списка настроек."
          tags={['аккордеон', 'aria-expanded', '~380px свёрнут', 'самый компактный']}
        >
          <V4Accordion />
        </Frame>

        <Frame
          n="05"
          name="Карточка-обложка"
          why="Скруглённая карточка: кадр занимает верх, номер лежит стеклянным чипом поверх снимка, текст на теле карточки. Так выглядит карточка контента в медиа-приложениях."
          tags={['карточка с обложкой', 'чип поверх фото', '~1150px', 'не интерактивный']}
        >
          <V5Cover />
        </Frame>

        <Frame
          n="06"
          name="Плитки 2×2 с раскрытием"
          why="Четыре высокие плитки в сетке, название поверх кадра. По нажатию плитка раскрывает описание во всю ширину прямо под своим рядом — поэтому текст не приходится ужимать до нечитаемого кегля, как было бы в обычном бенто."
          tags={['сетка 2×2', 'раскрытие в ряд', '~640px', 'интерактивный']}
        >
          <V6Grid />
        </Frame>

        <Frame
          n="07"
          name="Истории (кружки)"
          why="Фотографии становятся самим переключателем: ряд круглых портретов с подписями, у активного акцентное кольцо. Под ними — только текст. Кадры работают в навигации, а не занимают высоту второй раз."
          tags={['круглые аватары', 'фото = навигация', '~400px', 'интерактивный']}
        >
          <V7Stories />
        </Frame>

        <Frame
          n="08"
          name="Фон-переключатель"
          why="Кадр выбранного сегмента становится фоном всего блока и меняется плавно. Названия стоят вертикальным меню поверх. Фотографии показаны крупно, но высота секции не растёт от их числа."
          tags={['фото фоном', 'кроссфейд', '~470px', 'интерактивный']}
        >
          <V8Backdrop />
        </Frame>

        <Frame
          n="09"
          name="Постер-свайп"
          why="Как вариант 02, но карточка — целиком постер: кадр во всю площадь, текст поверх по затемнению. Самый киношный и при этом компактный, потому что листается."
          tags={['постеры', 'snap-карусель', '~520px', 'три из четырёх за свайпом']}
        >
          <V9PosterSwipe />
        </Frame>

        <Frame
          n="10"
          name="Нижний лист"
          why="Компактная сетка ярлыков, по нажатию снизу выезжает лист с кадром и полным текстом — как карточка объекта в приложении. Блок в покое занимает мало места, а текст доступен целиком."
          tags={['bottom sheet', 'затемнение + Esc', '~330px в покое', 'интерактивный']}
        >
          <V10Sheet />
        </Frame>
      </div>

      <footer className="mx-auto mt-14 max-w-[1500px] border-t border-white/12 pt-6 text-[13px] leading-relaxed text-white/40">
        Заголовок «ДЛЯ КОГО?» и кнопка «К программе» во всех вариантах одинаковые — их задаёт
        ТЗ, обсуждается только подача сегментов. У «Тренеров любительских команд» фотографии
        пока нет (вопрос Q6), везде стоит одна и та же заглушка.
      </footer>
    </div>
  )
}

/* ── Общие детали ───────────────────────────────────────────────────────── */

/**
 * Кадр сегмента. Заглушка на месте недостающей фотографии — не серая плашка
 * «нет данных», а тон панели с приглушённым акцентным свечением: пропуск
 * видно, но он читается частью макета.
 */
function Photo({ card, className }: { card: AudienceCard; className?: string }) {
  if (!card.image) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center bg-panel2 [background-image:radial-gradient(120%_90%_at_30%_16%,rgba(106,160,255,.18),transparent_68%)] ${className ?? ''}`}
      >
        <WhistleIcon className="size-1/3 max-h-12 max-w-12 text-[#6AA0FF]/40" />
      </div>
    )
  }

  return (
    <img
      src={card.image}
      alt={card.alt}
      loading="lazy"
      style={{
        objectPosition: card.position,
        transform: card.zoom ? `scale(${card.zoom})` : undefined,
      }}
      className={`object-cover ${className ?? ''}`}
    />
  )
}

/** Заголовок секции — одинаковый во всех вариантах, его задаёт ТЗ. */
function SectionTitle() {
  return (
    <h2 className="section-title text-[32px] uppercase leading-[.94] tracking-title">Для кого?</h2>
  )
}

/** Кнопка из ТЗ. Тач-цель даёт .btn-hero (min-height 48px). */
function ProgramButton() {
  return (
    <div className="mt-8 flex">
      <a href="#program" className="btn-hero btn-hero-primary w-full">
        К программе
      </a>
    </div>
  )
}

/** Короткие ярлыки для чипов — полные названия сегментов туда не влезают. */
const SHORT_LABELS = ['Юношеские', 'Любительские', 'Профи', 'Игроки']

/* ── 01. Стеклянные карточки ────────────────────────────────────────────── */

function V1Glass() {
  return (
    <>
      <SectionTitle />
      <ul className="mt-6 flex flex-col gap-3">
        {AUDIENCE.map((card) => (
          <li key={card.num} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3.5">
              <div className="size-[72px] shrink-0 overflow-hidden rounded-xl ring-1 ring-inset ring-white/10">
                <Photo card={card} className="h-full w-full" />
              </div>
              <h3 className="section-title text-[17px] uppercase leading-[1.06] tracking-title">
                {card.title}
              </h3>
            </div>
            <p className="mt-3 text-[12px] leading-[1.55] text-white/70">{card.detail}</p>
          </li>
        ))}
      </ul>
      <ProgramButton />
    </>
  )
}

/* ── 02. Свайп с пагинацией ─────────────────────────────────────────────── */

function V2Swipe() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  // Активная точка считается по позиции прокрутки, а не по клику: листают
  // пальцем, и индикатор должен идти за пальцем.
  const onScroll = () => {
    const el = track.current
    if (!el) return
    const step = el.scrollWidth / AUDIENCE.length
    setActive(Math.min(AUDIENCE.length - 1, Math.round(el.scrollLeft / step)))
  }

  return (
    <>
      <SectionTitle />

      {/* -mx-5 выпускает ленту к краям экрана, px-5 возвращает поля первой и
          последней карточке. Прокрутка живёт внутри ленты — страница по
          горизонтали не едет. */}
      <ul
        ref={track}
        onScroll={onScroll}
        className="mt-6 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {AUDIENCE.map((card) => (
          <li
            key={card.num}
            className="w-[262px] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/12 bg-panel"
          >
            <Photo card={card} className="h-[150px] w-full" />
            <div className="p-3.5">
              <h3 className="section-title text-[16px] uppercase leading-[1.06] tracking-title">
                {card.title}
              </h3>
              <p className="mt-2 text-[11.5px] leading-[1.5] text-white/68">{card.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Точки — индикатор, а не орган управления: свайп остаётся основным
          жестом, поэтому это span, а не button. */}
      <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
        {AUDIENCE.map((card, index) => (
          <span
            key={card.num}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              index === active ? 'w-5 bg-[#6AA0FF]' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>

      <ProgramButton />
    </>
  )
}

/* ── 03. Сегментированный контрол ───────────────────────────────────────── */

function V3Segmented() {
  const [active, setActive] = useState(0)
  const card = AUDIENCE[active]

  return (
    <>
      <SectionTitle />

      {/* role=tablist, чтобы скринридер понимал переключатель. Лента
          прокручивается: четыре чипа в 430px не помещаются. */}
      <div
        role="tablist"
        aria-label="Аудитории курса"
        className="mt-6 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {AUDIENCE.map((item, index) => (
          <button
            key={item.num}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            // min-h-11 = 44px, тач-цель по app-чеклисту. Отклик — цветом и
            // масштабом самого чипа: соседи не двигаются.
            className={`min-h-11 shrink-0 rounded-full border px-4 font-badge text-[12.5px] font-bold uppercase tracking-[.06em] transition-[background-color,border-color,color] duration-150 active:scale-[.97] ${
              index === active
                ? 'border-[#6AA0FF]/60 bg-[#6AA0FF]/16 text-white'
                : 'border-white/14 text-white/55'
            }`}
          >
            {SHORT_LABELS[index]}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/12 bg-panel">
        <Photo card={card} className="h-[172px] w-full" />
        <div className="p-4">
          <h3 className="section-title text-[18px] uppercase leading-[1.06] tracking-title">
            {card.title}
          </h3>
          <p className="mt-2.5 text-[12px] leading-[1.55] text-white/70">{card.detail}</p>
        </div>
      </div>

      <ProgramButton />
    </>
  )
}

/* ── 04. Раскрывающийся список ──────────────────────────────────────────── */

function V4Accordion() {
  const [open, setOpen] = useState<string | null>(AUDIENCE[0].num)

  return (
    <>
      <SectionTitle />
      <ul className="mt-6 flex flex-col gap-2">
        {AUDIENCE.map((card) => {
          const isOpen = open === card.num

          return (
            <li
              key={card.num}
              className={`overflow-hidden rounded-2xl border bg-panel transition-colors duration-200 ${
                isOpen ? 'border-[#6AA0FF]/34' : 'border-white/10'
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : card.num)}
                // Вся строка — тач-цель: 56px по высоте, во всю ширину.
                className="flex w-full items-center gap-3.5 p-3 text-left transition-colors duration-150 active:bg-white/[.04]"
              >
                <div className="size-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-inset ring-white/10">
                  <Photo card={card} className="h-full w-full" />
                </div>
                <h3 className="section-title flex-1 text-[15px] uppercase leading-[1.1] tracking-title">
                  {card.title}
                </h3>
                <Chevron open={isOpen} />
              </button>

              {/* grid-rows от 0 к 1 — раскрытие без замера высоты в JS и без
                  скачка раскладки. */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 [transition-timing-function:var(--ease-mass)] ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-3 pb-4 text-[12px] leading-[1.55] text-white/70">{card.detail}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <ProgramButton />
    </>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`size-5 shrink-0 text-white/45 transition-transform duration-300 [transition-timing-function:var(--ease-mass)] ${
        open ? 'rotate-180' : ''
      }`}
    >
      <path d="M6 9.5l6 5 6-5" />
    </svg>
  )
}

/* ── 05. Карточка-обложка ───────────────────────────────────────────────── */

function V5Cover() {
  return (
    <>
      <SectionTitle />
      <ul className="mt-6 flex flex-col gap-4">
        {AUDIENCE.map((card) => (
          <li
            key={card.num}
            className="overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-panel"
          >
            <div className="relative">
              <Photo card={card} className="h-[190px] w-full" />
              {/* Номер стеклянным чипом поверх снимка. backdrop-blur держит
                  цифру читаемой на любом кадре — на светлом газоне тоже. */}
              <span className="absolute left-3.5 top-3.5 rounded-lg border border-white/18 bg-black/35 px-2.5 py-1 backdrop-blur-sm">
                <span className="segment-index block text-[15px] leading-none">{card.num}</span>
              </span>
              {/* Низ снимка уходит в тон карточки — стык фото и текста без
                  жёсткой линии. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent_0%,rgba(10,17,25,.7)_60%,#0a1119_100%)]"
              />
            </div>
            <div className="px-4 pb-4 pt-1">
              <h3 className="section-title text-[19px] uppercase leading-[1.06] tracking-title">
                {card.title}
              </h3>
              <p className="mt-2.5 text-[12px] leading-[1.55] text-white/70">{card.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <ProgramButton />
    </>
  )
}

/* ── 06. Плитки 2×2 с раскрытием ────────────────────────────────────────── */

function V6Grid() {
  const [open, setOpen] = useState<string | null>(AUDIENCE[0].num)

  // Описание вставляется отдельной строкой сетки во всю ширину — после того
  // ряда, в котором лежит открытая плитка. Так текст получает полные 390px
  // вместо 187px в колонке: в бенто описание пришлось бы увести на ~10.5px,
  // мельче, чем везде на сайте.
  const openIndex = AUDIENCE.findIndex((card) => card.num === open)
  const openRow = openIndex < 0 ? -1 : Math.floor(openIndex / 2)

  return (
    <>
      <SectionTitle />
      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {AUDIENCE.map((card, index) => {
          const isOpen = card.num === open
          const rowEnd = index % 2 === 1
          const row = Math.floor(index / 2)

          return (
            <Fragment key={card.num}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : card.num)}
                className={`relative h-[186px] overflow-hidden rounded-2xl border text-left transition-colors duration-150 active:scale-[.98] ${
                  isOpen ? 'border-[#6AA0FF]/60' : 'border-white/12'
                }`}
              >
                <Photo card={card} className="absolute inset-0 h-full w-full" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_28%,rgba(5,9,14,.82)_78%,#05090e_100%)]"
                />
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="segment-index block text-[13px] leading-none">{card.num}</span>
                  <span className="section-title mt-1 block text-[14px] uppercase leading-[1.08] tracking-title">
                    {card.title}
                  </span>
                </span>
              </button>

              {/* Раскрытие идёт после конца ряда, а не сразу за плиткой —
                  иначе сетка разъезжается. */}
              {rowEnd && row === openRow && openIndex >= 0 && (
                <p className="col-span-2 rounded-2xl border border-[#6AA0FF]/24 bg-[#6AA0FF]/[.07] p-3.5 text-[12px] leading-[1.55] text-white/78">
                  {AUDIENCE[openIndex].detail}
                </p>
              )}
            </Fragment>
          )
        })}
      </div>
      <ProgramButton />
    </>
  )
}

/* ── 07. Истории (кружки) ───────────────────────────────────────────────── */

function V7Stories() {
  const [active, setActive] = useState(0)
  const card = AUDIENCE[active]

  return (
    <>
      <SectionTitle />

      <div
        role="tablist"
        aria-label="Аудитории курса"
        className="mt-6 -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {AUDIENCE.map((item, index) => {
          const selected = index === active
          return (
            <button
              key={item.num}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(index)}
              className="flex w-[72px] shrink-0 flex-col items-center gap-2 transition-transform duration-150 active:scale-[.96]"
            >
              {/* Кольцо рисуется ring-ом, а не рамкой: рамка меняла бы
                  размер бокса и дёргала соседей при переключении. */}
              <span
                className={`size-[68px] overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-[#0c141d] transition-[box-shadow,opacity] duration-200 ${
                  selected ? 'opacity-100 ring-[#6AA0FF]' : 'opacity-55 ring-white/15'
                }`}
              >
                <Photo card={item} className="h-full w-full" />
              </span>
              <span
                className={`text-center font-badge text-[10.5px] font-bold uppercase leading-tight tracking-[.04em] transition-colors duration-200 ${
                  selected ? 'text-white' : 'text-white/45'
                }`}
              >
                {SHORT_LABELS[index]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 border-l-2 border-[#6AA0FF]/70 pl-4">
        <h3 className="section-title text-[19px] uppercase leading-[1.06] tracking-title">
          {card.title}
        </h3>
        <p className="mt-2.5 text-[12.5px] leading-[1.6] text-white/70">{card.detail}</p>
      </div>

      <ProgramButton />
    </>
  )
}

/* ── 08. Фон-переключатель ──────────────────────────────────────────────── */

function V8Backdrop() {
  const [active, setActive] = useState(0)

  return (
    <>
      <SectionTitle />

      {/* -mx-5 выпускает подложку к краям экрана, внутренний px-5 возвращает
          поля тексту. Все четыре кадра лежат стопкой и переключаются
          прозрачностью — кроссфейд без перезагрузки картинки. */}
      <div className="relative -mx-5 mt-6 min-h-[300px] overflow-hidden">
        {AUDIENCE.map((card, index) => (
          <div
            key={card.num}
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-500 [transition-timing-function:var(--ease-mass)] ${
              index === active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Photo card={card} className="h-full w-full" />
          </div>
        ))}
        {/* Затемнение считаем под самый светлый кадр: текст лежит прямо на
            фотографии, и запас нужен по худшему случаю, а не по среднему. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,14,.55)_0%,rgba(5,9,14,.78)_46%,rgba(5,9,14,.94)_100%)]"
        />

        <div className="relative px-5 py-6">
          <ul role="tablist" aria-label="Аудитории курса" className="flex flex-col">
            {AUDIENCE.map((card, index) => {
              const selected = index === active
              return (
                <li key={card.num}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(index)}
                    className="flex min-h-11 w-full items-center gap-3 py-1.5 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-6 w-0.5 shrink-0 rounded-full transition-colors duration-200 ${
                        selected ? 'bg-[#6AA0FF]' : 'bg-white/18'
                      }`}
                    />
                    <span
                      className={`section-title text-[15px] uppercase leading-[1.08] tracking-title transition-opacity duration-200 ${
                        selected ? 'opacity-100' : 'opacity-45'
                      }`}
                    >
                      {card.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <p className="mt-4 border-t border-white/12 pt-4 text-[12.5px] leading-[1.6] text-white/80">
            {AUDIENCE[active].detail}
          </p>
        </div>
      </div>

      <ProgramButton />
    </>
  )
}

/* ── 09. Постер-свайп ───────────────────────────────────────────────────── */

function V9PosterSwipe() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const step = el.scrollWidth / AUDIENCE.length
    setActive(Math.min(AUDIENCE.length - 1, Math.round(el.scrollLeft / step)))
  }

  return (
    <>
      <SectionTitle />

      <ul
        ref={track}
        onScroll={onScroll}
        className="mt-6 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {AUDIENCE.map((card) => (
          <li
            key={card.num}
            className="relative h-[370px] w-[268px] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/12"
          >
            <Photo card={card} className="absolute inset-0 h-full w-full" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(5,9,14,.72)_58%,rgba(4,7,11,.96)_100%)]"
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="segment-index block text-[15px] leading-none">{card.num}</span>
              <h3 className="section-title mt-1.5 text-[17px] uppercase leading-[1.06] tracking-title">
                {card.title}
              </h3>
              <p className="mt-2 text-[11.5px] leading-[1.5] text-white/78">{card.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
        {AUDIENCE.map((card, index) => (
          <span
            key={card.num}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              index === active ? 'w-5 bg-[#6AA0FF]' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>

      <ProgramButton />
    </>
  )
}

/* ── 10. Нижний лист ────────────────────────────────────────────────────── */

function V10Sheet() {
  const [openNum, setOpenNum] = useState<string | null>(null)
  const card = AUDIENCE.find((item) => item.num === openNum) ?? null

  // Esc закрывает лист — по app-чеклисту у наложения должен быть способ
  // уйти, не целясь в крестик.
  const onKeyDown = (event: { key: string }) => {
    if (event.key === 'Escape') setOpenNum(null)
  }

  return (
    // relative + overflow-hidden: лист позиционируется внутри макета секции,
    // а не по окну браузера — иначе в рамке макетной он вылезал бы на всю
    // страницу. На живой странице это была бы fixed-раскладка.
    <div className="relative overflow-hidden" onKeyDown={onKeyDown}>
      <SectionTitle />

      <ul className="mt-6 grid grid-cols-2 gap-2.5">
        {AUDIENCE.map((item, index) => (
          <li key={item.num}>
            <button
              type="button"
              onClick={() => setOpenNum(item.num)}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-white/12 bg-panel p-2.5 text-left transition-colors duration-150 active:bg-white/[.05]"
            >
              <span className="size-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-inset ring-white/10">
                <Photo card={item} className="h-full w-full" />
              </span>
              <span className="font-badge text-[11.5px] font-bold uppercase leading-tight tracking-[.04em] text-white/85">
                {SHORT_LABELS[index]}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11.5px] leading-[1.5] text-white/40">
        Нажмите на аудиторию — снизу откроется карточка.
      </p>

      <ProgramButton />

      {/* Затемнение. Оно же закрывает лист по нажатию мимо — но это не
          единственный способ: есть крестик и Esc. */}
      <button
        type="button"
        aria-label="Закрыть"
        tabIndex={card ? 0 : -1}
        onClick={() => setOpenNum(null)}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          card ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={card?.title ?? 'Карточка аудитории'}
        className={`absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-white/14 bg-panel2 transition-transform duration-300 [transition-timing-function:var(--ease-mass)] ${
          card ? 'translate-y-0' : 'pointer-events-none translate-y-full'
        }`}
      >
        {/* Полоска-ручка: без неё лист не читается как выдвижной. */}
        <span
          aria-hidden="true"
          className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-white/25"
        />
        {card && (
          <div className="p-4 pt-3">
            <div className="flex items-start gap-3.5">
              <span className="size-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-inset ring-white/10">
                <Photo card={card} className="h-full w-full" />
              </span>
              <h3 className="section-title flex-1 text-[16px] uppercase leading-[1.08] tracking-title">
                {card.title}
              </h3>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setOpenNum(null)}
                className="-m-2 flex size-11 items-center justify-center text-white/50 transition-colors duration-150 active:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="size-5"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-[12.5px] leading-[1.6] text-white/75">{card.detail}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Обвязка страницы ───────────────────────────────────────────────────── */

function Frame({
  n,
  name,
  why,
  tags,
  children,
}: {
  n: string
  name: string
  why: string
  tags: string[]
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[.02] p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-[13px] font-bold tracking-wide text-[#6AA0FF] tabular-nums">{n}</span>
        <h2 className="text-[20px] font-bold leading-none">{name}</h2>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] leading-none text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="mb-6 max-w-[72ch] text-[13.5px] leading-relaxed text-white/55">{why}</p>

      <div className="flex flex-wrap items-start gap-7">
        <Preview width={430} caption="430 px — проектная ширина">
          {children}
        </Preview>
        <Preview width={360} caption="360 px — узкий телефон">
          {children}
        </Preview>
      </div>
    </section>
  )
}

function Preview({
  width,
  caption,
  children,
}: {
  width: number
  caption: string
  children: ReactNode
}) {
  return (
    <div style={{ width }} className="shrink-0">
      <p className="mb-2 text-[11px] uppercase tracking-[.1em] text-white/35">{caption}</p>
      {/* Тот же фон и те же боковые поля, что у секции на живой странице. */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0c141d] px-5 py-8">
        {children}
      </div>
    </div>
  )
}
