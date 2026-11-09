import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import logo from '../assets/logo.png'
import styles from '../css/header.module.css'

export default function Header() {
  const { token } = useAuth()
  const [conScroll, setConScroll] = useState(false)

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${conScroll ? styles.scrolled : ''}`}>
      <div className={`l-container ${styles.inner}`}>
        <a href="#inicio" className={styles.brand}>
          <img src={logo} alt="" width="40" height="40" className={styles.logo} />
          <span className={styles.title}>Leitner<span>App</span></span>
        </a>

        <nav className={styles.nav} aria-label="Secciones">
          <a href="#metodo">El método</a>
          <a href="#funciones">Funciones</a>
          <a href="#como-funciona">Cómo empezar</a>
        </nav>

        <div className={styles.actions}>
          {token ? (
            <Link to="/leitnerApp" className="l-btn l-btn-primary">Ir a mis lecciones</Link>
          ) : (
            <>
              <Link to="/login" className={styles.login}>Iniciar sesión</Link>
              <Link to="/registro" className={`l-btn l-btn-primary ${styles.cta}`}>Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
