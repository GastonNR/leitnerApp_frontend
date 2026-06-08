import { useState } from 'react'
import Box from '../molecules/Box'
import BoxModal from './BoxModal'
import "./css/boxes.css"

export default function Boxes() {

  const [ estiloDisplay, setEstiloDisplay ] = useState<boolean>(false)
  const [ indiceCaja, setIndiceCaja] = useState<string>('')

  return (

    <div className="boxes-container">
      <Box caja={"1"} periodo={"(Diario)"} parrafo={"Tarjetas que necesitas repasar todos los días"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
      <Box caja={"2"} periodo={"(3 días)"} parrafo={"Tarjetas que repasas cada 3 días"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
      <Box caja={"3"} periodo={"(7 días)"} parrafo={"Tarjetas que repasas cada semana"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
      <Box caja={"4"} periodo={"(14 días)"} parrafo={"Tarjetas que necesitas repasar cada dos semanas"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
      <Box caja={"5"} periodo={"(30 días)"} parrafo={"Tarjetas que necesitas repasar mensualmente"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
      {estiloDisplay ? <BoxModal setEstiloDisplay={setEstiloDisplay} indiceCaja= {indiceCaja} /> : null}      
    </div>

  )

}
