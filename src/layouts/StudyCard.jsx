import React, { useState } from 'react'
import "../css/studyCard.css"
import { useCajas } from '../context/cajasContext'
import { guardarLeccion } from '../services/lecciones.service.js'

export default function StudyCard({ cantTarjetas, tarjeta, tarjetaIndex, setTarjetaIndex }) {

    const { leccionActivaId, lecciones, setLecciones } = useCajas()

    const [flipped, setFlipped] = useState(false)

    const handleFlipped = () => {
        setFlipped(prev => !prev)
    }

    const actualizarTarjeta = (esCorrecta) => {

        const leccionesActualizadas = lecciones.map(leccion => {

            if (leccion._id !== leccionActivaId) return leccion

            return {
                ...leccion,
                cajas: leccion.cajas.map(caja => ({
                    ...caja,
                    tarjetas: caja.tarjetas.map(t => {

                        if (t._id !== tarjeta._id) return t

                        return {
                            ...t,
                            es_correcta: esCorrecta
                        }

                    })
                }))
            }

        })

        setLecciones(leccionesActualizadas)

        return leccionesActualizadas
    }

    const guardar = async (leccionesActualizadas) => {

        const leccionActualizada = leccionesActualizadas.find(
            l => l._id === leccionActivaId
        )

        if (!leccionActualizada) return

        const respuesta = await guardarLeccion(leccionActualizada)

        if (respuesta) {
            alert("Lección guardada.")

            setLecciones(prev =>
                prev.map(leccion => {
                    if (leccion._id !== leccionActivaId) return leccion
                    return respuesta
                })
            )
        }
    }

    const manejoDeCajas = async (e) => {

        const boton = e.target.id

        if (boton !== 'btn-correct' && boton !== 'btn-incorrect') return

        const esCorrecta = boton === 'btn-correct'

        const leccionesActualizadas = actualizarTarjeta(esCorrecta)

        if (tarjetaIndex < cantTarjetas - 1) {

            if (flipped) {
                handleFlipped()
            }

            setTimeout(() => {
                setTarjetaIndex(prev => prev + 1)
            }, 600)

        } else {

            setTarjetaIndex(-1)

            await guardar(leccionesActualizadas)
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