import React, { useState } from 'react'
import "../css/studyCard.css"
import { useCajas } from '../context/cajasContext'

export default function StudyCard({ cantTarjetas, tarjeta, tarjetaIndex, setTarjetaIndex }) {
    const {cajas, setCajas} = useCajas()
    const [flipped, setFlipped] = useState(false)

    const handleFlipped = () => {
        setFlipped(prev => !prev)
    }

    const manejoDeCajas = (e) => {
        const boton = e.target.id

        if(boton === 'btn-correct'){
            
        }

        handlerIndex()
    }

    const handlerIndex = () => {
        if(tarjetaIndex < cantTarjetas - 1){
            if(flipped === true) handleFlipped()
            setTarjetaIndex(prev => prev + 1)
        } 

    }

  return (
    <div id="study-card-container" className="study-card-container">
        <div className={ `card ${flipped ? "flipped" : ""}` } onClick={handleFlipped} >
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
