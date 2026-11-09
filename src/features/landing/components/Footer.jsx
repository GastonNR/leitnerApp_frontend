import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import styles from '../css/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`l-container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src={logo} alt="" width="32" height="32" />
          <span>Leitner<span>App</span></span>
        </div>

        <nav className={styles.links} aria-label="Pie de página">
          <a href="#metodo">El método</a>
          <a href="#funciones">Funciones</a>
          <a href="#como-funciona">Cómo empezar</a>
          <Link to="/login">Iniciar sesión</Link>
        </nav>
      </div>

      <div className={`l-container ${styles.copy}`}>
        © {new Date().getFullYear()} LeitnerApp
      </div>
    </footer>
  )
}
