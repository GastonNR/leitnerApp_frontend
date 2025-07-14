import React from 'react'
import "../css/sidebar.css"

export default function Sidebar() {
  return (
    <div className="sidebar md:w-1/4">
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Crear nueva tarjeta</h2>
            <form id="new-card-form" className="space-y-4">
                <div>
                    <label htmlFor="card-question" className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
                    <textarea id="card-question" rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required=""></textarea>
                </div>
                <div>
                    <label htmlFor="card-answer" className="block text-sm font-medium text-gray-700 mb-1">Respuesta</label>
                    <textarea id="card-answer" rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required=""></textarea>
                </div>
                <div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Crear tarjeta</button>
                </div>
            </form>
        </div>
    </div>
  )
}
