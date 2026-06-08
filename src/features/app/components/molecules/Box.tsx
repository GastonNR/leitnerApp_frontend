import type { BoxProps } from "../../types/components.types"
import Button from "../atoms/Button"
import Heading from "../atoms/Heading"
import Paragraph from "../atoms/Paragraph"
import "../css/boxes.css"

export default function Box({caja, periodo, parrafo, setEstiloDisplay, setIndiceCaja}: BoxProps) {

  function seleccionarCaja(){
    setEstiloDisplay(true)
    setIndiceCaja(caja)
  }

  return (
    <div className="box-highlight box">
        <Heading nombreEncabezado={'tituloCaja'} className={'span-caja'} texto={`Caja ${periodo}`} />
        <Paragraph className={'parr_box'} texto={parrafo} />
        <Button className={'view-box-btn'} texto={'Ver tarjetas'} onclick={seleccionarCaja} data_box={'1'} />
    </div>
  )
}
