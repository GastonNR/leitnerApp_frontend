import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../css/cta.module.css'

export default function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={styles.inner}>
        <h2>Empieza a entrenar tu memoria hoy</h2>
        <p>Únete y comienza a memorizar de forma eficiente con LeitnerApp.</p>
        <Link to="/registro" className={styles.primary}>Crear una cuenta gratis</Link>
      </div>
    </section>
  )
}
