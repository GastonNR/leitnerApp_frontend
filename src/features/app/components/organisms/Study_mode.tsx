import { createPortal } from 'react-dom'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useLecciones } from '../../context/LeccionesContext'
import type { Leccion, Tarjeta } from '../../types/context.types'
import StudyCard from './StudyCard'
import CerrarModal from '../molecules/CerrarModal'
import modal from './css/modal.module.css'
import styles from './css/studyMode.module.css'

interface Study_modeProps {
    setModalStudyCard: Dispatch<SetStateAction<boolean>>
}

type Fase = 'estudiando' | 'guardando' | 'guardada' | 'error'

export default function Study_mode({ setModalStudyCard }: Study_modeProps) {

    const { tarjetasDeHoy, leccionActiva, actualizarTarjeta, guardar } = useLecciones()

    // Las tarjetas de la sesión se fijan al abrir: al guardar, la lección cambia
    // y tarjetasDeHoy se recalcula, pero la sesión en curso no debe moverse.
    const [sesion] = useState<Tarjeta[]>(() => tarjetasDeHoy)
    const [indice, setIndice] = useState<number>(0)
    const [aciertos, setAciertos] = useState<number>(0)
    const [fase, setFase] = useState<Fase>(sesion.length > 0 ? 'estudiando' : 'guardada')
    const [ocupado, setOcupado] = useState<boolean>(false)
    const pendientes = useRef<Leccion[] | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    useEffect(() => () => clearTimeout(timer.current), [])

    const cerrar = () => setModalStudyCard(false)

    const guardarSesion = async (leccionesActualizadas: Leccion[]) => {
        pendientes.current = leccionesActualizadas
        setFase('guardando')
        const resultado = await guardar(leccionesActualizadas)
        setFase(resultado?.ok ? 'guardada' : 'error')
    }

    const responder = async (esCorrecta: boolean) => {
        if (ocupado) return
        setOcupado(true)
        if (esCorrecta) setAciertos(a => a + 1)

        const leccionesActualizadas = await actualizarTarjeta(esCorrecta, sesion[indice])

        if (indice < sesion.length - 1) {
            timer.current = setTimeout(() => {
                setIndice(i => i + 1)
                setOcupado(false)
            }, 450)
            return
        }

        setIndice(sesion.length)
        setOcupado(false)
        await guardarSesion(leccionesActualizadas)
    }

    const respondidas = Math.min(indice, sesion.length)
    const progreso = sesion.length > 0 ? (respondidas / sesion.length) * 100 : 100
    const fallos = respondidas - aciertos

    return createPortal(
        <div className={`dashboard ${modal.overlay}`} onClick={fase === 'guardando' ? undefined : cerrar}>
            <div
                className={`${modal.panel} ${styles.panel}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="study-title"
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div className={styles.headerTexto}>
                        <span className={styles.eyebrow}>{leccionActiva?.nombre}</span>
                        <h2 id="study-title" className={styles.titulo}>Repaso de hoy</h2>
                    </div>
                    <CerrarModal className={styles.cerrar} onclick={cerrar} />
                </div>

                <div className={styles.progreso}>
                    <div className={styles.barra} role="progressbar" aria-valuenow={respondidas} aria-valuemin={0} aria-valuemax={sesion.length} aria-label="Progreso de la sesión">
                        <span style={{ width: `${progreso}%` }} />
                    </div>
                    <span id="cards-remaining" className={styles.contador}>{respondidas} / {sesion.length}</span>
                </div>

                <div className={styles.body}>
                    {fase === 'estudiando' && indice < sesion.length && (
                        <StudyCard
                            key={sesion[indice]._id}
                            tarjeta={sesion[indice]}
                            bloqueado={ocupado}
                            onResponder={responder}
                        />
                    )}

                    {fase !== 'estudiando' && (
                        <div id="study-empty" className={styles.final} aria-live="polite">
                            {sesion.length === 0 ? (
                                <>
                                    <span className={styles.finalIcono}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2" />
                                            <path d="M8 8h6M8 12h4" />
                                        </svg>
                                    </span>
                                    <h3 className={styles.finalTitulo}>No hay tarjetas para estudiar hoy</h3>
                                    <p className={styles.finalTexto}>Crea nuevas tarjetas o vuelve mañana para seguir con tus repasos.</p>
                                </>
                            ) : (
                                <>
                                    <span className={`${styles.finalIcono} ${fase === 'error' ? styles.finalIconoError : ''}`}>
                                        {fase === 'error' ? (
                                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M12 8v5M12 16.5v.01" />
                                            </svg>
                                        ) : fase === 'guardando' ? (
                                            <span className={styles.spinner} aria-hidden="true" />
                                        ) : (
                                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                                            </svg>
                                        )}
                                    </span>
                                    <h3 className={styles.finalTitulo}>
                                        {fase === 'guardando' && 'Guardando tu sesión…'}
                                        {fase === 'guardada' && '¡Sesión completada!'}
                                        {fase === 'error' && 'No se pudo guardar la sesión'}
                                    </h3>

                                    <dl className={styles.resumen}>
                                        <div className={styles.ok}>
                                            <dt>Lo sabías</dt>
                                            <dd>{aciertos}</dd>
                                        </div>
                                        <div className={styles.ko}>
                                            <dt>A repasar</dt>
                                            <dd>{fallos}</dd>
                                        </div>
                                    </dl>

                                    <p className={styles.finalTexto}>
                                        {fase === 'error'
                                            ? 'Revisa tu conexión e inténtalo de nuevo. Tus respuestas no se perdieron.'
                                            : 'Las acertadas subieron de caja y las falladas volvieron a la caja 1.'}
                                    </p>
                                </>
                            )}

                            <div className={styles.finalAcciones}>
                                {fase === 'error' && pendientes.current && (
                                    <button type="button" className={styles.botonPrimario} onClick={() => guardarSesion(pendientes.current!)}>
                                        Reintentar
                                    </button>
                                )}
                                {fase !== 'guardando' && (
                                    <button type="button" className={fase === 'error' ? styles.botonSecundario : styles.botonPrimario} onClick={cerrar}>
                                        Volver al panel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
