import { useEffect } from 'react'

// Marca con .is-visible los elementos [data-reveal] dentro de `ref` cuando entran en pantalla.
export default function useReveal(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const elementos = root.querySelectorAll('[data-reveal]')

    if (!('IntersectionObserver' in window)) {
      elementos.forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    elementos.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}
