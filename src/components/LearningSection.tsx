import type { CSSProperties } from 'react'
import { CATEGORIES, learningItem, pickLearning, type LearningCategory } from '../data/learning'
import { PROGRAM } from '../data/program'
import { PlayIcon } from './icons'

/**
 * Слайд 5 ТЗ «Как проходит обучение?» — одиннадцать фишек обучения.
 *
 * Подача «Кабинет» с макетной `/learning.html`, выбор владельца из трёх.
 * История выбора важна, потому что объясняет каждое решение ниже: первая
 * версия была лентой по разбивке ТЗ и прятала 8 пунктов из 11; вторая
 * развалилась на дашбордные плашки; третья была отвергнута словами «задумка
 * хорошая, но исполнение плохое». Принято на четвёртой, по прямому заданию:
 * «разобьём на категории основные действия — как проходит обучение, потом
 * что мы получаем бесплатно; обязательно выделить, что обучение идёт на
 * онлайн-площадке "Платформа"; используй разные цвета, но не надо туда
 * пихать футбольное поле».
 *
 * Отсюда устройство секции:
 *
 * **Платформа — герой, а не строка списка.** Она стоит первой, единственная
 * имеет свечение по краю и показывает саму себя: окно кабинета с тремя
 * настоящими модулями курса из `data/program.ts` и «24/7» из ТЗ. Свечением
 * больше нигде пользоваться нельзя, иначе выделение перестанет выделять.
 *
 * **Цвет кодирует категорию:** синий — как проходит обучение, мята — что
 * получаете бесплатно, золото — что остаётся после. Мята выбрана холодной,
 * чтобы карта доступа не выглядела кнопкой (зелёный на странице занят
 * `.btn-hero-turf`); золото на странице уже означает «сверх основного» —
 * им помечен бонусный модуль программы.
 *
 * **Цвета мало: у каждой категории своя форма.** Процесс — ступени с
 * номерами, бесплатное — карты с рамкой, итог — строки со значком. Пока
 * все три были одинаковыми строками, секция читалась стеной из одиннадцати
 * абзацев.
 *
 * **Ничего не спрятано** — ни свайпа, ни раскрытия. Это состав того, за что
 * человек платит, и высота секции около 1700px принята сознательно.
 *
 * Материал — язык страницы, а не дашборда: радиус 6px (см. комментарий к
 * `.btn-hero` в `index.css`), названия Bebas-капслоком в 21–28px, свет
 * волосяной линией и световой кромкой в 1px. Мягких карточек, радиальных
 * синих пятен и значков в квадратиках здесь нет намеренно.
 *
 * TODO (Q14): заказчик просил визуальный ряд. При делении на категории
 * нужно не 11 иллюстраций, а 3 — по одной на категорию.
 * TODO (Q15): NANOFOOTBALL и SCOUTWAY стоят без логотипов, слот под них —
 * заголовок карты, набранный Onest'ом.
 */

// Bebas инлайновым стилем, а не утилитой font-[...]: имя шрифта с пробелами
// Tailwind как arbitrary-значение не разбирает. Так же сделано в «Авторе
// обучения».
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

const MINT = '#3FE0B0'
const GOLD = '#FFC14A'

export function LearningSection() {
  const platform = learningItem('platform')
  const [process, free, after] = CATEGORIES

  return (
    <section
      id="learning"
      aria-labelledby="learning-title"
      // Своего фона у секции нет: под ней идёт та же тональная база
      // CourseBackdrop, что под «Программой», и на стыке двух секций она
      // теперь не гаснет (владелец: «фон стремится к чёрному, хотелось бы,
      // чтобы он продолжался с блока Программа обучения»). Свой сход в
      // bg-pitch секция рисует ниже, у своего низа.
      // z-10 обязателен — слой лежит на z-[3] поверх потока и непрозрачен.
      // Подъём вешается на саму секцию, а не на внутренний контейнер: та же
      // грабля, что в «Программе» и в «Авторе обучения».
      className="section-rhythm relative z-10 px-5"
    >
      {/* Собственного света у секции нет — и быть не должно. Пробовали: слой
          с радиальными пятнами внутри секции обрезается её верхним краем, и
          на стыке с «Программой» появлялась ступенька. Замер по пикселям
          скриншота на середине ширины: rgb(10,18,25) над границей против
          rgb(13,23,34) под ней, скачок яркости 16.4 → 21.3 в два пикселя.
          Свет этой части страницы живёт в общем слое CourseBackdrop, где он
          проходит сквозь обе секции и границы не знает. */}

      {/* Сход в bg-pitch отсюда снят и переехал в «Выбери свой тариф».
          Он должен рисоваться по низу **последней** секции страницы, иначе
          гасит фон на стыке двух — ровно это владелец и увидел, когда слой
          стоял у «Программы» («фон стремится к чёрному»). Теперь последняя
          секция — тарифы, слой уехал туда. Тональная база под этой секцией
          продолжается без разрыва: она живёт в общем CourseBackdrop. */}

      <h2 id="learning-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        Как проходит обучение?
      </h2>

      {/* ── Герой: платформа ─────────────────────────────────────────── */}
      <div
        className="relative mt-6 overflow-hidden rounded-[6px] border border-[#4C8DFF]/38 bg-[linear-gradient(168deg,#0F1C33_0%,#0A1220_54%,#070C14_100%)] p-4"
        style={{ boxShadow: '0 12px 34px rgba(30,91,255,.14)' }}
      >
        <LightEdge />
        <div className="flex items-center gap-3">
          <h3
            style={BEBAS}
            className="min-w-0 flex-1 text-[28px] uppercase leading-none tracking-[1px] text-white"
          >
            {platform.title}
          </h3>
          <span
            style={BEBAS}
            className="shrink-0 rounded-[4px] border border-[#6AA0FF]/50 bg-[#6AA0FF]/12 px-2 py-1 text-[17px] leading-none tracking-[1px] text-[#AECBFF]"
          >
            24/7
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-[1.5] text-white/60">{platform.text}</p>
        <div className="mt-3.5">
          <PlatformWindow />
        </div>
      </div>

      {/* ── Категория 1: процесс ─────────────────────────────────────────
          Ступени с номерами. Порядок настоящий, так это и проживается:
          с вами работают профессионалы → они отвечают на домашнее задание →
          вы строите тренировку в микрогруппе → выносите её на поле своей
          команды → разбираете результат с Гаджи Муслимовичем. Порядок ТЗ
          при этом не нарушен по составу, изменена только
          последовательность внутри категории. */}
      <CategoryLabel category={process} className="mt-8" />
      <ol className="mt-1">
        {pickLearning(...process.keys).map((item, i) => (
          <li key={item.key} className="relative border-b border-white/8 py-3.5 pl-9 last:border-b-0">
            <span
              aria-hidden="true"
              style={{ ...BEBAS, color: process.color }}
              className="absolute left-0 top-[15px] text-[19px] leading-none tracking-[1px] tabular-nums opacity-70"
            >
              {`0${i + 1}`}
            </span>
            <h3 style={BEBAS} className="text-[23px] uppercase leading-[.94] tracking-[1px] text-white">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-white/55">{item.text}</p>
          </li>
        ))}
      </ol>

      {/* ── Категория 2: бесплатные доступы ──────────────────────────────
          Единственные объекты секции с собственной рамкой: это
          единственное, что человеку физически выдают. */}
      <CategoryLabel category={free} className="mt-8" />
      <ul className="mt-2 flex flex-col gap-2">
        {pickLearning(...free.keys).map((item) => (
          <li
            key={item.key}
            className="relative overflow-hidden rounded-[6px] border px-4 py-3.5"
            style={{ borderColor: `${MINT}4D`, backgroundColor: 'rgba(63,224,176,.045)' }}
          >
            <LightEdge opacity={0.3} />
            <div className="flex items-center gap-2.5">
              {/* Название партнёра — Onest, а не Bebas: у логотипов этих
                  продуктов начертание своё, и здесь слот под них (Q15). */}
              <h3 className="min-w-0 flex-1 text-[20px] font-extrabold uppercase leading-none tracking-[.04em] text-white">
                {item.title}
              </h3>
              {/* Слово из самого ТЗ: «получите бесплатный доступ». */}
              <span
                className="shrink-0 rounded-[3px] px-1.5 py-1 text-[9px] uppercase leading-none tracking-[.12em]"
                style={{ color: MINT, backgroundColor: `${MINT}24` }}
              >
                бесплатно
              </span>
            </div>
            <p className="mt-2.5 text-[12px] leading-[1.5] text-white/60">{item.text}</p>
          </li>
        ))}
      </ul>

      {/* ── Категория 3: итог ────────────────────────────────────────────
          Компактнее процесса: это уже не действие, а то, что остаётся.
          Значок стоит в том же отступе, где у ступеней номер, — левый край
          колонки общий на всю секцию. */}
      <CategoryLabel category={after} className="mt-8" />
      <ul className="mt-1">
        {pickLearning(...after.keys).map((item) => (
          <li key={item.key} className="relative border-b border-white/8 py-3.5 pl-9 last:border-b-0">
            <item.icon
              aria-hidden="true"
              className="absolute left-0 top-[13px] size-[21px]"
              style={{ color: GOLD }}
            />
            <h3 style={BEBAS} className="text-[21px] uppercase leading-[.94] tracking-[1px] text-white">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-white/55">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Окно учебного кабинета. Платформа показывает саму себя, а не иллюстрацию:
 * в списке стоят настоящие модули курса из `data/program.ts`, то есть тот
 * же ТЗ. Ничего не выдумано.
 */
function PlatformWindow() {
  const modules = PROGRAM.slice(0, 3)

  return (
    <div
      className="relative overflow-hidden rounded-[6px] border border-white/12 bg-[#070c14]"
      style={{ boxShadow: 'inset 0 0 34px rgba(76,141,255,.14)' }}
    >
      <LightEdge opacity={0.28} />

      {/* Шапка окна. Точки не изображают браузер — они мельче и в один тон,
          это индикаторы окна. «24/7» здесь не повторяем: оно уже стоит в
          шапке блока крупно, и две одинаковые метки в сорока пикселях друг
          от друга читались сбоем. */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span aria-hidden="true" className="flex gap-1">
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="size-1.5 rounded-full bg-white/14" />
          <span className="size-1.5 rounded-full bg-white/10" />
        </span>
        <span aria-hidden="true" className="h-1 w-8 rounded-full bg-white/10" />
      </div>

      <ul className="px-3 py-2.5">
        {modules.map((module, i) => (
          <li key={module.title} className="flex items-center gap-2.5 py-1.5">
            <span
              aria-hidden="true"
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                i === 0
                  ? 'border-[#6AA0FF]/50 bg-[#6AA0FF]/14 text-[#9CC0FF]'
                  : 'border-white/14 text-white/34'
              }`}
            >
              <PlayIcon className="ml-px size-2.5" />
            </span>
            {/* truncate — обычное поведение интерфейса со списком длинных
                названий, а не сокращение текста ТЗ: полные названия модулей
                стоят этажом выше, в «Программе обучения». */}
            <span className="min-w-0 flex-1 truncate text-[11.5px] leading-none text-white/62">
              {module.title}
            </span>
            <span
              aria-hidden="true"
              style={BEBAS}
              className="shrink-0 text-[12px] leading-none tracking-[1px] text-white/24 tabular-nums"
            >
              {module.num ?? '—'}
            </span>
          </li>
        ))}
      </ul>

      {/* Полоса прохождения. Значение декоративное, поэтому без role и без
          цифры: обещать конкретный процент курса мы не можем. */}
      <div aria-hidden="true" className="px-3 pb-3">
        <div className="h-1 overflow-hidden rounded-full bg-white/8">
          <div className="h-full w-[38%] rounded-full bg-[linear-gradient(90deg,#4C8DFF,#8FC0FF)]" />
        </div>
      </div>
    </div>
  )
}

/** Световая кромка в 1px по верхней грани — приём кнопок первого экрана. */
function LightEdge({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{
        backgroundImage: `linear-gradient(90deg,transparent,rgba(255,255,255,${opacity}),transparent)`,
      }}
    />
  )
}

/**
 * Метка категории: точка в её цвете, название и волосяная линия до правого
 * края.
 *
 * TODO: названий категорий в ТЗ нет — это единственный текст на слайде не из
 * ТЗ, он ждёт согласования. Если решат снять, останутся линия и цвет: точка,
 * номер ступени и рамка карты различают категории и без подписи.
 */
function CategoryLabel({ category, className = '' }: { category: LearningCategory; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span
        className="text-[10.5px] uppercase leading-none tracking-[.18em]"
        style={{ color: category.color }}
      >
        {category.label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
    </div>
  )
}
