import { useEffect, useRef } from 'react'

/**
 * Появление элементов при скролле. Наблюдаем через IntersectionObserver —
 * слушатель scroll здесь дал бы непрерывные reflow и просадку на мобильном.
 * Элементы помечаются атрибутом data-reveal.
 *
 * **Со страницы снят 31.08 по просьбе владельца и сейчас не вызывается
 * ниоткуда.** Вместе с ним удалены CSS-правила [data-reveal], .is-in и
 * .reveal-child и сами атрибуты в разметке, так что одного возврата вызова
 * в App будет мало — без правил хук просто вешает класс, на который ничто не
 * реагирует. Текст удалённых правил лежит в docs/tz/05-STATE.md.
 */
export function useReveal<T extends HTMLElement>() {
  const root = useRef<T>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const targets = el.querySelectorAll<HTMLElement>('[data-reveal]')

    // Уважаем системную настройку: показываем сразу, без движения.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((t) => t.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return root
}
