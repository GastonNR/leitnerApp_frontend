import React from 'react'
import "../css/boxes.css"

export default function Box({caja, periodo, parrafo, setEstiloDisplay, setIndiceCaja}) {

  function seleccionarCaja(){
    setEstiloDisplay(true)
    setIndiceCaja(caja)
  }

  return (
    <div className="box-highlight box">
        <h3 className="titulo-caja">Caja {caja} <span className="span-caja">{periodo}</span></h3>
        <p className="parr_box">{parrafo}</p>
        <button type='button' className="view-box-btn" data-box="1" onClick={seleccionarCaja}>Ver tarjetas</button>
    </div>
  )
}
