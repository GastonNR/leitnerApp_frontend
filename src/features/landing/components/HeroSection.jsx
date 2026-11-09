import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import HeroDemo from './HeroDemo'
import styles from '../css/hero.module.css'

const datos = [
  { valor: '5 cajas', texto: 'por lección' },
  { valor: '1 → 30 días', texto: 'entre repasos' },
  { valor: 'Minutos', texto: 'de estudio al día' },
]

export default function HeroSection() {
  const { token } = useAuth()

  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.glowA} aria-hidden="true" />
      <div className={styles.glowB} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <div className={`l-container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.pill}>
            <span className={styles.dot} aria-hidden="true" />
            Repetición espaciada con el método Leitner
          </span>

          <h1 className={styles.title}>
            Estudia menos.
            <br />
            <span className="l-gradient-text">Recuerda más.</span>
          </h1>

          <p className={styles.subtitle}>
            LeitnerApp reparte tus tarjetas en 5 cajas y cada día te muestra solo las que
            necesitas repasar, justo antes de que se te olviden.
          </p>

          <div className={styles.ctas}>
            <Link to={token ? '/leitnerApp' : '/registro'} className="l-btn l-btn-primary">
              {token ? 'Ir a mis lecciones' : 'Empieza ahora'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#metodo" className="l-btn l-btn-ghost">Cómo funciona</a>
          </div>

          <dl className={styles.stats}>
            {datos.map(d => (
              <div key={d.valor} className={styles.stat}>
                <dt>{d.valor}</dt>
                <dd>{d.texto}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.visual}>
          <HeroDemo />
        </div>
      </div>
    </section>
  )
}
