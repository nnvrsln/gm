import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import coachScene from '../assets/coach-scene.webp'
import coachStand from '../assets/coach-stand.webp'
import { ACHIEVEMENTS } from '../data/achievements'
import { ArrowRightIcon } from '../components/icons'

/**
 * Макетная слайда 3 «Автор обучения»: восемь структурно разных блоков.
 * Отдельная точка входа (coach.html → src/coach.tsx), в прод-сборку не
 * попадает — Vite собирает только index.html.
 *
 * Предыдущий набор (семь подач вокруг узкого портрета) выброшен целиком по
 * просьбе владельца: «сделай кардинально другие блоки». Здесь ни один
 * вариант не повторяет прежнюю раскладку «надзаголовок → имя → кадр →
 * вертикальный список».
 *
 * Что изменилось в исходных данных, и почему это меняет раскладки:
 *
 *   1. Появился съёмочный кадр в полный рост (`coach-stand.webp` из
 *      docs/newbg.png, 860×1075). Фигура стоит в правой половине, левые 55%
 *      ширины — чистая темнота. Это не «фон, к которому надо
 *      приспособиться», а готовая сетка: контент кладётся в левую колонку,
 *      фигура остаётся целой. На нём стоят варианты 01, 02, 03, 05, 06, 08.
 *   2. У каждой регалии есть своя предметная фотография (`ach-*.webp`,
 *      176×176 с прозрачными углами). Иконка перестала быть украшением: на
 *      ней держится сетка плиток (03, 08), лента (04), узлы рельсы (06).
 *   3. Широкий кадр `coach-scene.webp` остался — на нём работают варианты с
 *      полосой сверху (04, 07).
 *
 * Приёмы взяты из мобильных приложений, а не из лендингов: нижняя шторка
 * (02), сегментированный список профиля (05), лента со snap и точками (04),
 * сетки плиток (03, 08). Правила — из app-чеклиста скилла `ui-ux-pro-max`
 * (references/pro-rules.md): тач-цель не меньше 44px, отклик на нажатие не
 * двигает раскладку, у интерактивных элементов есть имя и состояние,
 * разделители читаются в тёмной теме, ритм отступов кратен 4, текст не
 * мельче 12px, декоративные иконки скрыты от скринридера.
 *
 * Осознанное отступление от того же чеклиста: он требует векторных иконок и
 * запрещает растровые. Здесь иконки растровые намеренно — это предметные
 * фотографии заказчика (олимпийка, медаль, кубок), то есть содержание, а не
 * системные значки. Отдаются под ретину: 176px файла на 34–88px показа.
 *
 * Собрано на настоящих токенах и классах проекта, поэтому выбранный вариант
 * переносится в боевой компонент почти как есть.
 */

// Bebas задаётся инлайновым стилем, а не утилитой font-[...]: имя шрифта с
// пробелами Tailwind как arbitrary-значение не разбирает (грабля, найденная
// на макетной /buttons.html).
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

export function CoachLayouts() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1500px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          «Автор обучения» — восемь блоков
        </h1>
        <p className="mt-3 max-w-[76ch] text-[14px] leading-relaxed text-white/58">
          Прежний набор снят целиком. Здесь меняется не оформление одного и того же списка, а
          устройство блока: где живёт фигура, чем работают иконки регалий, что можно потрогать
          пальцем. Шесть вариантов стоят на новом кадре в полный рост, два — на широком.
        </p>
        <p className="mt-2 max-w-[76ch] text-[13px] leading-relaxed text-white/40">
          Каждый показан на проектных 430&nbsp;px и на 360&nbsp;px. Варианты 02, 04 и 08
          интерактивные — их можно потыкать. Оговорка: рамки — это блоки, а не окно браузера,
          поэтому медиазапросы по ширине вьюпорта внутри них не срабатывают.
        </p>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-10">
        <Frame
          n="01"
          name="Досье на поле"
          why="Кадр в полный рост работает не иллюстрацией, а подложкой всего блока: фигура стоит справа, а левые 55% ширины — готовая тёмная колонка, в которую ложится весь текст. Ни одной рамки, ни одной карточки: регалии идут прямо по снимку, как подписи в досье. Плата — колонка узкая, длинные названия переносятся в две строки; выигрыш — блок читается одним кадром, а не «фотография плюс список под ней»."
          tags={['кадр в полный рост', 'текст в тёмной колонке', 'без карточек', 'не интерактивный']}
        >
          <V1Dossier />
        </Frame>

        <Frame
          n="02"
          name="Нижняя шторка"
          why="Приём из мобильных приложений: снимок занимает верх экрана, а содержимое лежит в панели со скруглённым верхом, надвинутой на него. Панель — поверхность со своим фоном, поэтому список читается независимо от того, что под ним на фотографии. Регалии сложены в аккордеон: видно все шесть названий, пояснение открывается по нажатию. Так блок держит предсказуемую высоту при любом числе пунктов."
          tags={['bottom sheet', 'аккордеон', 'aria-expanded', 'интерактивный']}
        >
          <V2Sheet />
        </Frame>

        <Frame
          n="03"
          name="Плитки поверх кадра"
          why="Тот же кадр в полный рост, но текст не колонкой, а сеткой стеклянных плиток 2×3 в нижней половине. Плитка — иконка и короткое название; пояснений нет вовсе, они сведены в одну строку под сеткой. Шесть предметных фотографий подряд читаются витриной наград, а не списком строк. Риск честный: без пояснений теряются даты, и «Лучший тренер России» не говорит, что премий было две."
          tags={['стеклянные плитки 2×3', 'кадр в полный рост', 'без пояснений', 'не интерактивный']}
        >
          <V3Tiles />
        </Frame>

        <Frame
          n="04"
          name="Лента со snap"
          why="Регалии как горизонтальная лента карточек — ровно тот приём, который владелец уже принял на слайде 2 «Для кого». Блок не растёт от числа пунктов: сколько бы регалий ни было, он занимает один экран. Карточка крупная, иконка 64px, пояснение целиком. Управление — стрелки и точки с тач-целью 44px: мышью горизонтальную прокрутку без shift+колеса не сдвинуть, а без индикатора не видно, что лента вообще листается."
          tags={['лента карточек', 'snap-start', 'точки и стрелки', 'интерактивный']}
        >
          <V4Rail />
        </Frame>

        <Frame
          n="05"
          name="Профиль приложения"
          why="Блок притворяется экраном профиля: круглый аватар, имя по центру, три чипа-факта и сегментированный список с иконками. Фотография ужата до аватара, всё внимание на послужной список. Самый «приложенческий» из восьми и самый спокойный: здесь нет ни одного места, где текст лежит на фотографии, поэтому он не ломается ни на какой ширине и не зависит от того, какой кадр пришлёт заказчик."
          tags={['аватар 96px', 'чипы-факты', 'сегментированный список', 'не интерактивный']}
        >
          <V5Profile />
        </Frame>

        <Frame
          n="06"
          name="Рельса с узлами"
          why="Регалии выстроены по вертикальной рельсе, иконка — узел. Кадр в полный рост уходит в правый край и приглушён до фона: фигура видна целиком, но не спорит с текстом. Оговорка по содержанию: хронологии в этих шести пунктах нет — клубы РПЛ, две премии и учёная степень в последовательность не выстраиваются, поэтому рельса тут работает разделителем, а не осью времени. Если владелец захочет годы по порядку, придётся менять тексты, а их менять нельзя."
          tags={['вертикальная рельса', 'узлы 48px', 'фигура целиком', 'не интерактивный']}
        >
          <V6Timeline />
        </Frame>

        <Frame
          n="07"
          name="Карточка-обложка"
          why="Единственный вариант, где снимок не уходит в края экрана: он лежит карточкой со скруглением 20px и полями по бокам, имя — внутри карточки на затемнённом низу. Дальше обычный список крупными строками. Приём делает блок предметным: фотография читается как вставленный в страницу объект, а не как фон. Рядом с полноэкранными вариантами сразу видно, что он суше и спокойнее — это может быть и достоинством."
          tags={['карточка 20px', 'широкий кадр', 'список под карточкой', 'не интерактивный']}
        >
          <V7Card />
        </Frame>

        <Frame
          n="08"
          name="Витрина наград"
          why="Иконки крупные — 88px, по две в ряд, с названием под каждой; фигура стоит фоном за сеткой и видна в просветах. Здесь предметные фотографии работают в полную силу: олимпийка, медаль и кубок узнаются с одного взгляда, и блок выглядит стендом с наградами. Нажатие на плитку открывает пояснение строкой во всю ширину — так даты не теряются, а сетка не разъезжается."
          tags={['сетка 88px', 'раскрытие строкой', 'кадр фоном', 'интерактивный']}
        >
          <V8Showcase />
        </Frame>
      </div>
    </div>
  )
}

/* ── 01. Досье на поле ─────────────────────────────────────────────────── */

function V1Dossier() {
  return (
    // Высоту задаёт содержимое, а кадр кладётся object-cover с якорем у
    // правого края. Через aspect-ratio нельзя: на 360px блок ниже, и список
    // вылезал бы за нижний край фотографии.
    <div className="relative -mx-5 -my-8 min-h-[560px] overflow-hidden">
      <img
        src={coachStand}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none object-cover object-[100%_28%]"
      />
      {/* Шторка держит левую колонку: без неё текст ложится на подсвеченную
          кромку газона. Справа отпускает почти в ноль, чтобы не притухла
          фигура. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.94)_0%,rgba(5,8,11,.86)_38%,rgba(5,8,11,.32)_62%,transparent_88%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(5,8,11,.9)_0%,transparent_100%)]" />

      <div className="relative flex min-h-[560px] flex-col px-5 py-8">
        <p className="font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
          Автор обучения
        </p>
        <h2 className="section-title mt-2 text-[30px] uppercase leading-[.92] tracking-title">
          <span className="block">Гаджиев</span>
          <span className="block">Гаджи</span>
          <span className="block">Муслимович</span>
        </h2>

        <ol className="mt-6 w-[58%] space-y-3.5">
          {ACHIEVEMENTS.map((item) => (
            <li key={item.title} className="flex items-start gap-2.5">
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={34}
                height={34}
                className="mt-0.5 size-[34px] shrink-0 select-none rounded-lg"
              />
              <div className="min-w-0">
                <p style={BEBAS} className="text-[15px] uppercase leading-[1.05] tracking-title text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.3] text-white/50">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ── 02. Нижняя шторка ─────────────────────────────────────────────────── */

function V2Sheet() {
  const [open, setOpen] = useState<string | null>(ACHIEVEMENTS[0].title)

  return (
    <div className="-mx-5 -my-8">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={coachStand}
          alt="Гаджи Муслимович Гаджиев"
          className="absolute inset-0 h-full w-full select-none object-cover object-[62%_14%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_44%,rgba(5,8,11,.74)_100%)]" />
        <div className="absolute inset-x-0 bottom-9 px-5">
          <p className="font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
            Автор обучения
          </p>
          <h2 className="section-title mt-1.5 max-w-[68%] text-[28px] uppercase leading-[.94] tracking-title">
            Гаджиев Гаджи Муслимович
          </h2>
        </div>
      </div>

      {/* Панель надвинута на кадр на 24px и имеет свой фон: содержимое
          перестаёт зависеть от того, что под ним на фотографии. */}
      <div className="relative -mt-6 rounded-t-3xl border-t border-white/10 bg-[#0b121a] px-5 pb-8 pt-5">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />
        <ol className="space-y-1">
          {ACHIEVEMENTS.map((item) => {
            const isOpen = open === item.title
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.title)}
                  aria-expanded={isOpen}
                  className="flex min-h-[56px] w-full items-center gap-3 rounded-xl px-2 text-left transition-colors duration-150 active:bg-white/[.06]"
                >
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={40}
                    height={40}
                    className="size-10 shrink-0 select-none rounded-[10px]"
                  />
                  <span
                    style={BEBAS}
                    className="min-w-0 flex-1 text-[17px] uppercase leading-[1.05] tracking-title text-white"
                  >
                    {item.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-white/35 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  >
                    <ArrowRightIcon className="size-4" />
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-2.5 pl-[64px] pr-2 text-[12.5px] leading-[1.45] text-white/55">
                    {item.detail}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

/* ── 03. Плитки поверх кадра ───────────────────────────────────────────── */

function V3Tiles() {
  return (
    <div className="relative -mx-5 -my-8 min-h-[560px] overflow-hidden">
      <img
        src={coachStand}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none object-cover object-[76%_16%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,11,.5)_0%,rgba(5,8,11,.18)_26%,rgba(5,8,11,.84)_60%,rgba(5,8,11,.95)_100%)]" />

      <div className="relative flex min-h-[560px] flex-col px-5 py-8">
        <p className="font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
          Автор обучения
        </p>
        <h2 className="section-title mt-2 max-w-[62%] text-[28px] uppercase leading-[.94] tracking-title">
          Гаджиев Гаджи Муслимович
        </h2>

        {/* mt-auto прижимает сетку к низу: сверху остаётся лицо, снизу —
            плитки, между ними фигура. */}
        <ul className="mt-auto grid grid-cols-2 gap-2 pt-8">
          {ACHIEVEMENTS.map((item) => (
            <li
              key={item.title}
              className="flex items-center gap-2.5 rounded-xl border border-white/12 bg-white/[.07] p-2.5 backdrop-blur-md"
            >
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={38}
                height={38}
                className="size-[38px] shrink-0 select-none rounded-lg"
              />
              <span style={BEBAS} className="text-[13.5px] uppercase leading-[1.02] tracking-title text-white">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] leading-[1.4] text-white/50">
          Сборная СССР и Олимпиада-1988, пять клубов РПЛ, две премии «Лучший тренер России»,
          кандидат педагогических наук.
        </p>
      </div>
    </div>
  )
}

/* ── 04. Лента со snap ─────────────────────────────────────────────────── */

function V4Rail() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const step = () => {
    const el = track.current
    if (!el || el.children.length < 2) return 236
    return el.children[1].getBoundingClientRect().left - el.children[0].getBoundingClientRect().left
  }

  const onScroll = () => {
    const el = track.current
    if (!el) return
    setActive(Math.min(ACHIEVEMENTS.length - 1, Math.round(el.scrollLeft / step())))
  }

  const goTo = (index: number) => {
    const el = track.current
    const card = el?.children[index] as HTMLElement | undefined
    if (!el || !card) return
    setActive(index)
    // Присваивание scrollLeft, а не scrollTo({behavior:'smooth'}): плавная
    // прокрутка дерётся со snap-mandatory, лента не уезжает дальше пары
    // десятков пикселей. Грабля со слайда 2, замер там же.
    el.scrollLeft = el.scrollLeft + card.getBoundingClientRect().left - el.getBoundingClientRect().left - 20
  }

  return (
    <div>
      <div className="relative -mx-5 h-[230px] overflow-hidden">
        <img
          src={coachScene}
          alt="Гаджи Муслимович Гаджиев"
          className="absolute inset-0 h-full w-full select-none object-cover object-[50%_28%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.92)_0%,rgba(5,8,11,.72)_42%,transparent_82%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent_0%,#0c141d_100%)]" />
        <div className="absolute inset-y-0 left-0 flex w-[58%] flex-col justify-center px-5">
          <p className="font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
            Автор обучения
          </p>
          <h2 className="section-title mt-1.5 text-[26px] uppercase leading-[.94] tracking-title">
            Гаджиев Гаджи Муслимович
          </h2>
        </div>
      </div>

      <ul
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        role="group"
        aria-label="Регалии, листайте вбок"
        className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 pb-1 outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[#6AA0FF]/60 [&::-webkit-scrollbar]:hidden"
      >
        {ACHIEVEMENTS.map((item) => (
          <li
            key={item.title}
            className="w-[224px] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[.04] p-4"
          >
            <img
              src={item.icon}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={64}
              height={64}
              className="size-16 select-none rounded-xl"
            />
            <p style={BEBAS} className="mt-3 text-[18px] uppercase leading-[1.05] tracking-title text-white">
              {item.title}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-[1.4] text-white/55">{item.detail}</p>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Предыдущая регалия"
          className="flex size-11 items-center justify-center rounded-full text-white/70 transition-opacity duration-150 active:opacity-60 disabled:opacity-25"
        >
          <ArrowRightIcon className="size-5 rotate-180" />
        </button>
        <div className="flex items-center gap-1">
          {ACHIEVEMENTS.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goTo(index)}
              aria-label={item.title}
              aria-current={index === active}
              className="flex h-11 w-5 items-center justify-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  index === active ? 'w-4 bg-[#6AA0FF]' : 'w-1.5 bg-white/25'
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === ACHIEVEMENTS.length - 1}
          aria-label="Следующая регалия"
          className="flex size-11 items-center justify-center rounded-full text-white/70 transition-opacity duration-150 active:opacity-60 disabled:opacity-25"
        >
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
    </div>
  )
}

/* ── 05. Профиль приложения ────────────────────────────────────────────── */

const FACTS = [
  { value: '50+', label: 'лет в футболе' },
  { value: '5', label: 'клубов РПЛ' },
  { value: '2', label: 'премии' },
]

function V5Profile() {
  return (
    <div>
      <div className="flex flex-col items-center text-center">
        {/* Аватар — тот же кадр в полный рост, приближенный по лицу через
            object-position и scale. Отдельный файл под это не нужен. */}
        <div className="size-24 overflow-hidden rounded-full border border-white/15">
          <img
            src={coachStand}
            alt="Гаджи Муслимович Гаджиев"
            className="h-full w-full origin-[72%_8%] scale-[2.2] select-none object-cover object-[72%_8%]"
          />
        </div>
        <p className="mt-3 font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
          Автор обучения
        </p>
        <h2 className="section-title mt-1.5 text-[26px] uppercase leading-[.96] tracking-title">
          Гаджиев Гаджи Муслимович
        </h2>

        <ul className="mt-4 flex gap-2">
          {FACTS.map((fact) => (
            <li key={fact.label} className="rounded-xl border border-white/10 bg-white/[.04] px-3 py-2">
              <p style={BEBAS} className="text-[20px] leading-none tracking-title text-[#6AA0FF]">
                {fact.value}
              </p>
              <p className="mt-1 text-[12px] leading-none text-white/50">{fact.label}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Сегментированный список: одна поверхность, внутри — строки через
          волосяные линии. Высота строки 60px. */}
      <ul className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">
        {ACHIEVEMENTS.map((item) => (
          <li key={item.title} className="border-t border-white/[.07] first:border-t-0">
            <div className="flex min-h-[60px] items-center gap-3 px-3 py-2.5">
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={42}
                height={42}
                className="size-[42px] shrink-0 select-none rounded-[11px]"
              />
              <div className="min-w-0">
                <p style={BEBAS} className="text-[17px] uppercase leading-[1.05] tracking-title text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.35] text-white/50">{item.detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 06. Рельса с узлами ───────────────────────────────────────────────── */

function V6Timeline() {
  return (
    <div className="relative -mx-5 -my-8 min-h-[600px] overflow-hidden">
      <img
        src={coachStand}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none object-cover object-[100%_18%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.96)_0%,rgba(5,8,11,.9)_46%,rgba(5,8,11,.52)_74%,rgba(5,8,11,.22)_100%)]" />

      <div className="relative min-h-[600px] px-5 py-8">
        <p className="font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
          Автор обучения
        </p>
        <h2 className="section-title mt-2 max-w-[70%] text-[28px] uppercase leading-[.94] tracking-title">
          Гаджиев Гаджи Муслимович
        </h2>

        <ol className="relative mt-7">
          {/* Рельса проходит ровно по центру узлов: 24px от левого края
              колонки — половина узла 48px. */}
          <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-px bg-white/12" />
          {ACHIEVEMENTS.map((item) => (
            <li key={item.title} className="relative flex gap-3.5 pb-5 last:pb-0">
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={48}
                height={48}
                className="size-12 shrink-0 select-none rounded-xl ring-1 ring-white/15"
              />
              <div className="min-w-0 pt-0.5">
                <p style={BEBAS} className="text-[17px] uppercase leading-[1.05] tracking-title text-white">
                  {item.title}
                </p>
                <p className="mt-1 max-w-[88%] text-[12.5px] leading-[1.4] text-white/55">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ── 07. Карточка-обложка ──────────────────────────────────────────────── */

function V7Card() {
  return (
    <div>
      <figure className="relative h-[260px] overflow-hidden rounded-[20px]">
        <img
          src={coachScene}
          alt="Гаджи Муслимович Гаджиев"
          className="absolute inset-0 h-full w-full select-none object-cover object-[54%_24%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(5,8,11,.88)_100%)]" />
        <figcaption className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
            Автор обучения
          </p>
          <h2 className="section-title mt-1.5 text-[26px] uppercase leading-[.94] tracking-title">
            Гаджиев Гаджи Муслимович
          </h2>
        </figcaption>
      </figure>

      <ol className="mt-5">
        {ACHIEVEMENTS.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-3.5 border-t border-white/10 py-3.5 first:border-t-0 first:pt-0"
          >
            <img
              src={item.icon}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={52}
              height={52}
              className="shrink-0 select-none rounded-xl"
            />
            <div className="min-w-0">
              <p style={BEBAS} className="text-[20px] uppercase leading-[1.05] tracking-title text-white">
                {item.title}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.45] text-white/55">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── 08. Витрина наград ────────────────────────────────────────────────── */

function V8Showcase() {
  const [open, setOpen] = useState<string | null>(ACHIEVEMENTS[0].title)

  return (
    <div className="relative -mx-5 -my-8 min-h-[620px] overflow-hidden">
      <img
        src={coachStand}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none object-cover object-[84%_10%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,11,.45)_0%,rgba(5,8,11,.24)_20%,rgba(5,8,11,.88)_52%,rgba(5,8,11,.96)_100%)]" />

      <div className="relative min-h-[620px] px-5 py-8">
        <p className="font-badge text-[10px] font-bold uppercase tracking-course text-[#6AA0FF]">
          Автор обучения
        </p>
        <h2 className="section-title mt-2 max-w-[58%] text-[28px] uppercase leading-[.94] tracking-title">
          Гаджиев Гаджи Муслимович
        </h2>

        {/* Пояснение открывается строкой во всю ширину под тем рядом, где
            стоит нажатая плитка: сама плитка не растягивается, соседняя не
            прыгает. Ряды по две — отсюда деление индекса на 2. */}
        <div className="mt-[150px] grid grid-cols-2 gap-x-3 gap-y-4">
          {ACHIEVEMENTS.map((item, index) => {
            const isOpen = open === item.title
            const rowOpen = ACHIEVEMENTS.find(
              (other, otherIndex) =>
                other.title === open && Math.floor(otherIndex / 2) === Math.floor(index / 2),
            )
            const isRowEnd = index % 2 === 1 || index === ACHIEVEMENTS.length - 1
            return (
              <div key={item.title} className="contents">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.title)}
                  aria-expanded={isOpen}
                  className="flex flex-col items-center gap-2 text-center transition-opacity duration-150 active:opacity-70"
                >
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={88}
                    height={88}
                    className={
                      isOpen
                        ? 'size-[88px] select-none rounded-2xl ring-2 ring-[#6AA0FF]'
                        : 'size-[88px] select-none rounded-2xl ring-1 ring-white/15'
                    }
                  />
                  <span style={BEBAS} className="text-[14px] uppercase leading-[1.05] tracking-title text-white">
                    {item.title}
                  </span>
                </button>
                {isRowEnd && rowOpen && (
                  <p className="col-span-2 rounded-xl bg-white/[.06] px-3 py-2.5 text-[12.5px] leading-[1.45] text-white/65">
                    {rowOpen.detail}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Оболочка макетной ─────────────────────────────────────────────────── */

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
      <p className="mb-6 max-w-[76ch] text-[13.5px] leading-relaxed text-white/55">{why}</p>

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
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0c141d] px-5 py-8">{children}</div>
    </div>
  )
}
