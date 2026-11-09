import Circle from '../atoms/Circle'
import { useLecciones } from '../../context/LeccionesContext'
import styles from './css/calendar.module.css'
import { useState, useMemo } from 'react'
import clsx from 'clsx'

const PATRON_CALENDARIO: boolean[][] = [
  [ true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true  ],
  [ true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false ],
  [ false, true,  false, false, false, true,  false, false, false, true,  false, false, false, true,  false, false ],
  [ false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false ],
  [ false, false, false, false, false, false, false, false, false, false, false, true,  false, false, false, false ],
]

const CAJAS        = ['Caja 1', 'Caja 2', 'Caja 3', 'Caja 4', 'Caja 5']
const TOTAL_DIAS   = 64
const DIAS_VISIBLES = 16

// Extiende el patrón de 16 días a N días repitiéndolo
function extenderPatron(patron: boolean[], totalDias: number): boolean[] {
  return Array.from({ length: totalDias }, (_, i) => patron[i % patron.length])
}

function formatearFecha(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}`
}

export default function Calendar() {
  const { leccionActiva } = useLecciones()
  const [colResaltada, setColResaltada] = useState<number | null>(null)

  // Generamos 64 fechas a partir de la creación de la lección. Si la lección ya tiene más
  // de 64 días, la ventana avanza en bloques de 16 días (el período del patrón) para que
  // hoy siempre sea visible y el patrón conserve su fase.
  const fechas = useMemo<Date[]>(() => {
    if (!leccionActiva?.fechaCreacion) return []
    const creacion = new Date(leccionActiva.fechaCreacion)
    creacion.setHours(0, 0, 0, 0)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const diasDesdeCreacion = Math.max(0, Math.round((hoy.getTime() - creacion.getTime()) / 86_400_000))
    const desplazamiento = diasDesdeCreacion >= TOTAL_DIAS
      ? Math.floor(diasDesdeCreacion / DIAS_VISIBLES) * DIAS_VISIBLES
      : 0
    const inicio = new Date(creacion)
    inicio.setDate(creacion.getDate() + desplazamiento)
    return Array.from({ length: TOTAL_DIAS }, (_, i) => {
      const fecha = new Date(inicio)
      fecha.setDate(inicio.getDate() + i)
      return fecha
    })
  }, [leccionActiva?.fechaCreacion])

  // Índice del día de hoy dentro del rango de la lección
  const diaHoyIdx = useMemo<number | null>(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const idx = fechas.findIndex(f => f.getTime() === hoy.getTime())
    return idx >= 0 ? idx : null
  }, [fechas])

  // Patrón extendido a 64 días para cada caja
  const patronExtendido = useMemo<boolean[][]>(() => {
    return PATRON_CALENDARIO.map(fila => extenderPatron(fila, TOTAL_DIAS))
  }, [])

  if (!leccionActiva) return null

  return (
    <section className={styles.contenedor_calendario} aria-labelledby="titulo-calendario">
      <div className={styles.head}>
        <div>
          <h2 id="titulo-calendario" className={styles.titulo}>Calendario de repaso</h2>
          <p className={styles.texto}>Qué cajas conviene repasar cada día desde que creaste la lección. El número es la cantidad de tarjetas en esa caja.</p>
        </div>
        {diaHoyIdx !== null && <span className={styles.leyendaHoy}>Hoy</span>}
      </div>
      <div className={styles.scroll_wrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th className={styles.th_nivel}>Caja</th>
              {fechas.map((fecha, i) => (
                <th
                  key={i}
                  className={clsx(
                    styles.th_dia,
                    colResaltada === i && styles.col_hover,
                    diaHoyIdx === i && styles.col_hoy
                  )}
                >
                  {formatearFecha(fecha)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {CAJAS.map((label, cajaIdx) => {
              const cantidadTarjetas = leccionActiva.cajas[cajaIdx]?.tarjetas.length ?? 0

              return (
                <tr key={label}>
                  <td className={styles.nivel_caja}>{label}</td>
                  {Array.from({ length: TOTAL_DIAS }, (_, i) => {
                    const activo = patronExtendido[cajaIdx][i]
                    return (
                      <td
                        key={i}
                        className={clsx(
                          styles.celda,
                          colResaltada === i && styles.col_hover,
                          diaHoyIdx === i && styles.col_hoy
                        )}
                        onMouseEnter={() => setColResaltada(i)}
                        onMouseLeave={() => setColResaltada(null)}
                      >
                        {activo && (
                          <Circle
                            resaltado={clsx('cant_cards', `cant_cards_${cajaIdx + 1}`)}
                            cantidadTarjetas={cantidadTarjetas}
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}