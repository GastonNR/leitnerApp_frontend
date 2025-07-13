import React from 'react'
import { Link } from 'react-router-dom'

export default function Registro() {
  return (
    
    <div id="register-page" className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6 hidden">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Crear cuenta</h2>
        
        <form id="register-form" className="space-y-4">
            <div>
                <label for="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" id="reg-name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required="" />
            </div>
            <div>
                <label for="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input type="email" id="reg-email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required="" />
            </div>
            <div>
                <label for="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input type="text" id="reg-password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required="" />
            </div>
            <div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Registrarse</button>
            </div>
        </form>
        
        <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">¿Ya tienes una cuenta? <Link to="/" id="show-login" className="text-indigo-600 hover:text-indigo-800">Inicia sesión</Link></p>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 text-center">Esta es una versión demo. No se almacenarán datos reales.</p>
        </div>
    </div>
  )
}
