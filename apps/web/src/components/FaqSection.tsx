import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { FAQ, FAQ_TITLE } from '../data/faq'

/**
 * Слайд 8 ТЗ «Часто задаваемые вопросы» — семь вопросов аккордеоном.
 *
 * Подача 03 «Крупная полоса» с макетной `/faq.html`, выбор владельца из трёх
 * (отклонены «Строки» и «Плашки» — они остались на макетной).
 *
 * ── Что задано ТЗ ────────────────────────────────────────────────────────
 * «вопрос делаем видимым, ответ нужно, чтобы раскрывался, если человек
 * нажмет на +». То есть аккордеон, и знак именно плюс, а не стрелка.
 * Механику не переизобретаем, тексты — дословно из `data/faq.ts`.
 *
 * ── Устройство подачи ────────────────────────────────────────────────────
 * Вопрос набран Bebas-капслоком 17px — тем же шрифтом, что заголовки секций
 * и регалии «Автора обучения». Рамок нет вовсе, разделители — волосяные
 * линии, у раскрытого вопроса слева стоит цветная нить: она метит место,
 * где человек читает, и связывает вопрос с ответом без коробки вокруг них.
 *
 * Плюс здесь без кружка и крупнее (26px): в этой подаче он часть типографики
 * строки, а не отдельный контрол — кружок рядом с капслоком читался бы
 * кнопкой, положенной поверх текста. Минусом он становится схлопыванием
 * вертикального штриха, а не подменой иконки: две иконки на одно состояние
 * всегда расходятся в толщине и центровке.
 *
 * Открыт всегда ровно один вопрос, первый — сразу. Так же сделано в
 * «Программе», и приём там одобрен: все семь закрытыми — это семь строк, по
 * которым не понять, что внутри есть ответы.
 *
 * Номеров у вопросов нет намеренно. В «Программе» номер несёт порядок:
 * модули идут подряд и человек проходит их один за другим. Вопросы порядка
 * не образуют — сюда приходят за одним своим, — а нумерация обещала бы
 * последовательность, которой нет. Тот же довод снял точку на черте регалий.
 *
 * ── Как секция сидит на фоне страницы ────────────────────────────────────
 * Своего фона у секции нет: под ней та же тональная база `CourseBackdrop`,
 * что под «Программой», «Как проходит обучение» и тарифами. `z-10` стоит на
 * самой секции, а не на внутреннем контейнере, — грабля, на которую в этом
 * проекте наступали четыре раза: слой фона лежит на `z-[3]` поверх потока и
 * непрозрачен.
 *
 * Сход в `bg-pitch` снова здесь. Он всегда у последней секции страницы,
 * иначе гасит фон на стыке двух: 01.09 слой уезжал в «Финальную цитату» и
 * вернулся вместе с тем, что владелец снял ту секцию со страницы. Так он
 * уже переезжал из «Программы» в «Как проходит обучение», а оттуда в тарифы.
 *
 * TODO (Q23): в ответе про обратную связь обещана живая встреча в ВИП, а
 * заказчик сам спрашивает, не убрать ли её вовсе. Правится парой с составом
 * тарифов — текст лежит в `data/faq.ts` с флагом `pending`.
 */

// Bebas инлайновым стилем, а не утилитой font-[...]: имя шрифта с пробелами
// Tailwind как arbitrary-значение не разбирает. Так же сделано в «Авторе
// обучения», «Как проходит обучение» и тарифах.
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/** Синий акцент страницы. */
const ACCENT = '#6AA0FF'

export function FaqSection() {
  // Открыт ровно один вопрос; повторное нажатие закрывает его.
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="section-rhythm relative z-10 px-5"
    >
      {/* Сход в bg-pitch перед подвалом — у последней секции страницы. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(5,8,11,.55)_58%,#05080b_100%)]"
      />

      <h2 id="faq-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        {FAQ_TITLE}
      </h2>

      <ul className="mt-7 flex flex-col">
        {FAQ.map((item, i) => {
          const isOpen = open === i
          return (
            <li key={item.id} className="relative">
              {/* Нить слева. Ширина 2px, а не 1: волосяная линия рядом с
                  капслоком 17px читается царапиной. Тянется на всю высоту
                  строки вместе с раскрытым ответом и гаснет книзу. */}
              <span
                aria-hidden="true"
                style={{
                  backgroundImage: `linear-gradient(180deg,${ACCENT} 0%,${ACCENT}66 62%,transparent 100%)`,
                  opacity: isOpen ? 1 : 0,
                }}
                className="absolute inset-y-2 left-0 w-[2px] rounded-full transition-opacity duration-300"
              />

              {/* Раскрытый вопрос отъезжает от нити на её ширину с зазором.
                  Анимируется padding, а не margin: у соседей по списку
                  ничего не сдвигается. */}
              <div className={`transition-[padding] duration-300 ${isOpen ? 'pl-3.5' : 'pl-0'}`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  // min-h 56 — тач-цель; у длинного вопроса строка и так выше.
                  className="flex min-h-[56px] w-full items-start gap-3 py-3.5 text-left"
                >
                  <span
                    style={{
                      ...BEBAS,
                      color: isOpen ? '#EAF2FF' : 'rgba(255,255,255,.82)',
                      // Трекинг Bebas — только целым пикселем, в em шрифт
                      // замыливается. Та же величина, что у --tracking-title.
                      letterSpacing: '1px',
                    }}
                    className="min-w-0 flex-1 text-[17px] uppercase leading-[1.06] transition-colors duration-300"
                  >
                    {item.question}
                  </span>
                  <PlusMark open={isOpen} />
                </button>

                <Panel id={`faq-panel-${item.id}`} open={isOpen}>
                  {/* Отступ справа равен ширине знака с зазором: ответ не
                      подлезает под плюс и колонка текста остаётся одной. */}
                  <p className="pb-4 pr-9 text-[13px] leading-[1.58] text-white/68">{item.answer}</p>
                </Panel>
              </div>

              {/* Волосяная линия — только между вопросами, у последнего её
                  нет: секция кончается воздухом, а не чертой. Тем более что
                  сразу под ней страница гаснет в подвал. */}
              {i < FAQ.length - 1 && <span aria-hidden="true" className="block h-px bg-white/[.07]" />}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * Раскрывающаяся часть: высота анимируется по замеренной величине.
 *
 * Замер, а не `max-height` с запасом: с запасом анимация половину времени
 * идёт по пустоте, и раскрытие кажется вялым. И не `grid-template-rows:
 * 0fr → 1fr`: переход работает не во всех вебвью, в остальных список
 * выпрыгивает без анимации. Тот же приём, что у панели уроков в «Программе».
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
    // Высота меняется при повороте экрана и при подгрузке шрифта — отсюда
    // наблюдатель, а не разовый замер.
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
          выглядит выдавленным из строки. При закрытии задержки нет —
          гаснуть медленно нечему. */}
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

/** Знак «плюс» из ТЗ: минусом становится схлопыванием вертикального штриха. */
function PlusMark({ open }: { open: boolean }) {
  const color = open ? ACCENT : '#8FA6C4'
  return (
    <span
      aria-hidden="true"
      // mt-px сажает знак на середину прописной первой строки: строка 18px,
      // знак 26px.
      className="relative mt-px flex size-[26px] shrink-0 items-center justify-center"
    >
      <span
        style={{ backgroundColor: color }}
        className="absolute h-px w-[11.5px] rounded-full transition-colors duration-300"
      />
      <span
        style={{ backgroundColor: color }}
        className={`absolute h-[11.5px] w-px rounded-full transition-[transform,background-color] duration-300 ${
          open ? 'scale-y-0' : ''
        }`}
      />
    </span>
  )
}
