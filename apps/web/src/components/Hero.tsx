import heroPhoto from '../assets/hero-gadzhiev.webp'
import signature from '../assets/signature.webp'

export function Hero() {
  return (
    <section className="section-rhythm relative isolate overflow-hidden pt-[168px]">
      <img
        src={heroPhoto}
        alt="Гаджи Гаджиев на стадионе"
        className="photo-sharp-down pointer-events-none absolute -top-[10px] left-[-6%] z-0 w-[112%] max-w-none select-none brightness-[1.16] saturate-[1.06]"
      />
      <img
        src={heroPhoto}
        alt=""
        aria-hidden="true"
        className="photo-blur-down pointer-events-none absolute -top-[10px] left-[-6%] z-0 w-[112%] max-w-none select-none brightness-[1.16] saturate-[1.06]"
      />

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(100deg,rgba(5,8,11,.74)_0%,rgba(5,8,11,.26)_56%,transparent_94%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[2] h-60 bg-[linear-gradient(180deg,transparent_0%,rgba(3,5,8,.32)_46%,rgba(2,5,9,.84)_84%,#070d15_100%)]" />

      <div className="relative z-10 px-5">
        <p className="max-w-[300px] font-badge text-[11px] font-bold uppercase leading-[1.4] tracking-[.04em] text-white/58">
          Практическая система подготовки от{' '}
          <span className="font-extrabold text-white">Гаджиева Гаджи Муслимовича</span>
        </p>
        <img
          src={signature}
          alt="Подпись Гаджи Гаджиева"
          className="signature mt-3 block w-[152px] select-none"
        />

        <h1 className="hero-title mt-5 text-[22px] uppercase leading-[1.18] tracking-title">
          <span>
            На<span className="stress-acute">у</span>читесь выстраивать системную подготовку команды — от плана на сезон до
            отдельного занятия, управлять нагрузкой и корректировать работу с учётом
            состояния игроков и задач команды
          </span>
        </h1>

        <div className="mt-9 flex">
          <a href="#program" className="btn-hero btn-hero-primary w-full">
            Узнать программу
          </a>
        </div>
      </div>
    </section>
  )
}
