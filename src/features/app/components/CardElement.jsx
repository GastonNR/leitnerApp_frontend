//import { useCajas } from "../context/cajasContext"
import "../css/cardElement.css"

export default function CardElement({ pregunta, respuesta, proxima_revision, onEliminar }) {

  return (
    <div className="cardElement">
        <div>
          <div className="pregunta">{pregunta}</div>
          <div className="respuesta">{respuesta}</div>
          <div className="proxima_revision">Próxima revisión: { proxima_revision.toLocaleString() }</div>
        </div>
        <div>
          <button onClick={onEliminar}>Eliminar</button>
        </div>
    </div>
  )
}
