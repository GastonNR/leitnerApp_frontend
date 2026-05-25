import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../css/header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#g)" />
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className={styles.title}>LeitnerApp</span>
      </div>

      <nav className={styles.nav}>
        <a href="#features">Funciones</a>
        <a href="#how">Cómo funciona</a>
        <a href="#pricing">Precios</a>
      </nav>

      <div className={styles.actions}>
        <Link to="/login">
          <button className={styles.login}>Iniciar sesión</button>
        </Link>
        <Link to="/registro">
          <button className={styles.primary}>Crear cuenta</button>
        </Link>
      </div>
    </header>
  )
}
