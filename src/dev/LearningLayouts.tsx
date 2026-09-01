import type { CSSProperties, ReactNode } from 'react'
import { CATEGORIES, learningItem, pickLearning, type LearningCategory } from '../data/learning'
import { PROGRAM } from '../data/program'
import { PlayIcon } from '../components/icons'

/**
 * Макетная слайда 5 «Как проходит обучение?»: три подачи. Отдельная точка
 * входа (learning.html → src/learning.tsx), в прод-сборку не попадает.
 *
 * ── Что заказано этим заходом ────────────────────────────────────────────
 * Владелец: «разобьём на категории основные действия — как проходит
 * обучение, потом что мы получаем бесплатно. Обязательно нужно выделить,
 * что обучение будет проходить на онлайн-площадке "Платформа". Используй
 * разные цвета, но не надо туда пихать футбольное поле».
 *
 * Отсюда три жёстких условия набора:
 *   1. **Платформа — герой секции, а не строка списка.** Она стоит первой,
 *      занимает больше всех и показывает саму себя: во всех трёх подачах
 *      есть окно с уроками, а «24/7» из ТЗ набрано крупно. Названия уроков
 *      в окне — настоящие модули из `data/program.ts` (тексты ТЗ), ничего
 *      выдуманного;
 *   2. **Цвет кодирует категорию.** Синий — как проходит обучение, мята —
 *      что получаете бесплатно, золото — что остаётся после. Цвет
 *      появляется в метке категории, в грани строки и в бейдже, чтобы
 *      принадлежность читалась без чтения;
 *   3. **Никакого газона и разметки.** Прошлая «тактическая доска» снята
 *      целиком.
 *
 * Что осталось от прошлых заходов, потому что было принято: деление на
 * смысловые категории (первое, что владелец назвал «хорошей задумкой») и
 * запрет на дашбордный материал — радиус 6px или ноль, названия Bebas'ом в
 * 20–28px, свет волосяной линией и кромкой в 1px, никаких значков в
 * квадратиках с мягкой заливкой.
 *
 * Категории и их состав:
 *   — герой: ОНЛАЙН-ПЛАТФОРМА;
 *   — как проходит обучение: команда, обратная связь, микрогруппы,
 *     практика, разборы тренировок. Порядок — как это проживается:
 *     с вами работают профессионалы → они дают развёрнутый ответ → вы
 *     строите тренировку в микрогруппе → выносите её на поле своей
 *     команды → разбираете результат вместе с Гаджи Муслимовичем;
 *   — что получаете бесплатно: NANOFOOTBALL, SCOUTWAY. Слово «бесплатно»
 *     не выдумано, оно в обоих текстах ТЗ;
 *   — что остаётся после: сертификат, портфолио, сообщество.
 *
 * Названия категорий — единственный текст не из ТЗ, их нужно согласовать.
 * Тексты пунктов дословные. Интерактива нет: прятать в этой секции нечего.
 */

// Bebas задаётся инлайновым стилем: имя шрифта с пробелами Tailwind как
// arbitrary-значение не разбирает (грабля с макетной /buttons.html).
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/* Цвета категорий живут в `data/learning.ts` вместе с их составом — макетная
   и боевая секция обязаны показывать одно и то же. Здесь только короткие
   псевдонимы под разметку вариантов. */
const [PROCESS_CAT, FREE_CAT, AFTER_CAT] = CATEGORIES

/**
 * Ключи категории без платформы.
 *
 * Все три подачи на этой странице строились вокруг платформы-героя: она
 * стоит отдельным блоком сверху. 01.09 владелец снял этот блок в боевой
 * секции, и в данных ключ 'platform' переехал первым в категорию «процесс».
 * Здесь он вычитается обратно — иначе на архивных подачах платформа
 * показывалась бы дважды: и героем, и строкой списка.
 */
const catKeys = (category: LearningCategory) => category.keys.filter((key) => key !== 'platform')
const BLUE = PROCESS_CAT.color
const MINT = FREE_CAT.color
const GOLD = AFTER_CAT.color

type Category = LearningCategory

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

export function LearningLayouts() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1500px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          «Как проходит обучение?» — категории и цвет
        </h1>
        <p className="mt-3 max-w-[80ch] text-[14px] leading-relaxed text-white/58">
          Платформа вынесена в герои блока: во всех трёх подачах она стоит первой, показывает окно с
          настоящими модулями курса и набранное крупно «24/7» из ТЗ. Категории закодированы цветом —
          синий «как проходит обучение», мята «что получаете бесплатно», золото «что остаётся после».
          Газон и разметка сняты целиком.
        </p>
        <p className="mt-2 max-w-[80ch] text-[13px] leading-relaxed text-white/40">
          Каждая подача на проектных 430&nbsp;px и на 360&nbsp;px. Названия категорий — единственный
          текст не из ТЗ, их нужно согласовать; тексты пунктов дословные. Оговорка: рамки — это
          блоки, а не окно браузера, медиазапросы по ширине вьюпорта внутри них не срабатывают.
        </p>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-10">
        <Frame
          n="01"
          name="Кабинет"
          why="У каждой категории своя форма, а не только свой цвет. Платформа — окно учебного кабинета с тремя модулями и полосой прохождения. Процесс — пять ступеней с номерами: порядок настоящий, так это и проживается за неделю. Бесплатные доступы — две мятные карты, единственные объекты секции с собственной рамкой, потому что это единственное, что вам физически выдают. Итог — три строки со значком золотом. За счёт разной формы одиннадцать пунктов не сливаются в стену, хотя тексты стоят целиком."
          tags={['окно кабинета', 'ступени с номерами', 'мятные карты доступа', 'золотой итог']}
        >
          <V1Cabinet />
        </Frame>

        <Frame
          n="02"
          name="Цветные полосы"
          why="Категория объявляется полосой во всю ширину: заливка в своём цвете и жирная грань слева. Между полосами текст лежит голым, без единой рамки — цвет работает разделителем, а не украшением плашек. Платформа получает синюю полосу и самый крупный объект секции: «24/7» набрано в 54px рядом с окном уроков. Самая плотная из трёх и самая заметная на быстрой прокрутке — три цветные полосы видно боковым зрением. Диагональная штриховка на полосах была и снята: в золоте она читалась сигнальной лентой."
          tags={['полосы-заголовки', '24/7 в 54px', 'без рамок', 'самая плотная']}
        >
          <V2Bands />
        </Frame>

        <Frame
          n="03"
          name="Маршрут"
          why="Через всю секцию идёт одна нить, и она меняет цвет на границах категорий: синий переходит в мяту, мята в золото. Пункты — узлы на этой нити. Смена цвета показывает, что обучение движется от процесса к тому, что выдают, и дальше к тому, что остаётся; такого не расскажет ни список, ни сетка. Платформа стоит крупным узлом в начале маршрута, с собственным окном. Самая повествовательная из трёх — буквально отвечает на вопрос в заголовке. Плата: нить забирает 36px слева на всю высоту секции, на 360px это десятая часть ширины."
          tags={['одна нить через секцию', 'цвет меняется по ходу', 'узлы', 'повествование']}
        >
          <V3Route />
        </Frame>
      </div>
    </div>
  )
}

/* ══ Герой: платформа ════════════════════════════════════════════════════
   Окно кабинета. Показывает саму себя: три настоящих модуля из программы,
   полоса прохождения у первого, «24/7» из ТЗ. Ничего не выдумано — тексты
   строк это `data/program.ts`, то есть тот же ТЗ. */

function PlatformWindow({ compact = false }: { compact?: boolean }) {
  const lessons = PROGRAM.slice(0, 3)

  return (
    <div
      className="relative overflow-hidden rounded-[6px] border border-white/12 bg-[#070c14]"
      style={{ boxShadow: `inset 0 0 34px rgba(76,141,255,.14)` }}
    >
      <LightEdge opacity={0.28} />

      {/* Шапка окна: слева три метки состояния, справа — «24/7». Точки не
          изображают браузер, они меньше и стоят в один тон: это индикаторы
          окна, а не кнопки Mac. */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span aria-hidden="true" className="flex gap-1">
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="size-1.5 rounded-full bg-white/14" />
          <span className="size-1.5 rounded-full bg-white/10" />
        </span>
        {/* «24/7» здесь не повторяем: оно уже стоит в шапке блока крупно, и
            две одинаковые метки в 40 пикселях друг от друга читались сбоем. */}
        <span aria-hidden="true" className="h-1 w-8 rounded-full bg-white/10" />
      </div>

      <ul className="px-3 py-2.5">
        {lessons.map((module, i) => (
          <li key={module.title} className="flex items-center gap-2.5 py-1.5">
            <span
              aria-hidden="true"
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                i === 0 ? 'border-[#6AA0FF]/50 bg-[#6AA0FF]/14 text-[#9CC0FF]' : 'border-white/14 text-white/34'
              }`}
            >
              <PlayIcon className="ml-px size-2.5" />
            </span>
            {/* truncate — обычное поведение интерфейса со списком длинных
                названий, а не сокращение текста ТЗ: полные названия стоят
                на слайде 4. */}
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
      {!compact && (
        <div aria-hidden="true" className="px-3 pb-3">
          <div className="h-1 overflow-hidden rounded-full bg-white/8">
            <div className="h-full w-[38%] rounded-full bg-[linear-gradient(90deg,#4C8DFF,#8FC0FF)]" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ══ 01. Кабинет ═════════════════════════════════════════════════════════
   Правки после первого просмотра отрисовки:
     — тело пункта ужато (11.5px, white/50) и оторвано по контрасту от
       названия (23px Bebas белым). До правки и то и другое читалось одним
       серым абзацем, и одиннадцать пунктов сливались в стену;
     — у каждой категории своя форма, а не только цвет: процесс — ступени с
       номерами, бесплатное — карты с рамкой, итог — компактные строки со
       значком. Раньше все три категории были одинаковыми строками, и цвет
       оставался единственным различием;
     — цветная грань у строк снята: тонкая линия слева отрывалась от текста
       и читалась артефактом. Категорию держат метка и номер в её цвете. */

function V1Cabinet() {
  const platform = learningItem('platform')
  const [process, free, after] = CATEGORIES

  return (
    <div>
      <SectionTitle />

      {/* Герой. Единственный блок секции со свечением по краю — больше им
          нигде пользоваться нельзя, иначе выделение перестанет выделять. */}
      <section
        className="relative mt-6 overflow-hidden rounded-[6px] border border-[#4C8DFF]/38 bg-[linear-gradient(168deg,#0F1C33_0%,#0A1220_54%,#070C14_100%)] p-4"
        style={{ boxShadow: '0 12px 34px rgba(30,91,255,.14)' }}
      >
        <LightEdge />
        <div className="flex items-center gap-3">
          <h3 style={BEBAS} className="min-w-0 flex-1 text-[28px] uppercase leading-none tracking-[1px] text-white">
            {platform.title}
          </h3>
          <span
            style={BEBAS}
            className="shrink-0 rounded-[4px] border border-[#6AA0FF]/50 bg-[#6AA0FF]/12 px-2 py-1 text-[17px] leading-none tracking-[1px] text-[#AECBFF]"
          >
            24/7
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-[1.5] text-white/58">{platform.text}</p>
        <div className="mt-3.5">
          <PlatformWindow />
        </div>
      </section>

      {/* Категория 1 — ступени. Номера дают ритм и показывают, что порядок
          здесь настоящий: с вами работают профессионалы → они отвечают на
          домашнее задание → вы строите тренировку в микрогруппе → выносите
          её на поле → разбираете результат с Гаджи Муслимовичем. */}
      <CategoryLabel category={process} className="mt-8" />
      <ol className="mt-1">
        {pickLearning(...catKeys(process)).map((item, i) => (
          <li key={item.key} className="relative border-b border-white/8 py-3.5 pl-9 last:border-b-0">
            <span
              aria-hidden="true"
              style={{ ...BEBAS, color: `${process.color}` }}
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

      {/* Категория 2 — единственные объекты секции с собственной рамкой:
          это единственное, что человеку физически выдают. */}
      <CategoryLabel category={free} className="mt-8" />
      <ul className="mt-2 flex flex-col gap-2">
        {pickLearning(...catKeys(free)).map((item) => (
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

      {/* Категория 3 — компактнее процесса: это уже не действие, а то, что
          лежит в кармане после. Значок вынесен в тот же отступ, где у
          ступеней стоял номер, — левый край колонки общий на всю секцию. */}
      <CategoryLabel category={after} className="mt-8" />
      <ul className="mt-1">
        {pickLearning(...catKeys(after)).map((item) => (
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
    </div>
  )
}

/* ══ 02. Цветные полосы ══════════════════════════════════════════════════ */

function V2Bands() {
  const platform = learningItem('platform')

  return (
    <div>
      <SectionTitle />

      {/* Полоса платформы. Она же самый крупный объект секции: «24/7» из ТЗ
          набрано в 54px и стоит рядом с окном, а не внутри него — цифра
          должна читаться раньше интерфейса. */}
      <Band color="#4C8DFF" label="Обучение идёт на платформе" className="mt-6" />
      <div className="mt-3">
        <h3 style={BEBAS} className="text-[27px] uppercase leading-none tracking-[1px] text-white">
          {platform.title}
        </h3>
        <div className="mt-2.5 flex items-start gap-3.5">
          <span
            style={BEBAS}
            className="shrink-0 text-[54px] leading-[.8] tracking-[1px] text-[#4C8DFF]"
          >
            24/7
          </span>
          <p className="min-w-0 flex-1 text-[12.5px] leading-[1.5] text-white/64">{platform.text}</p>
        </div>
        <div className="mt-3.5">
          <PlatformWindow compact />
        </div>
      </div>

      {CATEGORIES.map((category) => (
        <section key={category.id}>
          <Band color={category.color} label={category.label} className="mt-8" />

          <ul className="mt-1">
            {pickLearning(...catKeys(category)).map((item) => (
              <li key={item.key} className="border-b border-white/8 py-3.5 last:border-b-0">
                <div className="flex items-baseline gap-2.5">
                  <h3
                    style={item.partner ? undefined : BEBAS}
                    className={
                      item.partner
                        ? 'min-w-0 flex-1 text-[19px] font-extrabold uppercase leading-none tracking-[.05em] text-white'
                        : 'min-w-0 flex-1 text-[23px] uppercase leading-[.94] tracking-[1px] text-white'
                    }
                  >
                    {item.title}
                  </h3>
                  {item.partner && (
                    <span
                      className="shrink-0 text-[9px] uppercase leading-none tracking-[.12em]"
                      style={{ color: category.color }}
                    >
                      бесплатно
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[12px] leading-[1.5] text-white/55">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/**
 * Полоса-заголовок категории: заливка своего цвета, диагональная штриховка
 * тем же цветом и жирная грань слева. Штриховка под 115° — тот же угол, что
 * у полос газонокосилки на кнопках, только здесь она в цвете категории и по
 * плашке высотой 34px не успевает начать повторяться.
 */
function Band({ color, label, className = '' }: { color: string; label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center overflow-hidden rounded-[4px] px-3 py-2.5 ${className}`}
      style={{
        borderLeft: `3px solid ${color}`,
        backgroundImage: `linear-gradient(90deg,${color}26,${color}05)`,
      }}
    >
      <span className="text-[10.5px] uppercase leading-none tracking-[.18em]" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

/* ══ 03. Маршрут ═════════════════════════════════════════════════════════ */

function V3Route() {
  const platform = learningItem('platform')

  return (
    <div>
      <SectionTitle />

      {/* Начало маршрута — платформа. Узел крупнее прочих и в собственной
          рамке: маршрут начинается там, где человек открывает уроки. */}
      <div className="relative mt-6 pl-9">
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-px"
          style={{ background: `linear-gradient(180deg,transparent 0,${BLUE} 22px,${BLUE} 100%)` }}
        />
        <span
          aria-hidden="true"
          className="absolute left-[-11px] top-1 flex size-6 items-center justify-center rounded-full border bg-[#070d16]"
          style={{ borderColor: `${BLUE}88` }}
        >
          <PlayIcon className="ml-px size-2.5" style={{ color: BLUE }} />
        </span>

        <h3 style={BEBAS} className="text-[27px] uppercase leading-none tracking-[1px] text-white">
          {platform.title}
        </h3>
        <p className="mt-2 text-[12.5px] leading-[1.5] text-white/64">{platform.text}</p>
        <div className="mt-3">
          <PlatformWindow compact />
        </div>
      </div>

      {CATEGORIES.map((category, ci) => {
        const items = pickLearning(...catKeys(category))
        const next = CATEGORIES[ci + 1]

        return (
          <div key={category.id} className="relative pl-9">
            {/* Сегмент нити этой категории. У последней он гаснет в
                прозрачность — маршрут кончается, а не обрывается. У
                остальных на стыке переходит в цвет следующей категории:
                смена цвета и есть граница. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px"
              style={{
                background: next
                  ? `linear-gradient(180deg,${category.color} 0,${category.color} calc(100% - 26px),${next.color} 100%)`
                  : `linear-gradient(180deg,${category.color} 0,${category.color} calc(100% - 34px),transparent 100%)`,
              }}
            />

            {/* Метка категории сидит на нити — она объявляет отрезок пути. */}
            <div className="relative pb-1 pt-6">
              {/* Узел метки сидит на нити (левый край колонки -36px), а не
                  под первой буквой подписи: при left-[-5px] точка ложилась
                  прямо на «Ч» в «ЧТО ПОЛУЧАЕТЕ БЕСПЛАТНО». */}
              <span
                aria-hidden="true"
                className="absolute left-[-40px] top-[25px] size-2.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span
                className="text-[10.5px] uppercase leading-none tracking-[.18em]"
                style={{ color: category.color }}
              >
                {category.label}
              </span>
            </div>

            <ul>
              {items.map((item) => (
                <li key={item.key} className="relative py-3.5">
                  <span
                    aria-hidden="true"
                    className="absolute left-[-40px] top-[19px] size-2 rounded-full border bg-[#05080b]"
                    style={{ borderColor: category.color }}
                  />
                  <div className="flex items-baseline gap-2.5">
                    <h3
                      style={item.partner ? undefined : BEBAS}
                      className={
                        item.partner
                          ? 'min-w-0 flex-1 text-[19px] font-extrabold uppercase leading-none tracking-[.05em] text-white'
                          : 'min-w-0 flex-1 text-[22px] uppercase leading-[.94] tracking-[1px] text-white'
                      }
                    >
                      {item.title}
                    </h3>
                    {item.partner && (
                      <span
                        className="shrink-0 rounded-[3px] px-1.5 py-1 text-[9px] uppercase leading-none tracking-[.12em]"
                        style={{ color: category.color, backgroundColor: `${category.color}1F` }}
                      >
                        бесплатно
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[12px] leading-[1.5] text-white/55">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

/* ══ Общее ═══════════════════════════════════════════════════════════════ */

function SectionTitle() {
  return (
    <h2 className="section-title text-[32px] uppercase leading-[.94] tracking-title">
      Как проходит обучение?
    </h2>
  )
}

/**
 * Метка категории: точка в цвете, название и волосяная линия до правого
 * края. Названия категорий в ТЗ отсутствуют — если владелец решит их снять,
 * останется линия, а цвет граней продолжит различать категории.
 */
function CategoryLabel({ category, className = '' }: { category: Category; className?: string }) {
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
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#05080b] px-5 py-8">
        {children}
      </div>
    </div>
  )
}
