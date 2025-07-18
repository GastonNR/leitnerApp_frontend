//import { useCajas } from "../context/cajasContext"
import "../css/cardElement.css"

export default function CardElement({ pregunta, respuesta, proxima_revision }) {
  //const {cajas, setCajas} = useCajas()

  return (
    <div className="cardElement">
        <div class="pregunta">{pregunta}</div>
        <div class="respuesta">{respuesta}</div>
        <div class="proxima_revision">Próxima revisión: { proxima_revision }</div>
    </div>
  )
}
