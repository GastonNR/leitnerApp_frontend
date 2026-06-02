import type { CountCardsProps } from "../types/components.types"

export default function CountCards({id, texto, resaltado, caja}: CountCardsProps) {

  const cantidadTarjetas = caja?.tarjetas?.length || 0

  return (
    <div className="texto_caja_sidebar">
        <span className="texto__span">{texto}</span>
        <span id={id} className={resaltado}>{cantidadTarjetas}</span>
    </div>
  )
}
