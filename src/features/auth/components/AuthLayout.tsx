import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { AuthLayoutProps } from '../types/components.types'
import styles from '../css/auth.module.css'

const CAJAS = [
    { caja: 1, intervalo: '1 día', altura: 30 },
    { caja: 2, intervalo: '3 días', altura: 46 },
    { caja: 3, intervalo: '7 días', altura: 62 },
    { caja: 4, intervalo: '14 días', altura: 80 },
    { caja: 5, intervalo: '30 días', altura: 100 },
]

// Pantalla dividida: panel de marca a la izquierda (solo en escritorio) y formulario a la derecha.
export default function AuthLayout({ titulo, subtitulo, children, pie }: AuthLayoutProps) {
    return (
        <div className={`marca ${styles.page}`}>
            <aside className={styles.aside}>
                <div className={styles.glowA} aria-hidden="true" />
                <div className={styles.glowB} aria-hidden="true" />

                <Link to="/" className={styles.brand}>
                    <img src="/logo.svg" alt="" width="48" height="48" />
                    <span>Leitner<span>App</span></span>
                </Link>

                <div className={styles.asideBody}>
                    <h2 className={styles.asideTitle}>
                        Lo que estudias hoy,{' '}
                        <span className={styles.gradientText}>lo recuerdas mañana.</span>
                    </h2>
                    <p className={styles.asideText}>
                        Cada acierto sube la tarjeta una caja y alarga el tiempo hasta el próximo repaso.
                        Así estudias solo lo que estás por olvidar.
                    </p>

                    <ol className={styles.stairs} aria-label="Intervalo de repaso de cada caja">
                        {CAJAS.map(c => (
                            <li key={c.caja} style={{ '--h': `${c.altura}%`, '--box-color': `var(--l-box-${c.caja})` } as CSSProperties}>
                                <span className={styles.bar}><span>{c.caja}</span></span>
                                <span className={styles.interval}>{c.intervalo}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <p className={styles.asideFoot}>Repetición espaciada con el método Leitner</p>
            </aside>

            <main className={styles.main}>
                <div className={styles.topbar}>
                    <Link to="/" className={styles.mobileBrand}>
                        <img src="/logo.svg" alt="" width="40" height="40" />
                        <span>Leitner<span>App</span></span>
                    </Link>
                    <Link to="/" className={styles.back}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M19 12H5M11 6l-6 6 6 6" />
                        </svg>
                        Volver al inicio
                    </Link>
                </div>

                <div className={styles.card}>
                    <h1 className={styles.titulo}>{titulo}</h1>
                    <p className={styles.subtitulo}>{subtitulo}</p>
                    {children}
                    <div className={styles.pie}>{pie}</div>
                </div>
            </main>
        </div>
    )
}
