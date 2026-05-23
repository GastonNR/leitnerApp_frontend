import React, { useState } from 'react'
import "../css/studyCard.css"
import { useCajas } from '../context/cajasContext'

export default function StudyCard({ cantTarjetas, tarjeta, tarjetaIndex, setTarjetaIndex }) {

    const { leccionActiva, leccionActivaId, lecciones, setLecciones } = useCajas()

    const [flipped, setFlipped] = useState(false)

    const handleFlipped = () => {
        setFlipped(prev => !prev)
    }

    const manejoDeCajas = (e) => {
        const boton = e.target.id

        if (boton !== 'btn-correct' && boton !== 'btn-incorrect') return
        console.log("botón: ", boton)

        if (boton === 'btn-correct') {
            setLecciones(prevLecciones =>
                prevLecciones.map(leccion => {
                    if (leccion._id !== leccionActivaId) return leccion
                    return {
                        ...leccion,
                        cajas: leccion.cajas.map(caja => {
                            return {
                                ...caja,
                                tarjetas: caja.tarjetas.map(t => {
                                    if (t._id === tarjeta._id) {
                                        return {
                                            ...t,
                                            es_correcta: true
                                        }
                                    }

                                    return t
                                })
                            }
                        })
                    }
                })
            )

        } else if (boton === 'btn-incorrect') {
            setLecciones(prevLecciones =>
                prevLecciones.map(leccion => {
                    if (leccion._id !== leccionActivaId) return leccion

                    return {
                        ...leccion,
                        cajas: leccion.cajas.map(caja => {
                            return {
                                ...caja,
                                tarjetas: caja.tarjetas.map(t => {
                                    if (t._id === tarjeta._id) {
                                        return {
                                            ...t,
                                            es_correcta: false
                                        }
                                    }
                                    return t
                                })
                            }
                        })
                    }
                })
            )

        } else {
            return
        }

        handlerIndex();

    }


    const handlerIndex = () => {
        if (tarjetaIndex < cantTarjetas - 1) {
            if (flipped === true) handleFlipped()
            setTarjetaIndex(prev => prev + 1)
        }

    }

    return (
        <div id="study-card-container" className="study-card-container">
            <div className={`card ${flipped ? "flipped" : ""}`} onClick={handleFlipped} >
                <div className="card-inner">
                    <div className="card-front">
                        <p id="current-question">{tarjeta.pregunta}</p>
                    </div>
                    <div className="card-back">
                        <p id="current-answer">{tarjeta.respuesta}</p>
                    </div>
                </div>
            </div>

            <p className="parr_inf">Haz clic en la tarjeta para voltearla</p>

            <div id="answer-buttons" className="grid grid-cols-2 gap-4">
                <button id="btn-incorrect" className="answer-buttons btn-incorrect" onClick={manejoDeCajas} >
                    No lo sabía
                </button>
                <button id="btn-correct" className="answer-buttons btn-correct" onClick={manejoDeCajas} >
                    Lo sabía
                </button>
            </div>

        </div>
    )
}
