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

  // Generamos las 64 fechas desde la creación de la lección
  const fechas = useMemo<Date[]>(() => {
    if (!leccionActiva?.fechaCreacion) return []
    const inicio = new Date(leccionActiva.fechaCreacion)
    inicio.setHours(0, 0, 0, 0)
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
    <div className={styles.contenedor_calendario}>
      <div className={styles.scroll_wrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th className={styles.th_nivel}>Nivel</th>
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
    </div>
  )
}