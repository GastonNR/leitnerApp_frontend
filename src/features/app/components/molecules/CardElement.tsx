import type { CardElementProps } from "../../types/components.types"
import Button from "../atoms/Button"
import "./css/cardElement.css"

export default function CardElement({ pregunta, respuesta, proxima_revision, onEliminar }: CardElementProps) {

  return (
    <div className="cardElement">
        <div>
          <div className="pregunta">{pregunta}</div>
          <div className="respuesta">{respuesta}</div>
          <div className="proxima_revision">Próxima revisión: { proxima_revision.toLocaleString() }</div>
        </div>
        <div>
          <Button className={'eliminar-leccion-btn'} texto={'Eliminar'} onclick={onEliminar} />
        </div>
    </div>
  )
}
