import React, { useState } from 'react'
import "../css/studyCard.css"
import { useLecciones } from '../context/LeccionesContext'

export default function StudyCard({ cantTarjetas, tarjeta, tarjetaIndex, setTarjetaIndex }) {

    const { leccionActivaId, lecciones, setLecciones, actualizarTarjeta, guardar } = useLecciones()

    const [flipped, setFlipped] = useState(false)

    const handleFlipped = () => {
        setFlipped(prev => !prev)
    }

    const manejoDeCajas = async (e) => {

        const boton = e.target.id

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
            if(estaGuardada.ok) alert("Lección actualizada")
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
                        <p id="current-question">
                            {tarjeta.pregunta}
                        </p>
                    </div>

                    <div className="card-back">
                        <p id="current-answer">
                            {tarjeta.respuesta}
                        </p>
                    </div>

                </div>
            </div>

            <p className="parr_inf">
                Haz clic en la tarjeta para voltearla
            </p>

            <div
                id="answer-buttons"
                className="grid grid-cols-2 gap-4"
                style={{ display: flipped ? "flex" : "none" }}
            >
                <button
                    id="btn-incorrect"
                    className="answer-buttons btn-incorrect"
                    onClick={manejoDeCajas}
                >
                    No lo sabía
                </button>

                <button
                    id="btn-correct"
                    className="answer-buttons btn-correct"
                    onClick={manejoDeCajas}
                >
                    Lo sabía
                </button>
            </div>

        </div>
    )
}