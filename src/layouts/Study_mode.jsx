import React from 'react'

export default function Study_mode() {
  return (
    <div id="study-container" className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Tarjetas para estudiar hoy</h2>
                            <div>
                                <span id="cards-remaining" className="text-sm text-gray-600">0 tarjetas restantes</span>
                            </div>
                        </div>
                        
                        <div id="study-empty" className="text-center py-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No hay tarjetas para estudiar hoy</h3>
                            <p className="text-gray-500 mb-4">Crea nuevas tarjetas o espera hasta mañana para continuar estudiando.</p>
                            <button id="add-sample-cards" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Agregar tarjetas de ejemplo</button>
                        </div>
                        
                        <div id="study-card-container" className="hidden">
                            <div className="card mb-6 cursor-pointer">
                                <div className="card-inner">
                                    <div className="card-front bg-white border border-gray-200 p-6">
                                        <p id="current-question" className="text-lg text-center"></p>
                                    </div>
                                    <div className="card-back bg-indigo-50 border border-indigo-200 p-6">
                                        <p id="current-answer" className="text-lg text-center"></p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-center text-sm text-gray-500 mb-6">Haz clic en la tarjeta para voltearla</p>
                            
                            <div id="answer-buttons" className="hidden grid grid-cols-2 gap-4">
                                <button id="btn-incorrect" className="bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-md font-medium transition duration-300">
                                    No lo sabía
                                </button>
                                <button id="btn-correct" className="bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-md font-medium transition duration-300">
                                    Lo sabía
                                </button>
                            </div>
                        </div>
                    </div>
  )
}
