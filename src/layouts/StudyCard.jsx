import React from 'react'

export default function StudyCard() {
  return (
    <div id="study-card-container" className="study-card-container">
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
  )
}
