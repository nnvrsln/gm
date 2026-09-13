import coachStand from '../assets/coach-stand.webp'
import { ACHIEVEMENTS } from '../data/achievements'
import { Eyebrow } from './Eyebrow'

export function CoachSection() {
  return (
    <section
      id="coach"
      aria-labelledby="coach-title"
      className="section-rhythm relative z-10 overflow-hidden px-5"
    >
      <div className="pointer-events-none absolute inset-0">
        <img
          src={coachStand}
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none object-cover object-[78%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.95)_0%,rgba(5,8,11,.9)_42%,rgba(5,8,11,.62)_57%,rgba(5,8,11,.14)_71%,transparent_84%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,.34)_0%,rgba(0,0,0,.5)_16%,#000_30%,#000_100%)] [-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.34)_0%,rgba(0,0,0,.5)_16%,#000_30%,#000_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,#0c141d_0%,rgba(12,20,29,.62)_46%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent_0%,rgba(11,18,26,.72)_54%,#0b121a_100%)]" />
      </div>

      <div className="relative">
        <Eyebrow line={false} className="text-[10px]">
          Автор обучения
        </Eyebrow>
        <h2 id="coach-title" className="section-title mt-2 text-[30px] uppercase leading-[.92] tracking-title">
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
                width={36}
                height={36}
                className="mt-0.5 size-9 shrink-0 select-none rounded-lg"
              />
              <div className="min-w-0">
                <p
                  style={{ fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }}
                  className="text-[15px] uppercase leading-[1.05] tracking-title text-white"
                >
                  {item.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.3] text-white/55">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
