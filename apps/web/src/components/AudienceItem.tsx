import type { AudienceCard } from '../data/audience'

export function AudienceItem({ card }: { card: AudienceCard }) {
  return (
    <li className="relative h-[370px] w-[268px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/12 bg-panel">
      <img
        src={card.image}
        alt={card.alt}
        loading="lazy"
        style={{
          objectPosition: card.position,
          transform: card.zoom ? `scale(${card.zoom})` : undefined,
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(9,17,28,.3)_36%,rgba(10,19,31,.74)_46%,rgba(11,21,34,.8)_70%,rgba(11,21,34,.78)_100%)]"
      />

      <div className="absolute inset-x-0 bottom-0 top-[172px] p-4">
        <h3 className="section-title text-[17px] uppercase leading-[1.06] tracking-title">
          {card.title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.5] text-white/85">{card.detail}</p>
      </div>
    </li>
  )
}
