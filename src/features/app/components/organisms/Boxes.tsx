import { useState } from 'react'
import Box from '../molecules/Box'
import BoxModal from './BoxModal'
import { useLecciones } from '../../context/LeccionesContext'
import { venceHoy } from '../../utils/fechas'
import styles from './css/boxes.module.css'

const CAJAS = [
  { caja: '1', periodo: 'Cada día' },
  { caja: '2', periodo: 'Cada 3 días' },
  { caja: '3', periodo: 'Cada semana' },
  { caja: '4', periodo: 'Cada 2 semanas' },
  { caja: '5', periodo: 'Cada mes' },
]

export default function Boxes() {

  const [ estiloDisplay, setEstiloDisplay ] = useState<boolean>(false)
  const [ indiceCaja, setIndiceCaja ] = useState<string>('')
  const { leccionActiva } = useLecciones()

  const cajas = leccionActiva?.cajas ?? []
  const cantidades = CAJAS.map((_, i) => cajas[i]?.tarjetas?.length ?? 0)
  const total = cantidades.reduce((a, b) => a + b, 0)
  const maximo = Math.max(1, ...cantidades)
  const dominadas = cantidades[4]
  const progreso = total > 0 ? Math.round((dominadas / total) * 100) : 0

  return (
    <section className={styles.section} aria-labelledby="titulo-cajas">
      <div className={styles.head}>
        <h2 id="titulo-cajas" className={styles.titulo}>Tus cajas</h2>
        <span className={styles.total}>{total} tarjeta{total !== 1 ? 's' : ''}</span>
      </div>

      <ol className={styles.lista}>
        {CAJAS.map(({ caja, periodo }, i) => (
          <li key={caja}>
            <Box
              caja={caja}
              periodo={periodo}
              datosCaja={cajas[i]}
              pendientesHoy={(cajas[i]?.tarjetas ?? []).filter(venceHoy).length}
              maximo={maximo}
              setEstiloDisplay={setEstiloDisplay}
              setIndiceCaja={setIndiceCaja}
            />
          </li>
        ))}
      </ol>

      <div className={styles.pie}>
        <div className={styles.pieFila}>
          <span>Dominadas (caja 5)</span>
          <span className={styles.pieValor}>{dominadas} de {total}</span>
        </div>
        <div className={styles.barra} role="progressbar" aria-valuenow={progreso} aria-valuemin={0} aria-valuemax={100} aria-label="Tarjetas dominadas">
          <span style={{ width: `${progreso}%` }} />
        </div>
        <p className={styles.ayuda}>Aciertas: la tarjeta sube una caja. Fallas: vuelve a la caja 1.</p>
      </div>

      {estiloDisplay ? <BoxModal setEstiloDisplay={setEstiloDisplay} indiceCaja={indiceCaja} /> : null}
    </section>
  )

}
