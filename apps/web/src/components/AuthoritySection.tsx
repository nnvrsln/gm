import { useRef, useState } from 'react'
import { AUTHORITY_QUOTES, AUTHORITY_TITLE, type AuthorityQuote } from '../data/authority'
import { ArrowRightIcon } from './icons'

export function AuthoritySection() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const goTo = (index: number) => {
    const el = track.current
    const card = el?.children[index] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({
      left: card.offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const syncActive = () => {
    const el = track.current
    if (!el) return
    const origin = (el.children[0] as HTMLElement).offsetLeft
    let nearest = 0
    let distance = Infinity
    Array.from(el.children).forEach((card, index) => {
      const delta = Math.abs((card as HTMLElement).offsetLeft - origin - el.scrollLeft)
      if (delta < distance) {
        nearest = index
        distance = delta
      }
    })
    setActive(nearest)
  }

  return (
    <section id="authority" aria-labelledby="authority-title" className="section-rhythm relative z-10 px-5">
      <h2 id="authority-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        {AUTHORITY_TITLE}
      </h2>
      <ul id="authority-quotes" ref={track} className="press-track"
        aria-label="Высказывания о Гаджи Гаджиеве" tabIndex={0} onScroll={syncActive}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            goTo(Math.max(0, Math.min(AUTHORITY_QUOTES.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1))))
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            goTo(event.key === 'Home' ? 0 : AUTHORITY_QUOTES.length - 1)
          }
        }}>
        {AUTHORITY_QUOTES.map((item, index) => (
          <li key={item.name} className="press-slide" aria-label={`${index + 1} из ${AUTHORITY_QUOTES.length}`}>
            <Publication item={item} />
          </li>
        ))}
      </ul>
      <div className="press-controls">

        <div className="press-pagination" aria-label="Выбрать высказывание">
          {AUTHORITY_QUOTES.map((item, index) => (
            <button key={item.name} type="button" aria-label={`Высказывание: ${item.name}`}
              aria-current={active === index ? 'true' : undefined} aria-controls="authority-quotes"
              onClick={() => goTo(index)}><span /></button>
          ))}
        </div>
        <div className="press-arrows">
          <button type="button" aria-label="Предыдущее высказывание" disabled={active === 0}
            aria-controls="authority-quotes" onClick={() => goTo(active - 1)}>
            <ArrowRightIcon className="size-[18px] rotate-180" />
          </button>
          <button type="button" aria-label="Следующее высказывание" disabled={active === AUTHORITY_QUOTES.length - 1}
            aria-controls="authority-quotes" onClick={() => goTo(active + 1)}>
            <ArrowRightIcon className="size-[18px]" />
          </button>
        </div>
      </div>
    </section>
  )
}

function Publication({ item }: { item: AuthorityQuote }) {
  const split = item.quote.search(/[.!?](?:\s|$)/) + 1
  const lead = split > 0 ? item.quote.slice(0, split) : item.quote
  const [firstName, ...surname] = item.name.split(' ')
  return (
    <figure className="press-publication">
      <figcaption className="press-byline">
        <div className="press-author">
          <h3><span>{firstName}</span>{surname.join(' ')}</h3>
          <p>{item.role}</p>
        </div>
        <div className="press-portrait">
          <img src={item.photo} alt={item.name} loading="lazy" width={212} height={296} />
        </div>
      </figcaption>
      <blockquote className="press-quote">
        <p className="press-lead"><span aria-hidden="true">«</span>{lead}<span aria-hidden="true">»</span></p>
      </blockquote>
    </figure>
  )
}

