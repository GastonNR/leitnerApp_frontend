import type { CSSProperties } from "react"
import type { BoxProps } from "../../types/components.types"
import styles from "./css/box.module.css"

// Una caja de la columna lateral: número, frecuencia, cantidad, cuántas tocan hoy
// y una barra proporcional para comparar las cajas de un vistazo.
export default function Box({ caja, periodo, datosCaja, pendientesHoy, maximo, setEstiloDisplay, setIndiceCaja }: BoxProps) {

  const cantidadTarjetas = datosCaja?.tarjetas?.length || 0
  const relleno = Math.round((cantidadTarjetas / maximo) * 100)

  function seleccionarCaja() {
    setEstiloDisplay(true)
    setIndiceCaja(caja)
  }

  return (
    <button
      type="button"
      className={styles.box}
      style={{ '--box-color': `var(--d-box-${caja})` } as CSSProperties}
      onClick={seleccionarCaja}
      data-box={caja}
      aria-label={`Caja ${caja}, ${periodo.toLowerCase()}: ${cantidadTarjetas} tarjeta${cantidadTarjetas !== 1 ? 's' : ''}${pendientesHoy > 0 ? `, ${pendientesHoy} para hoy` : ''}. Ver tarjetas`}
    >
      <span className={styles.numero}>{caja}</span>

      <span className={styles.info}>
        <span className={styles.fila}>
          <span className={styles.nombre}>Caja {caja}</span>
          <span id={`box-${caja}-count`} className={styles.cantidad}>{cantidadTarjetas}</span>
        </span>
        <span className={styles.fila}>
          <span className={styles.periodo}>{periodo}</span>
          {pendientesHoy > 0 && <span className={styles.hoy}>{pendientesHoy} hoy</span>}
        </span>
        <span className={styles.barra} aria-hidden="true">
          <span style={{ width: `${relleno}%` }} />
        </span>
      </span>
    </button>
  )
}
