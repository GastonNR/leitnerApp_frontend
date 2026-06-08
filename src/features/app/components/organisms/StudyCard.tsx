import { useState, MouseEvent } from 'react'
import "../css/studyCard.css"
import { useLecciones } from '../context/LeccionesContext'
import { StudyCardProps } from '../types/components.types'
import Paragraph from '../components/atoms/Paragraph'
import Button from '../components/atoms/Button'

export default function StudyCard({ cantTarjetas, tarjeta, tarjetaIndex, setTarjetaIndex }: StudyCardProps) {

    const { actualizarTarjeta, guardar } = useLecciones()

    const [flipped, setFlipped] = useState<boolean>(false)

    const handleFlipped = (): void => {
        setFlipped(prev => !prev)
    }

    const manejoDeCajas = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {

        const boton = event.currentTarget.id
        if (boton !== 'btn-correct' && boton !== 'btn-incorrect') return

        const esCorrecta = boton === 'btn-correct'

        const leccionesActualizadas = await actualizarTarjeta(esCorrecta, tarjeta)

        if (tarjetaIndex < cantTarjetas - 1) {
            if (flipped) {
                handleFlipped()
            }

            setTimeout(() => {
                setTarjetaIndex(prev => prev + 1)
            }, 600)

        } else {
            setTarjetaIndex(-1)
            const estaGuardada = await guardar(leccionesActualizadas)
            if(estaGuardada?.ok) alert("Lección actualizada")
        }
    }

    return (
        <div id="study-card-container" className="study-card-container">

            <div
                className={`card ${flipped ? "flipped" : ""}`}
                onClick={handleFlipped}
            >
                <div className="card-inner">

                    <div className="card-front">
                        <Paragraph id={'current-question'} texto={tarjeta.pregunta} />
                    </div>

                    <div className="card-back">
                        <Paragraph id={'current-answer'} texto={tarjeta.respuesta} />
                    </div>

                </div>
            </div>

            <Paragraph className='parr_inf' texto='Haz click en la tarjeta para voltearla'/>

            <div
                id="answer-buttons"
                className="grid grid-cols-2 gap-4"
                style={{ display: flipped ? "flex" : "none" }}
            >
                <Button
                    id="btn-incorrect"
                    className={'answer-buttons btn-incorrect'}
                    texto={'No lo sabía'}
                    onclick={manejoDeCajas}
                />

                <Button
                    id="btn-correct"
                    className={'answer-buttons btn-correct'}
                    texto={'Lo sabía'}
                    onclick={manejoDeCajas}
                />

            </div>

        </div>
    )
}