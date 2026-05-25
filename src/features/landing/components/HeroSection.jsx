import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../css/hero.module.css'
import illustration from '../assets/illustration.svg'

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <h1 className={styles.title}>Memoriza más rápido con el sistema Leitner</h1>
        <p className={styles.subtitle}>
          Organiza tus tarjetas inteligentes y estudia solo lo que necesitas recordar.
        </p>

        <div className={styles.ctas}>
          <Link to="/registro" className={styles.primary}>Comenzar gratis</Link>
          <a className={styles.ghost} href="#how">Ver cómo funciona</a>
        </div>
      </div>

      <div className={styles.visual}>
        <img src={illustration} alt="Mockup de flashcards" />
      </div>
    </section>
  )
}
