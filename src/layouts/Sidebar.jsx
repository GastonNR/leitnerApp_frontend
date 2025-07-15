import React from 'react'
import "../css/sidebar.css"

export default function Sidebar() {
  return (
    <div className="sidebar">
        <div className="sidebar_superior">
            <h2 className="sidebar_titulo">Sistema Leitner</h2>
            <p className="sidebar_parr">Organiza tus tarjetas en 5 cajas según tu nivel de conocimiento. Las tarjetas se mueven entre cajas según tu desempeño.</p>
            
            <div className="contenedor_texto__caja_sidebar">
                <div className="texto_caja_sidebar">
                    <span className="texto__span">Caja 1 (Diario)</span>
                    <span id="box-1-count" className="cant_cards">0</span>
                </div>
                <div className="texto__caja_sidebar">
                    <span className="texto__span">Caja 2 (3 días)</span>
                    <span id="box-2-count" className="cant_cards">0</span>
                </div>
                <div className="texto__caja_sidebar">
                    <span className="texto__span">Caja 3 (7 días)</span>
                    <span id="box-3-count" className="cant_cards">0</span>
                </div>
                <div className="texto__caja_sidebar">
                    <span className="texto__span">Caja 4 (14 días)</span>
                    <span id="box-4-count" className="cant_cards">0</span>
                </div>
                <div className="texto__caja_sidebar">
                    <span className="texto__span">Caja 5 (30 días)</span>
                    <span id="box-5-count" className="cant_cards">0</span>
                </div>
            </div>
        </div>
        
        <div className="contenedor_sidebar_inferior">
            <h2 className="sidebar_titulo">Crear nueva tarjeta</h2>
            <form id="new-card-form" className="form_card">
                <div>
                    <label htmlFor="card-question">Pregunta</label>
                    <textarea id="card-question" rows="2" required=""></textarea>
                </div>
                <div>
                    <label htmlFor="card-answer">Respuesta</label>
                    <textarea id="card-answer" rows="2" required=""></textarea>
                </div>
                <div>
                    <button type="submit" className="btn_crearTarjeta">Crear tarjeta</button>
                </div>
            </form>
        </div>
    </div>
  )
}
