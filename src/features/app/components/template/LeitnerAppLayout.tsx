import { ReactNode } from "react"
import { useLecciones } from "../../context/LeccionesContext"
import { venceHoy } from "../../utils/fechas"
import Pestanas from "../molecules/Pestanas"
import styles from './leitnerAppLayout.module.css'

interface LeitnerAppLayoutProps{
  header: ReactNode
  hero: ReactNode
  boxes: ReactNode
  calendar: ReactNode
  createNewCardComponent: ReactNode
}

const iconoNueva = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const iconoRepaso = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

// Panel de estudio a pantalla completa (escritorio): cabecera arriba, las 5 cajas
// en una barra lateral a la izquierda y, a la derecha, dos pestañas:
// "Nueva tarjeta" y "Repaso y calendario". Nada hace scroll a nivel de página.
// En pantallas chicas se apila y la página vuelve a desplazarse con normalidad.
export default function LeitnerAppLayout({ header, hero, boxes, calendar, createNewCardComponent }: LeitnerAppLayoutProps) {
  const { leccionActiva } = useLecciones()

  if (!leccionActiva) {
    return (
      <div className={`dashboard ${styles.page}`}>
        {header}
        <main className={styles.sinLeccion}>{hero}</main>
      </div>
    )
  }

  const vencidas = leccionActiva.cajas.reduce((n, c) => n + (c.tarjetas ?? []).filter(venceHoy).length, 0)

  return (
    <div className={`dashboard ${styles.page}`}>
      {header}
      <div className={styles.cuerpo}>
        <aside className={styles.sidebar} aria-label="Tus cajas">
          {boxes}
        </aside>

        <main className={styles.main}>
          <Pestanas
            etiqueta="Secciones del panel"
            inicial="repaso"
            claveGuardado="pestana_panel"
            pestanas={[
              {
                id: 'nueva',
                titulo: 'Nueva tarjeta',
                icono: iconoNueva,
                contenido: createNewCardComponent,
              },
              {
                id: 'repaso',
                titulo: 'Repaso y calendario',
                icono: iconoRepaso,
                contador: vencidas,
                contenido: (
                  <div className={styles.repaso}>
                    <div className={styles.hero}>{hero}</div>
                    <div className={styles.calendar}>{calendar}</div>
                  </div>
                ),
              },
            ]}
          />
        </main>
      </div>
    </div>
  )
}
