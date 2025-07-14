import React from 'react'

export default function BoxModal() {
  return (
    <div id="box-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 id="box-modal-title" className="text-lg font-semibold text-gray-800">Tarjetas en Caja</h3>
                    <button id="close-box-modal" className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                    <div id="box-cards-container" className="space-y-4">
                        {/*Cards will be inserted here*/}
                    </div>
                    <div id="box-empty-message" className="text-center py-8 hidden">
                        <p className="text-gray-500">No hay tarjetas en esta caja.</p>
                    </div>
                </div>
            </div>
        </div>
  )
}
