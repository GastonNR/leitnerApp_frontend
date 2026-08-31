import { ReactNode } from "react"
import styles from './leitnerAppLayout.module.css'

interface LeitnerAppLayoutProps{
  header: ReactNode
  sidebar: ReactNode
  calendar: ReactNode
  createNewCardComponent: ReactNode
}

export default function LeitnerAppLayout({ header, sidebar, calendar, createNewCardComponent}: LeitnerAppLayoutProps) {
  return (
    <div className={styles.leitnerAppLayout}>
      <div className={styles.header_grid}>{header}</div>
      <div className={styles.sidebar_grid}>{sidebar}</div>
      {/* Calendario y formulario en una sola área: así la altura del
          sidebar no reparte espacio entre ellos ni abre huecos. */}
      <div className={styles.contenido_grid}>
        <div className={styles.calendar_grid}>{calendar}</div>
        <div className={styles.createNewCard_grid}>{createNewCardComponent}</div>
      </div>
    </div>
  )
}
