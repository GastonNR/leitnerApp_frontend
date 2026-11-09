import { useState, type CSSProperties } from 'react'
import { useAsignaturas } from '../../context/AsignaturasContext'
import { useAuth } from '../../../auth/context/AuthContext'
import { venceHoy } from '../../utils/fechas'
import Study_mode from './Study_mode'
import styles from './css/studyHero.module.css'

// Panel "Hoy": cuántas tarjetas tocan, de qué cajas vienen y el botón para estudiar.
export default function StudyHero() {
    const { asignaturas, temaActivo, tarjetasDeHoy, setModalTemasAbierto } = useAsignaturas()
    const { usuario } = useAuth()
    const [estudiando, setEstudiando] = useState<boolean>(false)

    if (!temaActivo) {
        // Sin asignaturas, o con asignaturas pero todavía sin temas
        const sinAsignaturas = asignaturas.length === 0
        return (
            <section className={`${styles.panel} ${styles.vacio}`}>
                <span className={styles.iconoVacio} aria-hidden="true">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2" />
                        <path d="M8 8h6M8 12h4" />
                    </svg>
                </span>
                <h1 className={styles.titulo}>
                    Hola, {usuario?.nombre ?? 'de nuevo'}. {sinAsignaturas ? 'Crea tu primera asignatura' : 'Crea tu primer tema'}
                </h1>
                <p className={styles.texto}>
                    Organiza lo que estudias en asignaturas (por ejemplo <em>Inglés</em> o <em>Biología</em>) y
                    divide cada una en temas (<em>Verbos irregulares</em>, <em>La célula</em>…). Cada tema tiene
                    sus propias 5 cajas: le agregas tarjetas y empiezas a repasar.
                </p>
                <button type="button" className={styles.boton} onClick={() => setModalTemasAbierto(true)}>
                    {sinAsignaturas ? 'Crear asignatura' : 'Crear tema'}
                </button>
            </section>
        )
    }

    const totalTarjetas = temaActivo.cajas.reduce((acc, c) => acc + (c.tarjetas?.length ?? 0), 0)
    const vencidasPorCaja = temaActivo.cajas.map(c => (c.tarjetas ?? []).filter(venceHoy).length)
    const vencidas = vencidasPorCaja.reduce((a, b) => a + b, 0)
    const hayParaEstudiar = tarjetasDeHoy.length > 0

    let titulo: string
    let texto: string
    if (vencidas > 0) {
        titulo = `${vencidas} tarjeta${vencidas !== 1 ? 's' : ''} para repasar`
        texto = 'Repásalas ahora, antes de que se te olviden. Al terminar, cada tarjeta pasa a su nueva caja.'
    } else if (hayParaEstudiar) {
        titulo = 'Estás al día'
        texto = `No hay repasos pendientes. Si quieres, puedes practicar las ${tarjetasDeHoy.length} tarjeta${tarjetasDeHoy.length !== 1 ? 's' : ''} de la caja 1.`
    } else if (totalTarjetas === 0) {
        titulo = 'Este tema está vacío'
        texto = 'Agrega tu primera tarjeta en la pestaña «Nueva tarjeta».'
    } else {
        titulo = 'Estás al día'
        texto = 'Hoy no te toca repasar nada. Vuelve mañana.'
    }

    const fecha = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })

    return (
        <section className={styles.panel} aria-labelledby="titulo-hoy">
            <div className={styles.contenido}>
                <p className={styles.fecha}>Hoy · {fecha}</p>
                <h1 id="titulo-hoy" className={styles.titulo}>{titulo}</h1>
                <p className={styles.texto}>{texto}</p>

                {vencidas > 0 && (
                    <ul className={styles.desglose} aria-label="Tarjetas para hoy por caja">
                        {vencidasPorCaja.map((n, i) => n > 0 && (
                            <li key={i} style={{ '--box-color': `var(--d-box-${i + 1})` } as CSSProperties}>
                                Caja {i + 1}: <strong>{n}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                type="button"
                className={styles.boton}
                onClick={() => setEstudiando(true)}
                disabled={!hayParaEstudiar}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" />
                </svg>
                {vencidas > 0 ? 'Empezar a estudiar' : 'Practicar caja 1'}
            </button>

            {estudiando && <Study_mode setModalStudyCard={setEstudiando} />}
        </section>
    )
}
