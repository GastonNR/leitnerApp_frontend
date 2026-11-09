import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import styles from '../css/cta.module.css'

export default function CTASection() {
  const { token } = useAuth()

  return (
    <section className={styles.cta}>
      <div className="l-container">
        <div className={styles.inner} data-reveal>
          <div className={styles.glow} aria-hidden="true" />
          <h2>Tu memoria, entrenada cada día</h2>
          <p>Crea tu primera lección en un minuto y empieza a recordar lo que estudias.</p>
          <Link to={token ? '/leitnerApp' : '/registro'} className="l-btn l-btn-primary">
            {token ? 'Ir a mis lecciones' : 'Crear mi cuenta'}
          </Link>
        </div>
      </div>
    </section>
  )
}
