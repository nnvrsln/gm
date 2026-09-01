import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { FAQ, FAQ_TITLE } from '../data/faq'

/**
 * Макетная слайда 8 «Часто задаваемые вопросы»: три подачи. Отдельная точка
 * входа (faq.html → src/faq.tsx), в прод-сборку не попадает.
 *
 * ── Что задано ТЗ и не обсуждается ───────────────────────────────────────
 *   1. Заголовок «ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ»;
 *   2. «вопрос делаем видимым, ответ нужно, чтобы раскрывался, если человек
 *      нажмет на +» — то есть аккордеон и знак именно плюс, а не стрелка.
 *      Во всех трёх подачах плюс на месте и превращается в минус;
 *   3. семь вопросов и семь ответов дословно, ни одного лишнего слова.
 *
 * Механика у всех трёх одна, различается только материал: подачи отвечают
 * на вопрос «чем эта секция должна быть на странице» — тихим справочником,
 * продолжением «Программы» или отдельной крупной полосой.
 *
 * ── Решения, общие для всех трёх ─────────────────────────────────────────
 *
 * **Открыт всегда ровно один вопрос, первый — сразу.** Так же сделано в
 * «Программе», и приём там одобрен. Все семь закрытыми — это семь строк, по
 * которым не понять, что внутри вообще есть ответы; два раскрытых рядом на
 * 430px дают сплошную простыню. Переключить на «сколько угодно открытых» —
 * одна строка в `useAccordion`.
 *
 * **Номеров у вопросов нет.** В «Программе» номер модуля несёт порядок:
 * модули идут один за другим и человек проходит их подряд. Вопросы порядка
 * не образуют — сюда приходят за одним своим, а нумерация обещает
 * последовательность, которой нет. Тот же довод, по которому со слайда 3
 * убрали точку на хронологической черте.
 *
 * **Высота раскрытия анимируется по замеру `ResizeObserver`.** Тот же
 * приём, что в «Программе»: `grid-template-rows: 0fr → 1fr` работает не во
 * всех вебвью, а `max-height` с запасом половину времени идёт по пустоте.
 *
 * TODO (Q23): в ответе 3 обещана живая встреча в ВИП, а заказчик сам
 * спрашивает, не убрать ли её вовсе. Правится парой с составом тарифов.
 */

// Bebas инлайновым стилем: имя шрифта с пробелами Tailwind как
// arbitrary-значение не разбирает. Та же грабля во всех макетных.
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/** Синий акцент страницы. */
const ACCENT = '#6AA0FF'

/** Открыт ровно один вопрос; повторное нажатие закрывает его. */
function useAccordion(initial: number | null = 0) {
  const [open, setOpen] = useState<number | null>(initial)
  return {
    isOpen: (i: number) => open === i,
    toggle: (i: number) => setOpen(open === i ? null : i),
  }
}

/**
 * Раскрывающаяся часть: высота анимируется по замеренной величине.
 *
 * До первого замера перехода нет — иначе первый вопрос проигрывал бы
 * раскрытие прямо на загрузке страницы, как глюк.
 */
function Panel({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [measured, setMeasured] = useState(false)

  useEffect(() => {
    const el = inner.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
      setMeasured(true)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      id={id}
      aria-hidden={!open}
      style={{ height: open ? height : 0 }}
      className={`overflow-hidden motion-reduce:transition-none ${
        measured ? 'transition-[height] duration-[340ms] ease-[var(--ease-mass)]' : ''
      }`}
    >
      {/* Текст всплывает следом за высотой: иначе он виден с первого кадра и
          выглядит выдавленным из строки. При закрытии задержки нет. */}
      <div
        ref={inner}
        className={`transition-opacity duration-300 ease-[var(--ease-mass)] motion-reduce:transition-none ${
          open ? 'opacity-100 delay-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Знак «плюс» из ТЗ. Минусом становится схлопыванием вертикального штриха,
 * а не подменой иконки: две иконки на одно состояние всегда расходятся в
 * толщине и центровке.
 */
function PlusMark({
  open,
  circle = true,
  size = 24,
  color = ACCENT,
}: {
  open: boolean
  circle?: boolean
  size?: number
  color?: string
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderColor: circle ? (open ? `${color}99` : 'rgba(255,255,255,.16)') : 'transparent',
        backgroundColor: circle && open ? `${color}24` : 'transparent',
      }}
      className={`relative flex shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
        circle ? 'border' : ''
      }`}
    >
      <span style={{ width: size * 0.44, backgroundColor: color }} className="absolute h-px rounded-full" />
      <span
        style={{ height: size * 0.44, backgroundColor: color }}
        className={`absolute w-px rounded-full transition-transform duration-300 ${open ? 'scale-y-0' : ''}`}
      />
    </span>
  )
}

/** Заголовок секции — общий для всех трёх подач, дословно из ТЗ. */
function Title() {
  return <h2 className="section-title text-[32px] uppercase leading-[.94] tracking-title">{FAQ_TITLE}</h2>
}

/* ─────────────────────────────────────────────────────────────────────────
   01. Строки
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Тихий справочник: ни плашек, ни рамок — только волосяные линии между
 * вопросами и плюс справа. Секция стоит в самом низу страницы, после
 * тарифов, и её задача снять последние сомнения, а не продавать ещё раз.
 */
function V1Rows() {
  const acc = useAccordion()

  return (
    <section className="relative">
      <Title />

      <ul className="mt-6 border-t border-white/[.09]">
        {FAQ.map((item, i) => (
          <li key={item.id} className="border-b border-white/[.09]">
            <button
              type="button"
              onClick={() => acc.toggle(i)}
              aria-expanded={acc.isOpen(i)}
              aria-controls={`v1-${item.id}`}
              // min-h 56 — тач-цель по правилам мобильных приложений; у
              // длинного вопроса строка и так выше.
              className="flex min-h-[56px] w-full items-start gap-3 py-[15px] text-left"
            >
              <span
                style={{ color: acc.isOpen(i) ? '#D6E4FF' : 'rgba(255,255,255,.86)' }}
                className="min-w-0 flex-1 text-[14px] font-medium leading-[1.36] transition-colors duration-300"
              >
                {item.question}
              </span>
              <PlusMark open={acc.isOpen(i)} />
            </button>

            {/* Отступ справа равен ширине плюса с зазором: ответ не
                подлезает под знак и колонка текста остаётся одной. */}
            <Panel id={`v1-${item.id}`} open={acc.isOpen(i)}>
              <p className="pb-[18px] pr-9 text-[12.5px] leading-[1.55] text-white/64">{item.answer}</p>
            </Panel>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   02. Плашки
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Тот же материал, что у карточек «Программы»: градиентная подложка,
 * рамка, отсвет слева, у раскрытой — синий ореол. Страница читается одной
 * системой: два раскрывающихся блока выглядят одинаково и работают
 * одинаково.
 *
 * Плата: секция получает вес, которого у справочного блока в конце
 * страницы может и не быть — семь плашек подряд после трёх тарифных
 * карточек это ещё одна стопка панелей.
 */
function V2Cards() {
  const acc = useAccordion()

  return (
    <section className="relative">
      <Title />

      <ul className="mt-6 flex flex-col gap-2.5">
        {FAQ.map((item, i) => {
          const open = acc.isOpen(i)
          return (
            <li
              key={item.id}
              style={{
                borderColor: open ? `${ACCENT}57` : 'rgba(255,255,255,.1)',
                // Ореол только у раскрытой: он метит место, где человек
                // сейчас читает, а не украшает семь плашек разом.
                boxShadow: open ? `0 0 0 1px ${ACCENT}1F, 0 10px 30px rgba(30,91,255,.16)` : 'none',
              }}
              className="overflow-hidden rounded-[14px] border transition-colors duration-300"
            >
              <button
                type="button"
                onClick={() => acc.toggle(i)}
                aria-expanded={open}
                aria-controls={`v2-${item.id}`}
                className="relative flex min-h-[60px] w-full items-center gap-3 overflow-hidden px-3.5 py-3 text-left"
              >
                {/* База плашки: раскрытая светлеет — состояние читается ещё
                    до взгляда на плюс. Рисунок градиента тот же, что у
                    карточки модуля в «Программе». */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 z-0 transition-colors duration-300 ${
                    open
                      ? 'bg-[linear-gradient(104deg,rgba(22,38,62,.96)_0%,rgba(12,20,32,.94)_58%,rgba(9,15,24,.94)_100%)]'
                      : 'bg-[linear-gradient(104deg,rgba(16,26,40,.9)_0%,rgba(10,16,25,.9)_58%,rgba(8,13,20,.9)_100%)]'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 z-0 bg-[radial-gradient(58%_120%_at_2%_50%,rgba(30,91,255,.22)_0%,rgba(30,91,255,.07)_44%,transparent_76%)]"
                />

                <span className="relative z-10 min-w-0 flex-1 text-[13.5px] font-medium leading-[1.34] text-white/90">
                  {item.question}
                </span>
                <span className="relative z-10">
                  <PlusMark open={open} />
                </span>
              </button>

              <Panel id={`v2-${item.id}`} open={open}>
                <div className="border-t border-white/[.07] bg-[rgba(6,10,16,.72)] px-3.5 py-3.5">
                  <p className="text-[12.5px] leading-[1.55] text-white/72">{item.answer}</p>
                </div>
              </Panel>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   03. Крупная полоса
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Вопрос набран тем же Bebas-капслоком, что заголовки и регалии, и стоит
 * крупно; разделителей почти нет, вместо них — воздух. Раскрытый вопрос
 * получает слева цветную нить вдоль всего блока: она и метит место, и
 * связывает вопрос с ответом без рамки вокруг них.
 *
 * Плата: третий вопрос в 129 знаков капслоком занимает три строки на 430 и
 * четыре на 360 — это самый длинный текст секции, и в крупном кегле его
 * длина видна как таковая. Высоту секции это не раздувает: 555px на 430
 * против 566 у подачи 01 — крупный кегль забирает ширину, а не высоту,
 * потому что Bebas узкий.
 */
function V3Display() {
  const acc = useAccordion()

  return (
    <section className="relative">
      <Title />

      <ul className="mt-7 flex flex-col">
        {FAQ.map((item, i) => {
          const open = acc.isOpen(i)
          return (
            <li key={item.id} className="relative">
              {/* Нить слева. Ширина 2px, а не 1: волосяная линия рядом с
                  капслоком 17px читается царапиной. Тянется на всю высоту
                  строки вместе с раскрытым ответом. */}
              <span
                aria-hidden="true"
                style={{
                  backgroundImage: `linear-gradient(180deg,${ACCENT} 0%,${ACCENT}66 62%,transparent 100%)`,
                  opacity: open ? 1 : 0,
                }}
                className="absolute inset-y-2 left-0 w-[2px] rounded-full transition-opacity duration-300"
              />

              <div className={`transition-[padding] duration-300 ${open ? 'pl-3.5' : 'pl-0'}`}>
                <button
                  type="button"
                  onClick={() => acc.toggle(i)}
                  aria-expanded={open}
                  aria-controls={`v3-${item.id}`}
                  className="flex min-h-[56px] w-full items-start gap-3 py-3.5 text-left"
                >
                  <span
                    style={{
                      ...BEBAS,
                      color: open ? '#EAF2FF' : 'rgba(255,255,255,.82)',
                      letterSpacing: '1px',
                    }}
                    className="min-w-0 flex-1 text-[17px] uppercase leading-[1.06] transition-colors duration-300"
                  >
                    {item.question}
                  </span>
                  {/* Знак без круга и крупнее: в этой подаче он часть
                      типографики строки, а не отдельный контрол. Кружок
                      рядом с капслоком читался бы кнопкой поверх текста. */}
                  <span className="mt-px">
                    <PlusMark open={open} circle={false} size={26} color={open ? ACCENT : '#8FA6C4'} />
                  </span>
                </button>

                <Panel id={`v3-${item.id}`} open={open}>
                  <p className="pb-4 pr-9 text-[13px] leading-[1.58] text-white/68">{item.answer}</p>
                </Panel>
              </div>

              {/* Волосяная линия — только между вопросами, у последнего её
                  нет: секция кончается воздухом, а не чертой. */}
              {i < FAQ.length - 1 && <span aria-hidden="true" className="block h-px bg-white/[.07]" />}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Оболочка макетной
   ───────────────────────────────────────────────────────────────────────── */

export function FaqLayouts() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1500px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          «Часто задаваемые вопросы» — три подачи
        </h1>
        <p className="mt-3 max-w-[80ch] text-[14px] leading-relaxed text-white/58">
          ТЗ задаёт механику целиком: «вопрос делаем видимым, ответ нужно, чтобы раскрывался, если
          человек нажмет на +». Спорить тут не о чем — во всех трёх подачах аккордеон и знак плюс,
          который превращается в минус. Различается материал: 01 — тихий справочник на волосяных
          линиях, 02 — те же плашки, что у карточек «Программы», 03 — крупная полоса на Bebas с
          цветной нитью у раскрытого вопроса.
        </p>
        <p className="mt-2 max-w-[80ch] text-[13px] leading-relaxed text-white/40">
          Во всех трёх: семь вопросов дословно из ТЗ, открыт всегда ровно один (первый — сразу),
          номеров у вопросов нет. Каждая подача на проектных 430&nbsp;px и на 360&nbsp;px. Оговорка:
          рамки — это блоки, а не окно браузера, медиазапросы по ширине вьюпорта внутри них не
          срабатывают.
        </p>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-10">
        <Frame
          n="01"
          name="Строки"
          why="Ни рамок, ни плашек — вопросы разделены волосяными линиями, справа плюс в кружке. Секция стоит последней на странице, сразу после тарифов, и её работа — снять оставшиеся сомнения, а не продать ещё раз. Тихий справочник делает это лучше всего: семь строк читаются списком за один взгляд, и глаз находит свой вопрос быстрее, чем в стопке панелей. Замер высоты секции с одним раскрытым ответом: 566px на 430 и 627 на 360 — вровень с подачей 03 и почти на сотню ниже плашек. Плата: секция не заявляет о себе — если FAQ должен быть на странице заметен, это не она."
          tags={['волосяные линии', 'плюс в кружке', 'ничего не весит']}
        >
          <V1Rows />
        </Frame>

        <Frame
          n="02"
          name="Плашки"
          why="Тот же материал, что у карточек «Программы»: градиентная подложка, рамка, отсвет слева из-под края, у раскрытой — синий ореол и посветлевший фон. Два раскрывающихся блока на странице выглядят одинаково и работают одинаково — человек, открывавший модули программы, уже знает, что делать здесь. Ответ лежит на своей тёмной подложке, отделённый линией, как список уроков в модуле. Плата: вес. Семь панелей подряд сразу после трёх тарифных карточек — это ещё одна стопка того же рода, а FAQ в конце страницы по смыслу тише тарифов. И она же самая высокая из трёх: 652px на 430 против 566 и 555 у соседей, на 360 — 683 против 627 и 632."
          tags={['материал «Программы»', 'ореол у раскрытой', 'узнаваемо', 'самая высокая']}
        >
          <V2Cards />
        </Frame>

        <Frame
          n="03"
          name="Крупная полоса"
          why="Вопрос набран Bebas-капслоком в 17px — тем же шрифтом, что заголовки секций и регалии «Автора обучения», — и стоит крупно. Разделители почти не участвуют, работу берут воздух и цветная нить слева у раскрытого вопроса: она метит место, где человек читает, и связывает вопрос с ответом без рамки вокруг них. Единственная подача, где вопрос звучит вопросом человека, а не строкой таблицы. Плата: третий вопрос в 129 знаков занимает капслоком три строки на 430 и четыре на 360, и в крупном кегле его длина видна. По высоте при этом не проигрывает: 555px на 430 и 632 на 360 — то же, что у подачи 01."
          tags={['Bebas капслоком', 'нить у раскрытого', 'плюс без кружка']}
        >
          <V3Display />
        </Frame>
      </div>
    </div>
  )
}

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
      <p className="mb-6 max-w-[80ch] text-[13.5px] leading-relaxed text-white/55">{why}</p>

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

function Preview({ width, caption, children }: { width: number; caption: string; children: ReactNode }) {
  return (
    <div style={{ width }} className="shrink-0">
      <p className="mb-2 text-[11px] uppercase tracking-[.1em] text-white/35">{caption}</p>
      {/* Тот же фон и те же боковые поля, что у секции на живой странице. */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#05080b] px-5 py-8">{children}</div>
    </div>
  )
}
