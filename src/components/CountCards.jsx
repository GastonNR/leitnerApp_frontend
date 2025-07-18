import React from 'react'

export default function CountCards({id, texto, resaltado, caja}) {

  const cantidadTarjetas = caja.tarjetas.length
  //console.log(cantidadTarjetas)

  return (
    <div className="texto_caja_sidebar">
        <span className="texto__span">{texto}</span>
        <span id={id} className={resaltado}>{cantidadTarjetas}</span>
    </div>
  )
}
