import type { BoxProps } from "../../types/components.types"
import Button from "../atoms/Button"
import Circle from "../atoms/Circle"
import Heading from "../atoms/Heading"
import Paragraph from "../atoms/Paragraph"
import "./css/box.css"

export default function Box({caja, periodo, parrafo, datosCaja, resaltado, setEstiloDisplay, setIndiceCaja}: BoxProps) {

  const cantidadTarjetas = datosCaja?.tarjetas?.length || 0

  function seleccionarCaja(){
    setEstiloDisplay(true)
    setIndiceCaja(caja)
  }

  return (
    <div className="box-highlight box">
        <div className="box_encabezado">
          <Heading variante={'h3'} className={'titulo_caja'} texto={`Caja ${caja} ${periodo}`} />
          <Circle id={`box-${caja}-count`} resaltado={resaltado} cantidadTarjetas={cantidadTarjetas} />
        </div>
        <Paragraph className={'parr_box'} texto={parrafo} />
        <Button className={'view-box-btn'} texto={'Ver tarjetas'} onclick={seleccionarCaja} data_box={caja} />
    </div>
  )
}
