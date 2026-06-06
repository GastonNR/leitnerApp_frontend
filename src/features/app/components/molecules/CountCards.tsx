import type { CountCardsProps } from "../../types/components.types"
import Circle from "../atoms/Circle"

export default function CountCards({id, texto, resaltado, caja}: CountCardsProps) {

  const cantidadTarjetas = caja?.tarjetas?.length || 0

  return (
    <div className="texto_caja_sidebar">
        <span className="texto__span">{texto}</span>
        <Circle id={id} resaltado={resaltado} cantidadTarjetas={cantidadTarjetas} />
    </div>
  )
}
