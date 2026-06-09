import Circle from '../atoms/Circle'
import { useLecciones } from '../../context/LeccionesContext'
import styles from './css/calendar.module.css'
import { useState } from 'react'
import clsx from 'clsx'

const PATRON_CALENDARIO: boolean[][] = [
  // D1     D2     D3     D4     D5     D6     D7     D8     D9     D10    D11    D12    D13    D14    D15    D16
  [ true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true  ], // Caja 1
  [ true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false ], // Caja 2
  [ false, true,  false, false, false, true,  false, false, false, true,  false, false, false, true,  false, false ], // Caja 3
  [ false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false ], // Caja 4
  [ false, false, false, false, false, false, false, false, false, false, false, true,  false, false, false, false ], // Caja 5
]

const CAJAS = ['Caja 1', 'Caja 2', 'Caja 3', 'Caja 4', 'Caja 5']
const DIAS = 16

export default function Calendar() {
  const { leccionActiva } = useLecciones()
  const [colResaltada, setColResaltada] = useState<number | null>(null)

  if (!leccionActiva) return null

  return (
    <div className={styles.contenedor_calendario}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th className={styles.th_nivel}>Nivel</th>
            {Array.from({ length: DIAS }, (_, i) => (
              <th
                key={i}
                className={clsx(
                  styles.th_dia,
                  colResaltada === i && styles.col_hover
                )}
              >
                Día {i + 1}
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
                {Array.from({ length: DIAS }, (_, i) => {
                  const activo = PATRON_CALENDARIO[cajaIdx][i]
                  return (
                    <td
                      key={i}
                      className={clsx(
                        styles.celda,
                        colResaltada === i && styles.col_hover
                      )}
                      onMouseEnter={() => setColResaltada(i)}
                      onMouseLeave={() => setColResaltada(null)}
                    >
                      {activo &&  (
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
  )
}