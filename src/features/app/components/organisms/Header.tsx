import { useNavigate, Link } from 'react-router-dom'
import { useLecciones } from '../../context/LeccionesContext'
import { useAuth } from '../../../auth/context/AuthContext'
import LeccionesModal from './LeccionesModal'
import styles from './css/header.module.css'

export default function Header() {
  const navigate = useNavigate()
  const { leccionActiva, setModalLeccionesAbierto, modalLeccionesAbierto } = useLecciones()
  const { logout, usuario } = useAuth()

  const nombre = usuario?.nombre ?? 'Usuario'

  const cerrarSesion = (): void => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>

          <Link to="/" className={styles.brand} aria-label="LeitnerApp, ir al inicio">
            <img src="/logo.svg" alt="" width="34" height="34" />
            <span className={styles.brandText}>Leitner<span>App</span></span>
          </Link>

          {/* Selector de lección: abre el modal de lecciones */}
          <button
            type="button"
            className={styles.leccion}
            onClick={() => setModalLeccionesAbierto(true)}
            aria-haspopup="dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2" />
              <path d="M8 8h6M8 12h4" />
            </svg>
            <span className={styles.leccionTexto}>
              <span className={styles.leccionEtiqueta}>Lección activa</span>
              <span className={styles.leccionNombre}>{leccionActiva?.nombre ?? 'Elegir lección'}</span>
            </span>
            <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">{nombre.charAt(0).toUpperCase()}</span>
            <span id="user-name" className={styles.userName}>{nombre}</span>
            <button type="button" className={styles.logout} onClick={cerrarSesion} aria-label="Cerrar sesión" title="Cerrar sesión">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                <path d="M10 17l-5-5 5-5M5 12h11" />
              </svg>
              <span className={styles.logoutTexto}>Salir</span>
            </button>
          </div>

        </div>
      </header>
      {modalLeccionesAbierto && <LeccionesModal />}
    </>
  )
}
