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
        <Heading nombreEncabezado={'tituloCaja'} clase={'span-caja'} texto={`Caja ${periodo}`} />
        <Paragraph nombreClase={'parr_box'} texto={parrafo} />
        <Button clase={'view-box-btn'} texto={'Ver tarjetas'} onclick={seleccionarCaja} data_box={'1'} />
    </div>
  )
}
