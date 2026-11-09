import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import styles from './css/pestanas.module.css'

export interface Pestana {
    id: string
    titulo: string
    icono?: ReactNode
    /* Número opcional junto al título (por ejemplo, tarjetas para hoy). */
    contador?: number
    contenido: ReactNode
}

interface PestanasProps {
    pestanas: Pestana[]
    inicial: string
    /* Clave de localStorage para recordar la última pestaña abierta. */
    claveGuardado?: string
    etiqueta: string
}

function leerGuardada(clave: string | undefined, validas: string[]): string | null {
    if (!clave) return null
    try {
        const valor = localStorage.getItem(clave)
        return valor && validas.includes(valor) ? valor : null
    } catch {
        return null
    }
}

// Pestañas accesibles (patrón WAI-ARIA tabs): flechas para moverse, Inicio/Fin,
// Todos los paneles quedan montados y los inactivos se ocultan, así no se
// pierde lo que se estaba haciendo en uno (p. ej. una tarjeta a medio escribir).
export default function Pestanas({ pestanas, inicial, claveGuardado, etiqueta }: PestanasProps) {
    const ids = pestanas.map(p => p.id)
    const [activa, setActiva] = useState<string>(() => leerGuardada(claveGuardado, ids) ?? inicial)
    const botones = useRef<Record<string, HTMLButtonElement | null>>({})

    const actual = pestanas.find(p => p.id === activa) ?? pestanas[0]

    function elegir(id: string, enfocar = false) {
        setActiva(id)
        if (claveGuardado) {
            try { localStorage.setItem(claveGuardado, id) } catch { /* sin almacenamiento */ }
        }
        if (enfocar) botones.current[id]?.focus()
    }

    function teclado(e: KeyboardEvent<HTMLDivElement>) {
        const i = ids.indexOf(actual.id)
        let destino: number | null = null
        if (e.key === 'ArrowRight') destino = (i + 1) % ids.length
        if (e.key === 'ArrowLeft') destino = (i - 1 + ids.length) % ids.length
        if (e.key === 'Home') destino = 0
        if (e.key === 'End') destino = ids.length - 1
        if (destino === null) return
        e.preventDefault()
        elegir(ids[destino], true)
    }

    return (
        <div className={styles.pestanas}>
            <div role="tablist" aria-label={etiqueta} className={styles.lista} onKeyDown={teclado}>
                {pestanas.map(p => {
                    const seleccionada = p.id === actual.id
                    return (
                        <button
                            key={p.id}
                            ref={el => { botones.current[p.id] = el }}
                            type="button"
                            role="tab"
                            id={`tab-${p.id}`}
                            aria-selected={seleccionada}
                            aria-controls={`panel-${p.id}`}
                            tabIndex={seleccionada ? 0 : -1}
                            className={`${styles.tab} ${seleccionada ? styles.tabActiva : ''}`}
                            onClick={() => elegir(p.id)}
                        >
                            {p.icono && <span className={styles.icono} aria-hidden="true">{p.icono}</span>}
                            {p.titulo}
                            {!!p.contador && <span className={styles.contador}>{p.contador}</span>}
                        </button>
                    )
                })}
            </div>

            {pestanas.map(p => (
                <div
                    key={p.id}
                    role="tabpanel"
                    id={`panel-${p.id}`}
                    aria-labelledby={`tab-${p.id}`}
                    className={styles.panel}
                    hidden={p.id !== actual.id}
                >
                    {p.contenido}
                </div>
            ))}
        </div>
    )
}
