import React from 'react'
import "../css/boxes.css"
import Box from '../components/Box'

export default function Boxes() {
  return (
    <div className="boxes-container md:grid-cols-2 lg:grid-cols-3">
        <Box caja={"1"} periodo={"(Diario)"} parrafo={"Tarjetas que necesitas repasar todos los días"} />
        <Box caja={"2"} periodo={"(3 días)"} parrafo={"Tarjetas que repasas cada 3 días"} />
        <Box caja={"3"} periodo={"(7 días)"} parrafo={"Tarjetas que repasas cada semana"} />
        <Box caja={"4"} periodo={"(14 días)"} parrafo={"Tarjetas que necesitas repasar cada dos semanas"} />
        <Box caja={"5"} periodo={"(30 días)"} parrafo={"Tarjetas que necesitas repasar mensualmente"} />
    </div>
  )
}
