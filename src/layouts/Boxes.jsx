import React, { useState } from 'react'
import "../css/boxes.css"
import Box from '../components/Box'
import BoxModal from './BoxModal'

export default function Boxes() {
  const [ estiloDisplay, setEstiloDisplay ] = useState(false)
  const [ indiceCaja, setIndiceCaja] = useState(null)

  return (
    <div className="boxes-container md:grid-cols-2 lg:grid-cols-3">
        <Box caja={"1"} periodo={"(Diario)"} parrafo={"Tarjetas que necesitas repasar todos los días"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
        <Box caja={"2"} periodo={"(3 días)"} parrafo={"Tarjetas que repasas cada 3 días"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
        <Box caja={"3"} periodo={"(7 días)"} parrafo={"Tarjetas que repasas cada semana"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
        <Box caja={"4"} periodo={"(14 días)"} parrafo={"Tarjetas que necesitas repasar cada dos semanas"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
        <Box caja={"5"} periodo={"(30 días)"} parrafo={"Tarjetas que necesitas repasar mensualmente"} setEstiloDisplay={setEstiloDisplay} setIndiceCaja={setIndiceCaja} />
        {estiloDisplay ? <BoxModal setEstiloDisplay={setEstiloDisplay} indiceCaja= {indiceCaja} /> : null}
        
    </div>
  )
}
