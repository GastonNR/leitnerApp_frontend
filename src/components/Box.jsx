import React from 'react'
import "../css/boxes.css"

export default function Box({caja, periodo, parrafo}) {
  return (
    <div className="box-highlight box">
        <h3 className="titulo-caja">Caja {caja} <span className="span-caja">{periodo}</span></h3>
        <p className="parr_box">{parrafo}</p>
        <button className="view-box-btn" data-box="1">Ver tarjetas</button>
    </div>
  )
}
