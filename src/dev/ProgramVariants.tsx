import { useState, type ReactNode } from 'react'
import { Eyebrow } from '../components/Eyebrow'
import academyPhoto from '../assets/audience-academy.webp'
import playerPhoto from '../assets/audience-player.webp'
import proPhoto from '../assets/audience-pro.webp'
import stadiumPhoto from '../assets/444.png'
import { PROGRAM_DRAFT as PROGRAM } from './programDraft'

/**
 * Макетная секции «Программа курса»: десять раскладок одного содержимого
 * рядом друг с другом. Отдельная точка входа (program.html → src/program.tsx),
 * в прод-сборку не попадает — Vite собирает только index.html.
 *
 * Собрано на настоящих классах и токенах проекта, поэтому выбранный вариант
 * переносится в компонент секции почти как есть.
 *
 * Страница устарела: она стоит на черновике модулей, который 31.08 уехал из
 * `src/data/program.ts` в `src/dev/programDraft.ts`. Боевая секция собрана по
 * ТЗ (слайд 4) и с этими раскладками уже не совпадает — здесь только история
 * выбора аккордеона.
 */

const PHOTOS = [proPhoto, academyPhoto, playerPhoto] as const

/** Короткий список тем модуля — первые три урока. */
const topics = (m: (typeof PROGRAM)[number]) => m.lessons.slice(0, 3).map((l) => l.title)

/** Подпись «7 уроков» — в данных теперь лежит сам список, а не строка. */
const lessonsLabel = (m: (typeof PROGRAM)[number]) => `${m.lessons.length} уроков`

export function ProgramVariants() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1400px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          Раскладки секции «Программа курса»
        </h1>
        <p className="mt-3 max-w-[70ch] text-[14px] leading-relaxed text-white/58">
          Десять способов показать шесть модулей на ширине мобильного макета (430&nbsp;px). Секция
          отвечает на главный вопрос покупателя — «чему конкретно научусь», — поэтому у каждого
          варианта в подписи указано, сколько текста он показывает сразу и сколько прячет.
        </p>
        <p className="mt-2 max-w-[70ch] text-[13px] leading-relaxed text-white/40">
          Ассеты: 3D-рендеры из первой партии (лежали без дела, шесть штук в одном стиле),
          фотографии из «Для кого» и кадр стадиона. Тексты модулей — черновые, их подтверждает
          заказчик.
        </p>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-[repeat(auto-fill,min(430px,100%))] items-start justify-center gap-x-6 gap-y-11">
        <Frame
          n="01"
          name="Аккордеон"
          why="Шесть модулей свёрнуты в один экран, подробности раскрываются по нажатию. Самый честный способ показать много содержания и не растянуть страницу."
          tags={['без картинок', '~1 экран', 'нужен JS']}
        >
          <V01 />
        </Frame>
        <Frame
          n="02"
          name="Досье с рендером"
          why="Рендер слева, текст справа, стороны чередуются. Тот же приём, что в «Для кого», — страница читается одной системой."
          tags={['6 рендеров', '~3 экрана', 'ассеты готовы']}
        >
          <V02 />
        </Frame>
        <Frame
          n="03"
          name="Таймлайн"
          why="Модули нанизаны на вертикальную линию: видно, что это путь с началом и концом, а не список тем."
          tags={['без картинок', '~2 экрана', 'рисуется кодом']}
        >
          <V03 />
        </Frame>
        <Frame
          n="04"
          name="Табы"
          why="Номера модулей строкой сверху, содержимое одного — под ними. Занимает один экран независимо от числа модулей."
          tags={['6 рендеров', '~0,8 экрана', 'нужен JS']}
        >
          <V04 />
        </Frame>
        <Frame
          n="05"
          name="Свайп-лента"
          why="Карточки листаются пальцем, край следующей виден. Плотно, но часть модулей вне первого взгляда."
          tags={['6 рендеров', '~0,9 экрана', 'часть скрыта']}
        >
          <V05 />
        </Frame>
        <Frame
          n="06"
          name="Сетка 2×3"
          why="Шесть плиток разом: объём курса считывается мгновенно, но текста в плитку влезает мало."
          tags={['6 рендеров', '~1,3 экрана', 'короткие тексты']}
        >
          <V06 />
        </Frame>
        <Frame
          n="07"
          name="Реестр"
          why="Строгий список с номерами, уроками и сроками — как расписание сборов. Без картинок вообще, работает шрифт и разлиновка."
          tags={['без картинок', '~1 экран', 'ассеты не нужны']}
        >
          <V07 />
        </Frame>
        <Frame
          n="08"
          name="Постеры"
          why="Модуль во всю ширину с фотографией и номером поверх. Самый киношный вариант и самый длинный."
          tags={['6 фото', '~4 экрана', 'нужны новые фото']}
        >
          <V08 />
        </Frame>
        <Frame
          n="09"
          name="Ступени"
          why="Модули поднимаются лесенкой слева направо — рост виден буквально, без слова «рост»."
          tags={['без картинок', '~1,6 экрана', 'рисуется кодом']}
        >
          <V09 />
        </Frame>
        <Frame
          n="10"
          name="Тактическая доска"
          why="Модули расставлены по полю, как позиции в схеме. Самый тематичный вариант, но порядок чтения задаёт не список, а расстановка."
          tags={['без картинок', '~1,2 экрана', 'рисуется кодом']}
        >
          <V10 />
        </Frame>
      </div>
    </div>
  )
}

/* ── Обвязка макетной ─────────────────────────────────────────────────── */

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
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[13px] font-bold tracking-wide text-[#6AA0FF] tabular-nums">{n}</span>
          <h2 className="text-[17px] font-bold tracking-[-.01em]">{name}</h2>
        </div>
        <p className="text-[13.5px] leading-snug text-white/52">{why}</p>
        <div className="mt-0.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-[5px] border border-white/14 px-2 py-0.5 text-[11.5px] text-white/45">
              {tag}
            </span>
          ))}
        </div>
      </figcaption>

      {/* Кадр макета: та же ширина и фон, что у секции на живой странице. */}
      <div className="overflow-hidden rounded-[10px] border border-white/12 bg-[#0c141d] px-5 pb-11 pt-8">
        <Eyebrow line={false} className="text-[10px]">
          Программа курса
        </Eyebrow>
        <h3 className="section-title mt-2.5 text-[32px] uppercase leading-[.94] tracking-title">
          Шесть модулей
        </h3>
        <p className="mt-3 max-w-[330px] text-[12.5px] leading-[1.6] text-white/70">
          Путь от модели игры до управления людьми — в том порядке, в котором тренер принимает
          решения по ходу сезона.
        </p>
        {children}
      </div>
    </figure>
  )
}

/* ── 01 Аккордеон ─────────────────────────────────────────────────────── */

function V01() {
  const [open, setOpen] = useState<string | null>(PROGRAM[0].num)

  return (
    <ol className="mt-6 flex flex-col">
      {PROGRAM.map((m) => {
        const isOpen = open === m.num
        return (
          <li key={m.num} className="border-t border-white/10 last:border-b">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : m.num)}
              className="flex w-full items-center gap-3 py-4 text-left"
            >
              <span className="segment-index shrink-0 text-[13px] leading-none">{m.num}</span>
              <span className="section-title flex-1 text-[16px] uppercase leading-[1.05] tracking-title">
                {m.title}
              </span>
              <span
                aria-hidden="true"
                className={`shrink-0 text-[18px] leading-none text-[#6AA0FF] transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : ''
                }`}
              >
                +
              </span>
            </button>

            {/* Раскрытие через grid-rows — единственный способ анимировать
                высоту без замера в JS. */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-1 text-[12px] leading-[1.55] text-white/70">{m.summary}</p>
                <ul className="pb-4 pt-2">
                  {topics(m).map((p) => (
                    <li key={p} className="flex gap-2 py-1 text-[11.5px] leading-[1.45] text-white/58">
                      <span aria-hidden="true" className="mt-[6px] size-1 shrink-0 rounded-full bg-[#6AA0FF]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* ── 02 Досье с рендером ──────────────────────────────────────────────── */

function V02() {
  return (
    <ul className="mt-6 flex flex-col gap-4">
      {PROGRAM.map((m, i) => {
        const flipped = i % 2 === 1
        return (
          <li key={m.num} className={`flex items-center gap-3 ${flipped ? 'flex-row-reverse' : ''}`}>
            <div className="relative size-[104px] shrink-0">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-[radial-gradient(60%_60%_at_50%_45%,rgba(30,91,255,.28),transparent_72%)]"
              />
              <img src={m.image} alt="" className="relative h-full w-full object-contain" />
            </div>
            <div className={flipped ? 'text-right' : ''}>
              <span className="segment-index block text-[12px] leading-none">{m.num}</span>
              <h4 className="section-title mt-1 text-[17px] uppercase leading-[1.04] tracking-title">{m.title}</h4>
              <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{m.summary}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ── 03 Таймлайн ──────────────────────────────────────────────────────── */

function V03() {
  return (
    <ol className="relative mt-6 pl-8">
      {/* Линия проходит через все точки и гаснет к низу — путь не обрывается
          рубленым краем, а растворяется. */}
      <span
        aria-hidden="true"
        className="absolute left-[11px] top-2 bottom-6 w-px bg-[linear-gradient(180deg,rgba(106,160,255,.55)_0%,rgba(106,160,255,.28)_62%,transparent_100%)]"
      />
      {PROGRAM.map((m) => (
        <li key={m.num} className="relative pb-6 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-8 top-1 flex size-[23px] items-center justify-center rounded-full border border-[#6AA0FF]/45 bg-[#0c141d] text-[10px] font-bold text-[#6AA0FF] tabular-nums"
          >
            {m.num}
          </span>
          <h4 className="section-title text-[16px] uppercase leading-[1.05] tracking-title">{m.title}</h4>
          <p className="mt-1.5 text-[11.5px] leading-[1.5] text-white/62">{m.summary}</p>
          <p className="mt-1.5 text-[10.5px] uppercase tracking-[.12em] text-white/34">
            {lessonsLabel(m)} · {m.duration}
          </p>
        </li>
      ))}
    </ol>
  )
}

/* ── 04 Табы ──────────────────────────────────────────────────────────── */

function V04() {
  const [active, setActive] = useState(0)
  const m = PROGRAM[active]

  return (
    <div className="mt-6">
      <div className="flex gap-1.5">
        {PROGRAM.map((item, i) => (
          <button
            key={item.num}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-1 rounded-[6px] border py-2 text-[12px] font-bold tabular-nums transition-colors ${
              i === active
                ? 'border-[#6AA0FF]/60 bg-[#6AA0FF]/12 text-[#6AA0FF]'
                : 'border-white/12 text-white/40'
            }`}
          >
            {item.num}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3.5">
        <div className="relative size-[92px] shrink-0">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-[radial-gradient(60%_60%_at_50%_45%,rgba(30,91,255,.3),transparent_70%)]"
          />
          <img src={m.image} alt="" className="relative h-full w-full object-contain" />
        </div>
        <div>
          <h4 className="section-title text-[18px] uppercase leading-[1.04] tracking-title">{m.title}</h4>
          <p className="mt-1.5 text-[11.5px] leading-[1.5] text-white/64">{m.summary}</p>
        </div>
      </div>

      <ul className="mt-3">
        {topics(m).map((p) => (
          <li key={p} className="flex gap-2 border-t border-white/8 py-2 text-[11.5px] leading-[1.45] text-white/60">
            <span aria-hidden="true" className="mt-[6px] size-1 shrink-0 rounded-full bg-[#6AA0FF]" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 05 Свайп-лента ───────────────────────────────────────────────────── */

function V05() {
  return (
    // -mx-5 + px-5: лента едет от края экрана, но первая карточка стоит
    // по колонке текста.
    <div className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
      {PROGRAM.map((m) => (
        <article
          key={m.num}
          className="w-[228px] shrink-0 snap-start rounded-[14px] border border-white/10 bg-[linear-gradient(160deg,rgba(18,29,44,.9),rgba(9,14,21,.9))] p-4"
        >
          <div className="relative mx-auto size-[96px]">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl bg-[radial-gradient(60%_60%_at_50%_45%,rgba(30,91,255,.32),transparent_70%)]"
            />
            <img src={m.image} alt="" className="relative h-full w-full object-contain" />
          </div>
          <span className="segment-index mt-3 block text-[12px] leading-none">{m.num}</span>
          <h4 className="section-title mt-1 text-[16px] uppercase leading-[1.05] tracking-title">{m.title}</h4>
          <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/60">{m.summary}</p>
        </article>
      ))}
    </div>
  )
}

/* ── 06 Сетка 2×3 ─────────────────────────────────────────────────────── */

function V06() {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-2.5">
      {PROGRAM.map((m) => (
        <li
          key={m.num}
          className="rounded-[12px] border border-white/10 bg-[linear-gradient(160deg,rgba(18,29,44,.8),rgba(9,14,21,.8))] p-3"
        >
          <div className="relative mx-auto size-[74px]">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl bg-[radial-gradient(60%_60%_at_50%_45%,rgba(30,91,255,.3),transparent_70%)]"
            />
            <img src={m.image} alt="" className="relative h-full w-full object-contain" />
          </div>
          <span className="segment-index mt-2 block text-[11px] leading-none">{m.num}</span>
          <h4 className="section-title mt-1 text-[13.5px] uppercase leading-[1.08] tracking-title">{m.title}</h4>
          <p className="mt-1 text-[10.5px] uppercase tracking-[.1em] text-white/34">{lessonsLabel(m)}</p>
        </li>
      ))}
    </ul>
  )
}

/* ── 07 Реестр ────────────────────────────────────────────────────────── */

function V07() {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between border-b border-white/14 pb-2 text-[10px] uppercase tracking-[.14em] text-white/34">
        <span>Модуль</span>
        <span>Объём</span>
      </div>
      <ol>
        {PROGRAM.map((m) => (
          <li key={m.num} className="flex items-start justify-between gap-3 border-b border-white/8 py-3">
            <div className="flex gap-3">
              <span className="segment-index pt-0.5 text-[12px] leading-none">{m.num}</span>
              <div>
                <h4 className="font-badge text-[13px] font-extrabold uppercase leading-[1.15] tracking-[.03em] text-white">
                  {m.title}
                </h4>
                <p className="mt-1 max-w-[210px] text-[11px] leading-[1.4] text-white/55">{m.summary}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11.5px] font-bold text-white/80 tabular-nums">{m.lessons.length}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[.1em] text-white/34">уроков</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] leading-[1.5] text-white/45">
        Всего 43 урока, около 8 недель в комфортном темпе. Доступ остаётся после окончания.
      </p>
    </div>
  )
}

/* ── 08 Постеры ───────────────────────────────────────────────────────── */

function V08() {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {PROGRAM.slice(0, 3).map((m, i) => (
        <article key={m.num} className="relative h-[196px] overflow-hidden rounded-[14px] border border-white/10">
          <img src={PHOTOS[i]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,11,.15)_0%,rgba(5,8,11,.72)_58%,rgba(5,8,11,.94)_100%)]"
          />
          <span className="absolute right-3 top-2 font-display text-[46px] font-extrabold leading-none text-white/12 tabular-nums">
            {m.num}
          </span>
          <div className="absolute inset-x-4 bottom-3.5">
            <h4 className="section-title text-[19px] uppercase leading-[1.02] tracking-title">{m.title}</h4>
            <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/72">{m.summary}</p>
          </div>
        </article>
      ))}
      <p className="text-[11px] text-white/40">
        Дальше ещё три модуля — в живой секции список продолжается, здесь обрезан для примерки.
      </p>
    </div>
  )
}

/* ── 09 Ступени ───────────────────────────────────────────────────────── */

function V09() {
  return (
    <ol className="mt-6">
      {PROGRAM.map((m, i) => (
        <li
          key={m.num}
          // Каждая ступень сдвинута вправо и приподнята: лестница читается
          // без единой картинки. Сдвиг маленький (10px), иначе последние
          // модули упираются в правый край колонки.
          style={{ marginLeft: `${i * 10}px` }}
          className="relative border-l-2 border-[#6AA0FF]/45 pb-3 pl-3.5 last:pb-0"
        >
          <div className="rounded-r-[10px] bg-[linear-gradient(90deg,rgba(30,91,255,.14),transparent_78%)] py-2 pl-2.5 pr-3">
            <div className="flex items-baseline gap-2">
              <span className="segment-index text-[12px] leading-none">{m.num}</span>
              <h4 className="section-title text-[15.5px] uppercase leading-[1.05] tracking-title">{m.title}</h4>
            </div>
            <p className="mt-1 text-[11px] leading-[1.45] text-white/58">{m.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ── 10 Тактическая доска ─────────────────────────────────────────────── */

function V10() {
  // Позиции подобраны как расстановка 1-2-2-1: модули читаются снизу вверх,
  // от философии в основании до работы с людьми впереди.
  const SPOTS = [
    { left: '50%', top: '84%' },
    { left: '22%', top: '64%' },
    { left: '78%', top: '64%' },
    { left: '26%', top: '40%' },
    { left: '74%', top: '40%' },
    { left: '50%', top: '16%' },
  ]

  return (
    <div className="mt-6">
      <div className="relative h-[330px] overflow-hidden rounded-[12px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,22,34,.9),rgba(7,12,18,.9))]">
        <img
          src={stadiumPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[.16]"
        />
        {/* Разметка поля: центральный круг и штрафные, тонкой линией. */}
        <svg viewBox="0 0 390 330" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <rect x="8" y="8" width="374" height="314" fill="none" stroke="rgba(190,210,230,.14)" />
          <line x1="8" y1="165" x2="382" y2="165" stroke="rgba(190,210,230,.14)" />
          <ellipse cx="195" cy="165" rx="52" ry="46" fill="none" stroke="rgba(190,210,230,.14)" />
          <rect x="112" y="8" width="166" height="52" fill="none" stroke="rgba(190,210,230,.14)" />
          <rect x="112" y="270" width="166" height="52" fill="none" stroke="rgba(190,210,230,.14)" />
        </svg>

        {PROGRAM.map((m, i) => (
          <div
            key={m.num}
            style={SPOTS[i]}
            className="absolute w-[132px] -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <span className="mx-auto flex size-7 items-center justify-center rounded-full border border-[#6AA0FF]/50 bg-[#0c141d] text-[11px] font-bold text-[#6AA0FF] tabular-nums">
              {m.num}
            </span>
            <h4 className="section-title mt-1 text-[12.5px] uppercase leading-[1.08] tracking-title">{m.title}</h4>
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-[11px] leading-[1.5] text-white/45">
        Подробности модулей открываются по нажатию на позицию — в макетной не собрано.
      </p>
    </div>
  )
}
