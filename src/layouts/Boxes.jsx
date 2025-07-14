import React from 'react'

export default function Boxes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="box-highlight bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <h3 className="font-semibold text-gray-800 mb-2">Caja 1 <span className="text-xs text-gray-500">(Diario)</span></h3>
            <p className="text-sm text-gray-600 mb-3">Tarjetas que necesitas repasar todos los días.</p>
            <button className="view-box-btn" data-box="1">Ver tarjetas</button>
        </div>
        
        <div className="box-highlight bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <h3 className="font-semibold text-gray-800 mb-2">Caja 2 <span className="text-xs text-gray-500">(3 días)</span></h3>
            <p className="text-sm text-gray-600 mb-3">Tarjetas que repasas cada 3 días.</p>
            <button className="view-box-btn" data-box="2">Ver tarjetas</button>
        </div>
        
        <div className="box-highlight bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <h3 className="font-semibold text-gray-800 mb-2">Caja 3 <span className="text-xs text-gray-500">(7 días)</span></h3>
            <p className="text-sm text-gray-600 mb-3">Tarjetas que repasas cada semana.</p>
            <button className="view-box-btn" data-box="3">Ver tarjetas</button>
        </div>
        
        <div className="box-highlight bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-800 mb-2">Caja 4 <span className="text-xs text-gray-500">(14 días)</span></h3>
            <p className="text-sm text-gray-600 mb-3">Tarjetas que repasas cada dos semanas.</p>
            <button className="view-box-btn" data-box="4">Ver tarjetas</button>
        </div>
        
        <div className="box-highlight bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800 mb-2">Caja 5 <span className="text-xs text-gray-500">(30 días)</span></h3>
            <p className="text-sm text-gray-600 mb-3">Tarjetas que repasas mensualmente.</p>
            <button className="view-box-btn" data-box="5">Ver tarjetas</button>
        </div>
    </div>
  )
}
