import React from 'react'
import "../css/studyCard.css"

export default function StudyCard() {
  return (
    <div id="study-card-container" className="study-card-container">
        <div className="card">
            <div className="card-inner">
                <div className="card-front">
                    <p id="current-question"></p>
                </div>
                <div className="card-back">
                    <p id="current-answer"></p>
                </div>
            </div>
        </div>
        
        <p className="parr_inf">Haz clic en la tarjeta para voltearla</p>
        
        <div id="answer-buttons" className="hidden grid grid-cols-2 gap-4">
            <button id="btn-incorrect" className="answer-buttons btn-incorrect">
                No lo sabía
            </button>
            <button id="btn-correct" className="answer-buttons btn-correct">
                Lo sabía
            </button>
        </div>

    </div>
  )
}
