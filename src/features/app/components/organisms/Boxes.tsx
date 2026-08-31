import { useState } from 'react'
import Box from '../molecules/Box'
import BoxModal from './BoxModal'
import { useLecciones } from '../../context/LeccionesContext'
import "./css/boxes.css"

const CAJAS = [
  { caja: '1', periodo: '(Diario)',  parrafo: 'Tarjetas que necesitas repasar todos los días' },
  { caja: '2', periodo: '(3 días)',  parrafo: 'Tarjetas que repasas cada 3 días' },
  { caja: '3', periodo: '(7 días)',  parrafo: 'Tarjetas que repasas cada semana' },
  { caja: '4', periodo: '(14 días)', parrafo: 'Tarjetas que necesitas repasar cada dos semanas' },
  { caja: '5', periodo: '(30 días)', parrafo: 'Tarjetas que necesitas repasar mensualmente' },
]

export default function Boxes() {

  const [ estiloDisplay, setEstiloDisplay ] = useState<boolean>(false)
  const [ indiceCaja, setIndiceCaja ] = useState<string>('')
  const { leccionActiva } = useLecciones()

  return (

    <div className="boxes-container">
      {CAJAS.map(({ caja, periodo, parrafo }, i) => (
        <Box
          key={caja}
          caja={caja}
          periodo={periodo}
          parrafo={parrafo}
          datosCaja={leccionActiva?.cajas[i]}
          resaltado={`cant_cards cant_cards_${caja}`}
          setEstiloDisplay={setEstiloDisplay}
          setIndiceCaja={setIndiceCaja}
        />
      ))}
      {estiloDisplay ? <BoxModal setEstiloDisplay={setEstiloDisplay} indiceCaja={indiceCaja} /> : null}
    </div>

  )

}
