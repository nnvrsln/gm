import { useEffect, useRef, useState } from 'react'
import { PROGRAM, type ProgramModule } from '../data/program'
import { ArrowRightIcon } from './icons'

/**
 * Слайд 4 ТЗ «Программа обучения» — аккордеон на шесть блоков.
 *
 * Аккордеон одобрен заказчиком дословно («мне очень понравилось, что ты
 * сделал это все дело раскрывающимися списками»), поэтому раскладку не
 * переизобретаем — меняется только содержимое и состояния.
 *
 * Формат блока задан ТЗ и держится ровно в этом порядке:
 *   1. номер и название модуля — видны всегда;
 *   2. уроки — раскрываются по нажатию;
 *   3. результат («Вы сможете …») — виден всегда, не прячется под кнопку.
 * Отсюда главное отличие от прежней версии: результат лежит ниже панели
 * раскрытия, а не внутри неё, и закрытая карточка всё равно отвечает на
 * вопрос «что я получу».
 *
 * С 03.09.2026 уроки есть у всех шести блоков — раскрываются все. Незакрытым
 * остался результат модуля 4: в документе там «утверждается». Оба пустых
 * состояния секция обрабатывает одинаковой строкой (Q13) — «Программа модуля
 * утверждается», если нет уроков, и «Результат модуля утверждается», если
 * нет результата. Ветка про отсутствие уроков сейчас не срабатывает ни на
 * одном блоке, но остаётся: заказчик правит программу по частям, и она уже
 * дважды была нужна.
 *
 * Открыт всегда ровно один модуль, по умолчанию первый: два раскрытых
 * списка рядом на 430px читаются сплошной простынёй, а все закрытые —
 * заглушкой, по которой не понять, что внутри есть уроки.
 *
 * Итоговой подписи «6 модулей, 35 уроков» больше нет: настоящих уроков
 * сейчас 12 из неизвестного числа, и любая цифра под секцией была бы
 * враньём. Вернётся, когда придут остальные модули.
 */
export function ProgramSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="program"
      aria-labelledby="program-title"
      // Своего фона у секции нет намеренно. Тон продолжает «Для кого» и
      // гаснет к bg-pitch, но рисуется он в CourseBackdrop — слоем с
      // фиксированной высотой. Градиент на самой секции тянулся по её
      // высоте и пересчитывался на каждом кадре раскрытия аккордеона.
      // z-10 обязателен: общий фон лежит слоем z-[3] поверх потока, и его
      // тональная база непрозрачна — без подъёма секции текст программы
      // оказывается под ней. Так же сделано в «Тренере».
      className="section-rhythm relative z-10 px-5"
    >
      {/* Заголовок ТЗ дословно. Надзаголовка нет: он повторял бы эти же два
          слова — так же сделано в «Для кого», где над «ДЛЯ КОГО?» тоже
          ничего не стоит. Прежний абзац под заголовком («путь от модели игры
          до управления людьми») снят: он был сочинён, а тексты берём только
          из ТЗ. */}
      <h2 id="program-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        Программа обучения
      </h2>

      <ol className="mt-6 flex flex-col gap-2.5">
        {PROGRAM.map((module, index) => (
          <ModuleCard
            key={module.title}
            module={module}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </ol>

      {/* Здесь стоял сход в bg-pitch: пока программа была последней секцией
          страницы, её низ обязан был гаснуть в чёрный. Снят 31.08 — за ней
          встала «Как проходит обучение», и этот слой гасил тон ровно на
          стыке двух секций. Теперь тональная база CourseBackdrop проходит
          через обе, а гаснет уже под последней. */}

      {/* ТЗ: «Кнопка: ПОСМОТРЕТЬ ТАРИФЫ, ведёт на слайд 6». Подача та же, что
          у «К программе» на слайде 2 (вариант 03 с /buttons.html) — обе
          кнопки на странице переносят с этажа на этаж, и одинаковыми они
          читаются одной системой навигации, а не двумя разными действиями.
          Перевести на синюю заливку — это заменить btn-hero-turf на
          btn-hero-primary, одна строка.

          Якорь #tariffs с 31.08 существует: слайд 6 стоит последней секцией
          страницы, кнопка доезжает до него. */}
      <div className="relative mt-7 flex">
        <a href="#tariffs" className="btn-hero btn-hero-turf w-full">
          Посмотреть тарифы
          <ArrowRightIcon className="size-5 shrink-0" />
        </a>
      </div>
    </section>
  )
}

function ModuleCard({
  module,
  isOpen,
  onToggle,
}: {
  module: ProgramModule
  isOpen: boolean
  onToggle: () => void
}) {
  const panelId = `program-panel-${module.num ?? 'bonus'}`
  // Уроки утверждены не у всех: без списка раскрывать нечего, и шапка
  // перестаёт быть кнопкой — иначе человек жмёт, а в ответ ничего.
  const hasLessons = module.lessons.length > 0

  // Высота раскрытой части. Меряем содержимое, а не задаём max-height с
  // запасом: с запасом анимация половину времени идёт по пустоте, и
  // раскрытие кажется вялым, а закрытие — резким.
  const panelRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  // До первого замера высота равна нулю, и включённый переход проигрывал бы
  // раскрытие первого модуля прямо на загрузке страницы — как глюк.
  const [measured, setMeasured] = useState(false)
  // will-change держим только на время раскрытия: постоянный съедает память,
  // а шесть карточек с ним одновременно на телефоне заметно хуже, чем без.
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
      setMeasured(true)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ── Плашка заголовка ───────────────────────────────────────────────────
  // Одно и то же содержимое для кнопки и для нераскрываемого заголовка,
  // поэтому собрано отдельно: различаются только обёртка и её роль.
  const headerInner = (
    <>
      {/* База плашки. Открытый модуль светлеет — состояние читается даже без
          взгляда на плюс справа. У бонусного своя, тёплая: тот же рисунок
          градиента, но синева в нём заменена на тёмное золото, поэтому он
          отличается от пяти остальных ещё до того, как прочитано слово. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 z-0 transition-colors duration-300 ${
          module.bonus
            ? 'bg-[linear-gradient(104deg,rgba(46,35,17,.96)_0%,rgba(24,19,12,.94)_58%,rgba(13,13,15,.94)_100%)]'
            : isOpen
              ? 'bg-[linear-gradient(104deg,rgba(22,38,62,.96)_0%,rgba(12,20,32,.94)_58%,rgba(9,15,24,.94)_100%)]'
              : 'bg-[linear-gradient(104deg,rgba(16,26,40,.9)_0%,rgba(10,16,25,.9)_58%,rgba(8,13,20,.9)_100%)]'
        }`}
      />

      {/* Отсвет из-под номера: он же держит левый край плашки. У бонусного
          блока он тёплый — по ТЗ бонусу нужна визуальная пометка, а в
          тарифной таблице он входит только в ПРЕМИУМ и ВИП. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 z-0 ${
          module.bonus
            ? 'bg-[radial-gradient(58%_120%_at_2%_50%,rgba(255,193,74,.2)_0%,rgba(255,193,74,.06)_44%,transparent_76%)]'
            : 'bg-[radial-gradient(58%_120%_at_2%_50%,rgba(30,91,255,.26)_0%,rgba(30,91,255,.08)_44%,transparent_76%)]'
        }`}
      />

      {/* Блик по верхней грани бонусной плашки — тем же приёмом, что
          световая кромка у кнопок первого экрана (.btn-hero). Полоса в один
          пиксель ловит свет на золотой рамке и не даёт тёплому верху
          карточки выглядеть просто грязным. */}
      {module.bonus && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,222,160,.6)_26%,rgba(255,214,140,.18)_68%,transparent_100%)]"
        />
      )}

      {/* Номер и название стоят одной строкой по базовой линии.
          Раньше номер был прижат к верху плашки (`self-start`), а название
          — выровнено по её центру: цифра висела примерно на 13px выше
          первой строки названия. Ровнять их отступами бесполезно —
          шрифты разные (Bebas у номера, Onest у названия), и при переносе
          названия на вторую строку подобранный отступ снова разъезжается.
          `items-baseline` сажает и цифру, и заглавные буквы названия на
          одну линию: у Bebas высота прописной 0.70em, у Onest 0.707em —
          верхние края тоже сходятся, разница 0.6px на этом кегле. */}
      <span className="relative z-10 flex min-w-0 flex-1 items-baseline gap-3">
        {/* 15px, а не 13: в мелком кегле закрытая петля шестёрки в Bebas
            читается восьмёркой — «06» превращалось в «08».
            У бонусного блока номера нет: в ТЗ он «БОНУС», а не «модуль 6» —
            на месте номера стоит само слово, тем же Bebas и тем же
            трекингом, только золотом. Прежняя наклейка-пилюля отсюда снята:
            рамка с заливкой в этом слоте выпадала из типографики колонки, а
            выделение бонуса взяла на себя сама карточка. */}
        {module.num ? (
          <span className="segment-index shrink-0 text-[15px] leading-none">{module.num}</span>
        ) : (
          <span className="segment-index segment-index-gold shrink-0 text-[15px] leading-none">Бонус</span>
        )}

        {/* Тот же набор, что у регалий в «Тренере»: font-display bold
            капслоком. Bebas с градиентной заливкой (section-title) здесь
            стоял, но в кегле 14px на плашке терял читаемость.
            Подписи-описания под названием больше нет: она была из
            выброшенного черновика, а названия по ТЗ длинные («Контроль
            состояния, тренировочных и соревновательных нагрузок») — на 430px
            две строки названия плюс две строки описания давали плашку под
            сотню пикселей. */}
        <span
          className={`min-w-0 flex-1 font-display text-[14px] font-bold uppercase leading-[1.14] tracking-[.01em] ${
            module.bonus ? 'text-[#FFE7C2]' : 'text-white'
          }`}
        >
          {module.title}
        </span>
      </span>

      {/* Счётчик «УРОКОВ: N» из ТЗ — в шапке, а не последней строкой блока
          (Q11): в закрытом виде он помогает решить, разворачивать ли список.
          Колонка фиксированная в 34px, а не по контенту: иначе «5» и «7»
          дают разную ширину, и правый край гуляет от карточки к карточке.
          Число и слово в два этажа — так колонка узкая и названию остаётся
          место. */}
      <span className="relative z-10 flex shrink-0 items-center gap-2.5">
        {hasLessons ? (
          <span className="w-[34px] text-right">
            <span className="block font-badge text-[15px] font-extrabold leading-none text-white/86 tabular-nums">
              {module.lessons.length}
            </span>
            <span className="mt-0.5 block text-[8.5px] uppercase tracking-[.1em] text-white/40">
              {plural(module.lessons.length)}
            </span>
          </span>
        ) : (
          // У неутверждённых модулей на месте счётчика — короткий прочерк:
          // колонка не схлопывается, и правый край плашек остаётся общим для
          // всех шести карточек.
          <span aria-hidden="true" className="flex w-[34px] justify-end">
            <span
              className={`h-px w-3.5 border-t border-dashed ${
                module.bonus ? 'border-[#FFC14A]/40' : 'border-white/22'
              }`}
            />
          </span>
        )}

        {hasLessons && (
          // Плюс превращается в минус поворотом — отдельная иконка для
          // закрытого и открытого состояния тут не нужна.
          //
          // Цвет — как у всей карточки: золото на бонусном блоке, синий на
          // остальных. Пара тонов та же, что у кружков с номерами уроков:
          // #FFC14A держит кольцо и подложку, #FFD68C — сами штрихи, иначе
          // на тёплой плашке они читаются тусклее синих. Классы записаны
          // литералами, а не собираются из переменной: Tailwind ищет их по
          // исходнику, и склеенное в рантайме имя в сборку не попадёт.
          <span
            aria-hidden="true"
            className={`relative flex size-6 items-center justify-center rounded-full border transition-colors duration-300 ${
              isOpen
                ? module.bonus
                  ? 'border-[#FFC14A]/60 bg-[#FFC14A]/14'
                  : 'border-[#6AA0FF]/60 bg-[#6AA0FF]/14'
                : module.bonus
                  ? 'border-[#FFC14A]/30'
                  : 'border-white/16'
            }`}
          >
            <span
              className={`absolute h-px w-2.5 rounded-full ${
                module.bonus ? 'bg-[#FFD68C]' : 'bg-[#6AA0FF]'
              }`}
            />
            <span
              className={`absolute h-2.5 w-px rounded-full transition-transform duration-300 ${
                module.bonus ? 'bg-[#FFD68C]' : 'bg-[#6AA0FF]'
              } ${isOpen ? 'scale-y-0' : ''}`}
            />
          </span>
        )}
      </span>
    </>
  )

  // min-h 64, а не 78 как раньше: описание из-под названия ушло, и в пустой
  // плашке оставался воздух под текстом.
  const headerClass =
    'relative flex min-h-[64px] w-full items-center gap-3 overflow-hidden px-3.5 py-3 text-left'

  return (
    // Свечение — просьба владельца («возможно добавить внешнее красивое
    // свечение»). Сами тени описаны в index.css: у раскрытого модуля синий
    // ореол акцентного цвета, у бонусного — золотой и постоянный, у
    // остальных лёгкая тень-подкладка. Бонусной карточке класс отдаёт и
    // рамку: она собрана градиентом по border-box, обычным border-color
    // металлического перелива не получить, поэтому утилиты границы у неё
    // здесь нет.
    <li
      className={`program-card overflow-hidden rounded-[14px] border transition-colors duration-300 ${
        module.bonus
          ? 'program-card-gold'
          : isOpen
            ? 'program-card-open border-[#6AA0FF]/34'
            : 'border-white/10'
      }`}
    >
      {/* Кнопкой шапка становится только там, где есть что раскрывать. У
          остальных четырёх блоков это обычный заголовок: нажимать не на что,
          и ни фокуса, ни aria-expanded у него быть не должно. */}
      {hasLessons ? (
        <button
          type="button"
          onClick={() => {
            setAnimating(true)
            onToggle()
          }}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={headerClass}
        >
          {headerInner}
        </button>
      ) : (
        <div className={headerClass}>{headerInner}</div>
      )}

      {/* ── Раскрытие ────────────────────────────────────────────────────
          Высота анимируется по замеренной величине, а не через
          grid-template-rows: переход 0fr → 1fr работает только в Safari 16+
          и свежих WebView, в остальных браузерах список просто выпрыгивал
          без анимации. Замер держит ResizeObserver — высота меняется при
          повороте экрана и при подгрузке шрифта.

          Содержимое всплывает следом за высотой (opacity), иначе текст виден
          с первого кадра и выглядит выдавленным из плашки. При закрытии
          задержки нет: гаснуть медленно нечему. */}
      {hasLessons && (
        <div
          id={panelId}
          aria-hidden={!isOpen}
          style={{ height: isOpen ? height : 0 }}
          onTransitionEnd={(event) => {
            if (event.propertyName === 'height') setAnimating(false)
          }}
          className={`overflow-hidden bg-[rgba(6,10,16,.72)] motion-reduce:transition-none ${
            animating ? 'program-panel-animating' : ''
          } ${measured ? 'transition-[height] duration-[380ms] ease-[var(--ease-mass)]' : ''}`}
        >
          <div
            ref={panelRef}
            className={`transition-opacity duration-300 ease-[var(--ease-mass)] motion-reduce:transition-none ${
              isOpen ? 'opacity-100 delay-100' : 'opacity-0'
            }`}
          >
            {/* У каждого урока слева кружок с номером — просьба владельца
                («хотелось бы видеть иконки или ещё что-то рядом с уроком»).
                Кружок даёт длинной строке опору слева и заменяет собой
                прежние линейки-разделители на всю ширину.

                Нити между кружками нет: пробовали связать их вертикальной
                линией в дорожку — владелец отказался, читается спокойнее без
                неё. Значка «play» тут тоже нет: хронометража и форматов
                уроков в ТЗ не осталось, и плеер обещал бы видео поимённо.

                Отступы сверху и снизу равны и держатся на самой `ol` (16px).
                Раньше первый урок стоял в 8px от шапки, а последний — в 24px
                от результата: у строк были свои `py-2.5`, а у первой сверху
                они снимались. Из-за этого список казался задранным вверх.
                Теперь вертикальных полей у строки нет вовсе — только зазор
                до следующего урока, у последнего он снимается. */}
            <ol className="px-3.5 py-4">
              {module.lessons.map((lesson, i) => (
                <li key={lesson} className="flex items-start gap-3 pb-[18px] last:pb-0">
                  {/* `-mt-px` сажает середину кружка на середину первой строки
                      текста: строка 17px, кружок 20px. Цвет ведёт себя как вся
                      карточка — у бонусного блока золото вместо синего (уроков
                      у него пока нет, но данные придут, и разъезжаться с
                      золотой рамкой он не должен). */}
                  <span
                    aria-hidden="true"
                    className={`-mt-px flex size-5 shrink-0 items-center justify-center rounded-full border font-badge text-[10px] font-extrabold leading-none tabular-nums ${
                      module.bonus
                        ? 'border-[#FFC14A]/34 bg-[#FFC14A]/10 text-[#FFD68C]'
                        : 'border-[#6AA0FF]/34 bg-[#6AA0FF]/10 text-[#8FB8FF]'
                    }`}
                  >
                    {i + 1}
                  </span>

                  <span className="min-w-0 flex-1 text-[12px] leading-[1.42] text-white/82">{lesson}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* ── Статичная часть блока ────────────────────────────────────────
          По ТЗ результат виден всегда, поэтому он стоит снаружи панели
          раскрытия. Когда чего-то из двух ещё нет, на его месте идёт строка
          о состоянии (Q13) — одна и та же подача для обоих случаев.

          Полоса рисуется только если внутри что-то есть. Иначе у модуля с
          уроками, но без результата (сейчас это модуль 4) под списком висела
          бы пустая плашка с рамкой в 25px высотой — она читается сломанной
          вёрсткой, а не «результат готовится». */}
      {(hasLessons || module.result) && (
        <div className="border-t border-white/8 bg-[rgba(6,10,16,.5)] px-3.5 py-3">
          {!hasLessons && <PendingLine>Программа модуля утверждается</PendingLine>}

          {module.result ? (
            <p className={`text-[12px] leading-[1.5] text-white/70 ${hasLessons ? '' : 'mt-2.5'}`}>
              {/* «Вы сможете» / «Вы научитесь» / «Вы освоите» — в ТЗ у каждого
                  модуля своя формулировка, поэтому строка хранится целиком и
                  режется на первом двоеточии, а не собирается из кусков. */}
              {/* Цвет ведёт себя как вся карточка: у бонусного блока золото
                  вместо синего — тот же #FFD68C, которым набраны номера его
                  уроков. Синяя надпись на золотой плашке была единственным
                  местом, где бонус не доводил свою тему до конца. */}
              <span
                className={`font-display font-bold uppercase tracking-[.02em] ${
                  module.bonus ? 'text-[#FFD68C]' : 'text-[#6AA0FF]'
                }`}
              >
                {resultLead(module.result)}
              </span>{' '}
              {resultBody(module.result)}
            </p>
          ) : (
            <PendingLine>Результат модуля утверждается</PendingLine>
          )}
        </div>
      )}
    </li>
  )
}

/**
 * Строка «… утверждается» — общая подача для обоих незакрытых состояний
 * блока: нет уроков и нет результата. Тише основного текста и с чёрточкой
 * слева вместо буллита: это пометка о состоянии, а не содержание модуля.
 */
function PendingLine({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 text-[11px] leading-[1.4] text-white/42">
      <span aria-hidden="true" className="h-px w-3 shrink-0 bg-white/22" />
      {children}
    </p>
  )
}

/** «Вы сможете:» — часть результата до первого двоеточия включительно. */
function resultLead(result: string) {
  const colon = result.indexOf(':')
  return colon === -1 ? '' : result.slice(0, colon + 1)
}

/** Остальная часть результата — само перечисление. */
function resultBody(result: string) {
  const colon = result.indexOf(':')
  return colon === -1 ? result : result.slice(colon + 1).trim()
}

/** «5 уроков» / «1 урок» / «22 урока» — счётные формы для подписи. */
function plural(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'урок'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'урока'
  return 'уроков'
}
