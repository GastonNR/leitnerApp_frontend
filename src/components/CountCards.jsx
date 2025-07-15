import React from 'react'

export default function CountCards({id, texto, cantidad}) {

  return (
    <div className="texto_caja_sidebar">
        <span className="texto__span">{texto}</span>
        <span id={id} className="cant_cards">{cantidad}</span>
    </div>
  )
}
