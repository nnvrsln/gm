import type { ReactNode } from 'react'
import boardImage from '../assets/111.png'
import strikerImage from '../assets/222.png'
import standingImage from '../assets/333.png'
import stadiumImage from '../assets/444.png'
import { AUDIENCE } from '../data/audience'
import { Eyebrow } from '../components/Eyebrow'

/**
 * Макетная секции «Для кого этот курс»: десять раскладок одного и того же
 * содержимого рядом друг с другом. Живёт отдельной точкой входа
 * (variants.html → src/variants.tsx) и в прод-сборку не попадает —
 * Vite по умолчанию собирает только index.html.
 *
 * Варианты собраны на настоящих классах и токенах проекта, а не на копии
 * стилей: выбранный можно переносить в AudienceSection почти как есть.
 */

/** Три сегмента живут в src/data/audience.ts — здесь только короткие подписи. */
const [PRO, ACADEMY, PLAYER] = AUDIENCE

/** Фотографии-плейсхолдеры под каждый сегмент. */
const PHOTO = {
  pro: boardImage,
  academy: strikerImage,
  player: standingImage,
  wide: stadiumImage,
} as const

export function AudienceVariants() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1400px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          Раскладки секции «Для кого этот курс»
        </h1>
        <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/58">
          Десять способов подать три сегмента аудитории на ширине мобильного макета (430&nbsp;px).
          Собраны на настоящих классах проекта, поэтому выбранный вариант переносится в{' '}
          <code className="rounded bg-white/8 px-1.5 py-0.5 text-[13px]">AudienceSection.tsx</code> почти
          как есть.
        </p>
        <p className="mt-2 text-[13px] text-white/40">
          Фотографии — текущие плейсхолдеры из <code>src/assets</code>, их предстоит заменить.
        </p>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-[repeat(auto-fill,min(430px,100%))] items-start justify-center gap-x-6 gap-y-11">
        <Frame n="01" name="Постеры" why="Кадр во всю карточку, текст внизу. Максимально выгодно для фотографий и ближе всего к кинематографичности первого экрана." tags={['3 фото', '~3 экрана', 'кадры вертикальные']}>
          <V01 />
        </Frame>
        <Frame n="02" name="Стартовый состав" why="Три фигуры выходят в ряд, как объявление состава, под ними — список. Самая футбольная метафора и компактная высота." tags={['3 PNG без фона', '~1,5 экрана', 'нужна прозрачность']}>
          <V02 />
        </Frame>
        <Frame n="03" name="Зигзаг" why="Кадр меняет сторону на каждом пункте. Живее ровной сетки, читается как разворот журнала." tags={['3 фото', '~2 экрана', 'кадры квадратные']}>
          <V03 />
        </Frame>
        <Frame n="04" name="Одно фото и список" why="Один сильный кадр вместо трёх, дальше — чистая типографика. Самый короткий вариант и самый дешёвый по ассетам." tags={['1 фото', '~1 экран', 'кадр широкий']}>
          <V04 />
        </Frame>
        <Frame n="05" name="Заявка на матч" why="Протокол состава: шапка, номера, строки. Фотографий нет вовсе — работает шрифт и разлиновка." tags={['без фото', '~0,8 экрана', 'ассеты не нужны']}>
          <V05 />
        </Frame>
        <Frame n="06" name="Стопка" why="Карточки наезжают друг на друга, как колода. Плотно по высоте, даёт глубину." tags={['3 фото', '~1 экран', 'фигура справа']}>
          <V06 />
        </Frame>
        <Frame n="07" name="Свайп с подглядыванием" why="Снова лента, но край следующей карточки виден — палец сам понимает, что можно листать." tags={['3 фото', '~0,8 экрана', 'часть контента скрыта']}>
          <V07 />
        </Frame>
        <Frame n="08" name="Мозаика" why="Три узких кадра стоят плечом к плечу одной лентой, подписи — единым блоком под ней." tags={['3 фото', '~1,2 экрана', 'кадры вертикальные']}>
          <V08 />
        </Frame>
        <Frame n="09" name="Номер на футболке" why="Огромная полупрозрачная цифра уходит за край строки, портрет — маленьким кругом." tags={['3 портрета', '~0,9 экрана', 'кадры лицом крупно']}>
          <V09 />
        </Frame>
        <Frame n="10" name="Расстановка" why="Три сегмента расставлены по схеме поля, как позиции в составе. Тематичнее всех и без фотографий." tags={['без фото', '~1,2 экрана', 'рисуется кодом']}>
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
      <div className="overflow-hidden rounded-[10px] border border-white/12 bg-[#060b10] px-5 pb-11 pt-8">
        <Eyebrow className="text-[10px]" lineClassName="w-6">
          Для кого этот курс
        </Eyebrow>
        <h3 className="section-title mt-2.5 text-[32px] uppercase leading-[.94] tracking-title">
          Этот курс для вас, если вы
        </h3>
        {children}
      </div>
    </figure>
  )
}

/* ── 01 Постеры ───────────────────────────────────────────────────────── */

function V01() {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {[
        { card: PRO, photo: PHOTO.academy },
        { card: ACADEMY, photo: PHOTO.player },
        { card: PLAYER, photo: PHOTO.pro },
      ].map(({ card, photo }) => (
        <article key={card.num} className="relative h-[270px] overflow-hidden rounded-[14px] border border-white/9">
          <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_34%,rgba(4,8,12,.82)_72%,#04080c_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-4 pb-[18px]">
            <span className="segment-index block text-[15px] leading-none">{card.num}</span>
            <h4 className="section-title mt-1.5 text-[22px] uppercase leading-[1.02] tracking-title">{card.title}</h4>
            <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

/* ── 02 Стартовый состав ──────────────────────────────────────────────── */

function V02() {
  return (
    <>
      <div className="relative mt-5 h-[190px] overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_50%_0%,#16283c_0%,#070d14_68%)]">
        <img src={PHOTO.wide} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 flex items-end justify-around px-1.5 pb-3.5">
          {/* Маска жёсткая: плейсхолдеры сняты с фоном и без неё читаются
              плитками. С настоящими PNG без фона она не понадобится. */}
          {[PHOTO.player, PHOTO.academy, PHOTO.player].map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt=""
              className={`h-[150px] w-[98px] object-contain object-bottom [mask-image:radial-gradient(52%_64%_at_50%_46%,#000_34%,transparent_96%)] [-webkit-mask-image:radial-gradient(52%_64%_at_50%_46%,#000_34%,transparent_96%)] ${
                index === 2 ? '-scale-x-100' : ''
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-x-3.5 bottom-2 h-px bg-[linear-gradient(90deg,transparent,rgba(106,160,255,.5),transparent)]" />
      </div>
      <CompactList className="mt-4" />
    </>
  )
}

/* ── 03 Зигзаг ────────────────────────────────────────────────────────── */

function V03() {
  return (
    <div className="mt-6 flex flex-col gap-[18px]">
      {[
        { card: PRO, photo: PHOTO.pro },
        { card: ACADEMY, photo: PHOTO.academy },
        { card: PLAYER, photo: PHOTO.player },
      ].map(({ card, photo }, index) => {
        const flip = index === 1

        return (
          <article key={card.num} className={`flex items-center gap-3.5 ${flip ? 'flex-row-reverse' : ''}`}>
            <div className="relative h-[132px] w-[150px] shrink-0 overflow-hidden rounded-xl ring-1 ring-inset ring-white/10">
              <img src={photo} alt="" className="h-full w-full object-cover" />
            </div>
            <div className={flip ? 'text-right' : ''}>
              <span className="segment-index block text-[14px] leading-none">{card.num}</span>
              <h4 className="section-title mt-1 text-[18px] uppercase leading-[1.04] tracking-title">{card.title}</h4>
              <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/* ── 04 Одно фото и список ────────────────────────────────────────────── */

function V04() {
  return (
    <>
      <div className="relative mt-5 h-[170px] overflow-hidden rounded-xl">
        <img src={PHOTO.wide} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,11,16,.9)_100%)]" />
      </div>
      <ul className="mt-1.5">
        {AUDIENCE.map((card, index) => (
          <li
            key={card.num}
            className={`flex gap-3.5 py-[15px] ${index < AUDIENCE.length - 1 ? 'border-b border-[rgba(190,210,230,.13)]' : ''}`}
          >
            <span className="segment-index pt-px text-[19px] leading-none">{card.num}</span>
            <div>
              <h4 className="section-title text-[17px] uppercase leading-[1.06] tracking-title">{card.title}</h4>
              <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

/* ── 05 Заявка на матч ────────────────────────────────────────────────── */

function V05() {
  return (
    <div className="mt-6 overflow-hidden rounded-[10px] border border-[rgba(190,210,230,.16)]">
      <div className="flex justify-between bg-[#1e5bff]/13 px-3.5 py-2.5 text-[9.5px] font-bold uppercase tracking-[.16em] text-white/50">
        <span>Состав</span>
        <span>Три позиции</span>
      </div>
      {AUDIENCE.map((card, index) => (
        <div
          key={card.num}
          className={`flex items-center gap-3.5 px-3.5 py-4 ${index > 0 ? 'border-t border-[rgba(190,210,230,.12)]' : ''}`}
        >
          <span className="segment-index min-w-[34px] text-[27px] leading-none">{card.num}</span>
          <div>
            <h4 className="section-title text-[16.5px] uppercase leading-[1.06] tracking-title">{card.title}</h4>
            <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── 06 Стопка ────────────────────────────────────────────────────────── */

function V06() {
  return (
    <div className="mt-6">
      {[
        { card: PRO, photo: PHOTO.pro },
        { card: ACADEMY, photo: PHOTO.academy },
        { card: PLAYER, photo: PHOTO.player },
      ].map(({ card, photo }, index) => (
        <article
          key={card.num}
          className={`relative h-[128px] overflow-hidden rounded-[14px] border border-white/11 shadow-[0_-12px_30px_rgba(0,0,0,.55)] ${
            index > 0 ? '-mt-3.5' : ''
          }`}
        >
          <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(92deg,rgba(5,9,14,.97)_6%,rgba(5,9,14,.7)_52%,transparent_92%)]" />
          <div className="relative w-[68%] px-4 pt-5">
            <span className="segment-index text-[13px] leading-none">{card.num}</span>
            <h4 className="section-title mt-1 text-[17px] uppercase leading-[1.04] tracking-title">{card.title}</h4>
            <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

/* ── 07 Свайп с подглядыванием ────────────────────────────────────────── */

function V07() {
  return (
    <>
      <div className="mt-6 flex gap-[11px] overflow-hidden">
        {[
          { card: PRO, photo: PHOTO.player },
          { card: ACADEMY, photo: PHOTO.academy },
        ].map(({ card, photo }) => (
          <article
            key={card.num}
            className="relative h-[230px] shrink-0 basis-[76%] overflow-hidden rounded-[14px] border border-white/10"
          >
            <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(4,8,12,.9)_88%)]" />
            <div className="absolute inset-x-0 bottom-0 p-3.5">
              <span className="segment-index text-[13px] leading-none">{card.num}</span>
              <h4 className="section-title mt-1 text-[18px] uppercase leading-[1.03] tracking-title">{card.title}</h4>
              <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        <i className="h-[7px] w-[22px] rounded-full bg-[#1e5bff]" />
        <i className="size-[7px] rounded-full bg-white/22" />
        <i className="size-[7px] rounded-full bg-white/22" />
      </div>
    </>
  )
}

/* ── 08 Мозаика ───────────────────────────────────────────────────────── */

function V08() {
  return (
    <>
      <div className="mt-5 grid grid-cols-3 gap-[7px]">
        {[PHOTO.pro, PHOTO.academy, PHOTO.player].map((photo, index) => (
          <figure key={index} className="relative m-0 aspect-[3/4] overflow-hidden rounded-[10px]">
            <img src={photo} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_46%,rgba(4,8,12,.88)_100%)]" />
            <span className="segment-index absolute bottom-1.5 left-2 text-[15px] leading-none">
              {AUDIENCE[index].num}
            </span>
          </figure>
        ))}
      </div>
      <ul className="mt-4">
        {AUDIENCE.map((card, index) => (
          <li key={card.num} className={`py-[11px] ${index > 0 ? 'border-t border-[rgba(190,210,230,.13)]' : ''}`}>
            <h4 className="section-title text-[16px] uppercase leading-[1.06] tracking-title">
              {card.num} — {card.title}
            </h4>
            <p className="mt-1 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

/* ── 09 Номер на футболке ─────────────────────────────────────────────── */

function V09() {
  return (
    <div className="mt-5 flex flex-col">
      {[
        { card: PRO, photo: PHOTO.player },
        { card: ACADEMY, photo: PHOTO.academy },
        { card: PLAYER, photo: PHOTO.pro },
      ].map(({ card, photo }, index) => (
        <article
          key={card.num}
          className={`relative flex items-center gap-3.5 overflow-hidden py-4 ${
            index > 0 ? 'border-t border-[rgba(190,210,230,.12)]' : ''
          }`}
        >
          <span
            aria-hidden="true"
            className="section-title pointer-events-none absolute -right-1.5 top-1/2 -translate-y-1/2 text-[96px] leading-none tracking-title opacity-[.14]"
          >
            {card.num}
          </span>
          <div className="relative size-[62px] shrink-0 overflow-hidden rounded-full border border-[#6AA0FF]/40">
            <img src={photo} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="relative">
            <h4 className="section-title text-[17px] uppercase leading-[1.04] tracking-title">{card.title}</h4>
            <p className="mt-1.5 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

/* ── 10 Расстановка ───────────────────────────────────────────────────── */

const PITCH_MARKS = [
  { num: '01', label: 'Профкоманды', left: '27%', top: '30%' },
  { num: '02', label: 'Академии', left: '64%', top: '26%' },
  { num: '03', label: 'Бывшие игроки', left: '45%', top: '72%' },
]

function V10() {
  return (
    <>
      <div className="relative mt-5 overflow-hidden rounded-xl border border-[rgba(190,210,230,.14)] bg-[linear-gradient(170deg,#0c1a17_0%,#070f14_78%)]">
        <svg viewBox="0 0 390 250" role="img" aria-label="Схема поля с тремя отмеченными позициями" className="block h-auto w-full">
          <g fill="none" stroke="rgba(190,210,230,.24)" strokeWidth="1.2">
            <rect x="14" y="12" width="362" height="226" rx="4" />
            <path d="M14 125h362" />
            <circle cx="195" cy="125" r="42" />
            <rect x="14" y="62" width="46" height="126" />
            <rect x="330" y="62" width="46" height="126" />
          </g>
          <circle cx="195" cy="125" r="3" fill="rgba(190,210,230,.4)" />
        </svg>
        {PITCH_MARKS.map((mark) => (
          <div
            key={mark.num}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: mark.left, top: mark.top }}
          >
            <span className="grid size-8 place-items-center rounded-full bg-[#1e5bff] font-[family-name:'Bebas_Neue_Cyrillic'] text-[15px] tracking-title text-white shadow-[0_0_0_4px_rgba(30,91,255,.22),0_6px_14px_rgba(0,0,0,.5)]">
              {mark.num}
            </span>
            <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[.1em] text-white/82 [text-shadow:0_1px_6px_rgba(0,0,0,.9)]">
              {mark.label}
            </span>
          </div>
        ))}
      </div>
      <CompactList className="mt-3.5" />
    </>
  )
}

/* ── Общий компактный список (варианты 02 и 10) ───────────────────────── */

function CompactList({ className = '' }: { className?: string }) {
  return (
    <ul className={className}>
      {AUDIENCE.map((card, index) => (
        <li
          key={card.num}
          className={`flex gap-3 py-[11px] ${index > 0 ? 'border-t border-[rgba(190,210,230,.14)]' : ''}`}
        >
          <span className="segment-index pt-px text-[16px] leading-none">{card.num}</span>
          <div>
            <h4 className="section-title text-[15.5px] uppercase leading-[1.06] tracking-title">{card.title}</h4>
            <p className="mt-1 text-[11.5px] leading-[1.45] text-white/62">{card.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
