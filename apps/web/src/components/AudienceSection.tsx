import { useRef, useState } from 'react'
import courseBg from '../assets/course-bg.webp'
import { AUDIENCE } from '../data/audience'
import { AudienceItem } from './AudienceItem'
import { ArrowRightIcon } from './icons'

export function AudienceSection() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const cardStep = () => {
    const el = track.current
    if (!el || el.children.length < 2) return 280
    const first = el.children[0].getBoundingClientRect().left
    const second = el.children[1].getBoundingClientRect().left
    return second - first
  }

  const onScroll = () => {
    const el = track.current
    if (!el) return
    setActive(Math.min(AUDIENCE.length - 1, Math.round(el.scrollLeft / cardStep())))
  }

  const goTo = (index: number) => {
    const el = track.current
    const card = el?.children[index] as HTMLElement | undefined
    if (!el || !card) return
    setActive(index)
    const shift = card.getBoundingClientRect().left - el.getBoundingClientRect().left
    el.scrollLeft = el.scrollLeft + shift - 20
  }

  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="section-rhythm relative z-10 overflow-hidden bg-[#0c141d] px-5"
    >
      <img
        src={courseBg}
        alt=""
        aria-hidden="true"
        data-stadium
        className="photo-sharp-up pointer-events-none absolute right-0 top-[-124px] z-0 w-[140%] max-w-none select-none brightness-[1.44] saturate-[1.14]"
      />
      <img
        src={courseBg}
        alt=""
        aria-hidden="true"
        className="photo-blur-up pointer-events-none absolute right-0 top-[-124px] z-0 w-[140%] max-w-none select-none brightness-[1.44] saturate-[1.14]"
      />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(100deg,rgba(5,8,11,.46)_0%,rgba(5,8,11,.13)_54%,rgba(5,8,11,0)_100%)] [mask-image:linear-gradient(180deg,#000_0%,#000_32%,rgba(0,0,0,.34)_66%,rgba(0,0,0,.18)_100%)] [-webkit-mask-image:linear-gradient(180deg,#000_0%,#000_32%,rgba(0,0,0,.34)_66%,rgba(0,0,0,.18)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-20 bg-[linear-gradient(180deg,rgba(2,5,9,.62)_0%,rgba(2,5,9,.3)_46%,transparent_100%)]" />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,transparent_0px,transparent_40px,rgba(5,8,11,.18)_72px,rgba(5,8,11,.42)_112px,rgba(5,8,11,.52)_180px,rgba(5,8,11,.46)_300px,transparent_430px)] [mask-image:linear-gradient(90deg,#000_0%,#000_62%,rgba(0,0,0,.72)_88%,rgba(0,0,0,.55)_100%)] [-webkit-mask-image:linear-gradient(90deg,#000_0%,#000_62%,rgba(0,0,0,.72)_88%,rgba(0,0,0,.55)_100%)]" />

      <div
        aria-hidden="true"
        style={{
          maskImage:
            'linear-gradient(180deg,transparent 0px,rgba(0,0,0,.55) 40px,#000 92px,#000 calc(100% - 52px),transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(180deg,transparent 0px,rgba(0,0,0,.55) 40px,#000 92px,#000 calc(100% - 52px),transparent 100%)',
          backgroundImage: [
            'radial-gradient(560px 470px at 400px 53%,rgba(112,164,236,.4) 0%,rgba(58,100,162,.22) 34%,rgba(22,40,66,.07) 64%,transparent 86%)',
            'radial-gradient(300px 290px at 0px 94%,rgba(70,112,182,.22) 0%,rgba(28,52,86,.1) 46%,transparent 82%)',
            'radial-gradient(430px 270px at 50% 90%,rgba(63,224,176,.09) 0%,rgba(32,120,104,.04) 46%,transparent 80%)',
            'radial-gradient(400px 360px at 0px 22%,rgba(84,132,206,.2) 0%,rgba(38,68,112,.09) 44%,transparent 80%)',
          ].join(','),
        }}
        className="pointer-events-none absolute inset-0 z-[3]"
      />

      <div className="relative z-10">
        <h2 id="audience-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
          Для кого?
        </h2>

        <ul
          ref={track}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label="Аудитории курса, листайте вбок"
          className="mt-6 -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-pl-5 px-5 pb-1 outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[#6AA0FF]/60 [&::-webkit-scrollbar]:hidden"
        >
          {AUDIENCE.map((card) => (
            <AudienceItem key={card.num} card={card} />
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Предыдущая аудитория"
            className="flex size-11 items-center justify-center rounded-full text-white/70 transition-opacity duration-150 active:opacity-60 disabled:opacity-25"
          >
            <ArrowRightIcon className="size-5 rotate-180" />
          </button>

          <div className="flex items-center gap-1">
            {AUDIENCE.map((card, index) => (
              <button
                key={card.num}
                type="button"
                onClick={() => goTo(index)}
                aria-label={card.title}
                aria-current={index === active}
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    index === active ? 'w-5 bg-[#6AA0FF]' : 'w-1.5 bg-white/25'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === AUDIENCE.length - 1}
            aria-label="Следующая аудитория"
            className="flex size-11 items-center justify-center rounded-full text-white/70 transition-opacity duration-150 active:opacity-60 disabled:opacity-25"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex">
          <a href="#program" className="btn-hero btn-hero-turf w-full">
            К программе
            <ArrowRightIcon className="size-5 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  )
}
