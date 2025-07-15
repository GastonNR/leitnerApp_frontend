import React from 'react'
import "../css/study_mode.css"
import StudyCard from './StudyCard'

export default function Study_mode() {
  return (
    <div id="study-container" className="study-container">

        <div className="contenedor-tarjetas">
            <h2 className="subtitulo-contenedor-tarjetas">Tarjetas para estudiar hoy</h2>
            <div>
                <span id="cards-remaining" className="cards-remaining">0 tarjetas restantes</span>
            </div>
        </div>
        
        <div id="study-empty" className="study-empty">
            <svg xmlns="http://www.w3.org/2000/svg" className="img_libro" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 className="texto-study-empty">No hay tarjetas para estudiar hoy</h3>
            <p className="parr-study-empty">Crea nuevas tarjetas o espera hasta mañana para continuar estudiando.</p>
            <button id="add-sample-cards" className='btn_add-sample-cards'>Agregar tarjetas de ejemplo</button>
        </div>
        
        <StudyCard/>

    </div>
  )
}
