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

        if (boton !== 'btn-correct' && boton !== 'btn-incorrect') return

        console.log("Datos de tarjeta actual: ", tarjeta)

        
        //setCajas(prevCajas => {
        //    
        //    const nuevasCajas = prevCajas.map(caja => ({ ...caja, tarjetas: [...caja.tarjetas] }))
//
        //    let cajaActualIndex = -1
        //    let tarjetaPos = -1
//
        //    for (let i = 0; i < nuevasCajas.length; i++) {
        //        tarjetaPos = nuevasCajas[i].tarjetas.findIndex(t => {
        //        return (t._id && tarjeta._id) ? t._id === tarjeta._id : t.pregunta === tarjeta.pregunta
        //        });
//
        //        if (tarjetaPos !== -1) { cajaActualIndex = i; break; }
        //    }
//
        //    if (cajaActualIndex === -1) return prevCajas
//
        //    const tarjetaOriginal = nuevasCajas[cajaActualIndex].tarjetas[tarjetaPos]
        //    const tarjetaActualizada = { ...tarjetaOriginal }
        //    nuevasCajas[cajaActualIndex].tarjetas.splice(tarjetaPos, 1)
//
        //    if (boton === 'btn-correct') {
        //        tarjetaActualizada.nivel = (tarjetaActualizada.nivel || 0) + 1
        //        if (tarjetaActualizada.nivel > 5) tarjetaActualizada.nivel  = 5
        //    } else {
        //        tarjetaActualizada.nivel = 1
        //    }
//
        //    tarjetaActualizada.ultima_revision = new Date().toISOString();
//
        //    const diasPorNivel = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 }
        //    const dias = diasPorNivel[tarjetaActualizada.nivel] ?? 30
        //    tarjetaActualizada.proxima_revision = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();
//
        //    const nuevaCajaIndex = (boton === 'btn-correct') ? Math.min(cajaActualIndex + 1, nuevasCajas.length - 1) : 0
//
        //    nuevasCajas[nuevaCajaIndex].tarjetas.push(tarjetaActualizada);
//
        //    return nuevasCajas;
        //});

        handlerIndex();

        //console.log('nuevas cajas: ', cajas)
    };


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
