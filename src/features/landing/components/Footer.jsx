import React from 'react'
import styles from '../css/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>LeitnerApp</div>
        <nav className={styles.links}>
          <a href="#">Características</a>
          <a href="#">Soporte</a>
          <a href="#">Privacidad</a>
        </nav>
      </div>

      <div className={styles.copy}>© {new Date().getFullYear()} LeitnerApp. Todos los derechos reservados.</div>
    </footer>
  )
}
