import { useEffect, useMemo, useState } from 'react'
import { useAsignaturas } from '../../context/AsignaturasContext'
import { getRepasosService } from '../../services/estudio.service'
import type { Repaso } from '../../types/context.types'
import { masAvanzado, masPracticadoSemana, progresoTema, racha, ultimaSemana } from '../../utils/metricas'
import styles from './css/metricas.module.css'

// Alcanza para la racha y la semana; una racha más larga se muestra igual
// hasta donde llega el historial pedido.
const DIAS_HISTORIAL = 90

function mensajeRacha(dias: number, estudioHoy: boolean): { titulo: string, texto: string } {
    if (dias === 0) return { titulo: 'Empieza tu racha hoy', texto: 'Un repaso corto cada día es lo que más ayuda a recordar.' }
    const titulo = `${dias} ${dias === 1 ? 'día' : 'días'} seguidos estudiando`
    if (!estudioHoy) return { titulo, texto: 'Repasa hoy para no cortar la racha.' }
    if (dias === 1) return { titulo, texto: '¡Buen comienzo! Vuelve mañana para seguir sumando.' }
    return { titulo, texto: '¡Muy bien! La constancia es lo que hace que se te quede.' }
}

// Pestaña "Métricas": un resumen amable de cómo vas, sin números de más.
export default function Metricas() {
    const { asignaturas, versionRepasos } = useAsignaturas()
    const [repasos, setRepasos] = useState<Repaso[]>([])

    // Se vuelve a pedir después de cada sesión guardada o tema borrado.
    // Si falla, la pestaña sigue mostrando el progreso de los temas.
    useEffect(() => {
        let vigente = true
        getRepasosService(DIAS_HISTORIAL)
            .then(datos => { if (vigente) setRepasos(datos) })
            .catch(error => console.error('Error al cargar el historial', error))
        return () => { vigente = false }
    }, [versionRepasos])

    const semana = useMemo(() => ultimaSemana(repasos), [repasos])
    const diasRacha = useMemo(() => racha(repasos), [repasos])
    const practicado = useMemo(() => masPracticadoSemana(asignaturas, repasos), [asignaturas, repasos])
    const avanzado = useMemo(() => masAvanzado(asignaturas), [asignaturas])

    const { titulo, texto } = mensajeRacha(diasRacha, semana[semana.length - 1]?.estudio ?? false)

    return (
        <div className={styles.metricas}>
            <section className={styles.tarjeta} aria-labelledby="titulo-racha">
                <h2 id="titulo-racha" className={styles.titulo}>{titulo}</h2>
                <p className={styles.texto}>{texto}</p>
                <ol className={styles.semana} aria-label="Tus últimos 7 días">
                    {semana.map(d => (
                        <li key={d.dia} className={d.esHoy ? styles.hoy : ''}>
                            <span className={`${styles.punto} ${d.estudio ? styles.estudio : ''}`} aria-hidden="true">
                                {d.estudio && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                                    </svg>
                                )}
                            </span>
                            <span className={styles.inicial} aria-hidden="true">{d.esHoy ? 'Hoy' : d.inicial}</span>
                            <span className={styles.soloLectores}>{d.nombre}: {d.estudio ? 'estudiaste' : 'sin repaso'}</span>
                        </li>
                    ))}
                </ol>
            </section>

            {(practicado || avanzado) && (
                <div className={styles.destacados}>
                    {practicado && (
                        <section className={styles.destacado}>
                            <h3>Lo que más practicaste esta semana</h3>
                            <p className={styles.destacadoTema}>{practicado.tema.nombre}</p>
                            <p className={styles.destacadoAsignatura}>{practicado.asignatura.nombre}</p>
                        </section>
                    )}
                    {avanzado && (
                        <section className={styles.destacado}>
                            <h3>Tu tema más avanzado</h3>
                            <p className={styles.destacadoTema}>{avanzado.tema.nombre}</p>
                            <p className={styles.destacadoAsignatura}>{avanzado.asignatura.nombre}</p>
                        </section>
                    )}
                </div>
            )}

            <section className={styles.tarjeta} aria-labelledby="titulo-temas">
                <h2 id="titulo-temas" className={styles.titulo}>Tus temas</h2>
                <p className={styles.texto}>Una tarjeta está aprendida cuando llega a la caja 4.</p>
                {asignaturas.filter(a => a.temas.length > 0).map(asignatura => (
                    <div key={asignatura._id} className={styles.asignatura}>
                        <h3 className={styles.asignaturaNombre}>{asignatura.nombre}</h3>
                        <ul className={styles.temas}>
                            {asignatura.temas.map(tema => {
                                const { total, aprendidas } = progresoTema(tema)
                                const porcentaje = total > 0 ? Math.round((aprendidas / total) * 100) : 0
                                return (
                                    <li key={tema._id}>
                                        <div className={styles.temaFila}>
                                            <span className={styles.temaNombre}>{tema.nombre}</span>
                                            <span className={styles.temaCuenta}>
                                                {total === 0 ? 'Sin tarjetas todavía' : `${aprendidas} de ${total} aprendidas`}
                                            </span>
                                        </div>
                                        <span
                                            className={styles.barra}
                                            role="progressbar"
                                            aria-label={`Progreso de ${tema.nombre}`}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={porcentaje}
                                        >
                                            <span style={{ width: `${porcentaje}%` }} />
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </section>
        </div>
    )
}
