import { useRef, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'
import styles from './css/divisor.module.css'

interface DivisorProps {
    /* "horizontal": línea horizontal entre dos paneles apilados (reparte el alto).
       "vertical": línea vertical entre dos columnas (reparte el ancho). */
    orientacion?: 'horizontal' | 'vertical'
    /* Contenedor cuyo alto (o ancho) se reparte entre los dos paneles */
    contenedor: RefObject<HTMLElement | null>
    /* Proporción para el primer panel: el de arriba o el de la izquierda (0 a 1) */
    valor: number
    onCambiar: (valor: number) => void
    min?: number
    max?: number
    /* Valor al hacer doble click (o Enter) */
    inicial?: number
    etiqueta: string
    controla: string
}

const PASO = 0.05

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

// Divisor arrastrable entre dos paneles.
// Mouse/touch: arrastrar. Teclado: flechas (arriba/abajo o izquierda/derecha según
// la orientación), Inicio/Fin, Enter para volver al reparto inicial.
// Doble click: vuelve al reparto inicial.
export default function Divisor({ orientacion = 'horizontal', contenedor, valor, onCambiar, min = 0.2, max = 0.8, inicial = 0.5, etiqueta, controla }: DivisorProps) {
    const arrastrando = useRef(false)
    const vertical = orientacion === 'vertical'

    function proporcionEn(clientX: number, clientY: number): number | null {
        const caja = contenedor.current?.getBoundingClientRect()
        if (!caja) return null
        const [pos, inicio, largo] = vertical ? [clientX, caja.left, caja.width] : [clientY, caja.top, caja.height]
        if (largo === 0) return null
        return limitar((pos - inicio) / largo, min, max)
    }

    function alPresionar(e: PointerEvent<HTMLDivElement>) {
        if (e.button !== 0) return
        e.preventDefault()
        arrastrando.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    function alMover(e: PointerEvent<HTMLDivElement>) {
        if (!arrastrando.current) return
        const v = proporcionEn(e.clientX, e.clientY)
        if (v !== null) onCambiar(v)
    }

    function alSoltar(e: PointerEvent<HTMLDivElement>) {
        arrastrando.current = false
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    }

    function alTeclear(e: KeyboardEvent<HTMLDivElement>) {
        let nuevo: number | null = null
        const [menos, mas] = vertical ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown']
        if (e.key === menos) nuevo = valor - PASO
        if (e.key === mas) nuevo = valor + PASO
        if (e.key === 'Home') nuevo = min
        if (e.key === 'End') nuevo = max
        if (e.key === 'Enter') nuevo = inicial
        if (nuevo === null) return
        e.preventDefault()
        onCambiar(limitar(nuevo, min, max))
    }

    return (
        <div
            role="separator"
            aria-orientation={orientacion}
            aria-label={etiqueta}
            aria-controls={controla}
            aria-valuemin={Math.round(min * 100)}
            aria-valuemax={Math.round(max * 100)}
            aria-valuenow={Math.round(valor * 100)}
            tabIndex={0}
            title="Arrastra para repartir el espacio (doble click: mitad y mitad)"
            className={`${styles.divisor} ${vertical ? styles.vertical : ''}`}
            onPointerDown={alPresionar}
            onPointerMove={alMover}
            onPointerUp={alSoltar}
            onPointerCancel={alSoltar}
            onDoubleClick={() => onCambiar(inicial)}
            onKeyDown={alTeclear}
        >
            <span className={styles.agarre} aria-hidden="true" />
        </div>
    )
}
