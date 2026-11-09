import { ReactNode } from "react"
import { useLecciones } from "../../context/LeccionesContext"
import styles from './leitnerAppLayout.module.css'

interface LeitnerAppLayoutProps{
  header: ReactNode
  hero: ReactNode
  boxes: ReactNode
  calendar: ReactNode
  createNewCardComponent: ReactNode
}

// Panel de estudio. En escritorio las 5 cajas quedan fijas en una columna a la
// izquierda (siempre a mano) y el resto del contenido se desplaza a la derecha.
// En móvil se apila: hoy, cajas, nueva tarjeta y calendario.
export default function LeitnerAppLayout({ header, hero, boxes, calendar, createNewCardComponent }: LeitnerAppLayoutProps) {
  const { leccionActiva } = useLecciones()

  return (
    <div className={`dashboard ${styles.page}`}>
      {header}
      <main className={`${styles.main} ${leccionActiva ? '' : styles.sinLeccion}`}>
        <div className={styles.hero}>{hero}</div>
        {leccionActiva && (
          <>
            <aside className={styles.boxes} aria-label="Tus cajas">
              <div className={styles.boxesSticky}>{boxes}</div>
            </aside>
            <div className={styles.create}>{createNewCardComponent}</div>
            <div className={styles.calendar}>{calendar}</div>
          </>
        )}
      </main>
    </div>
  )
}
