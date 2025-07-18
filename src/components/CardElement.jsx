//import { useCajas } from "../context/cajasContext"
import "../css/cardElement.css"

export default function CardElement({ pregunta, respuesta, proxima_revision }) {

  return (
    <div className="cardElement">
        <div className="pregunta">{pregunta}</div>
        <div className="respuesta">{respuesta}</div>
        <div className="proxima_revision">Próxima revisión: { proxima_revision.toLocaleString() }</div>
    </div>
  )
}
