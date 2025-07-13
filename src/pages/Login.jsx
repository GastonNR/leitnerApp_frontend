import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    
    <div id="auth-container" className="auth-container">
        <div id="login-page" className="login-page">
            <h2 className="titulo">LeitnerApp</h2>
            <p className="subtitulo">Sistema Leitner para memorización efectiva</p>
            
            <form id="login-form" className="space-y-4">
                <div>
                    <label for="email" className="label">Correo electrónico</label>
                    <input type="email" id="email" className="input" required="" />
                </div>
                <div>
                    <label for="password" className="label">Contraseña</label>
                    <input type="text" id="password" className="input" required="" />
                </div>
                <div>
                    <button type="submit" className="btn_submit">Iniciar sesión</button>
                </div>
            </form>
            
            <div className="bottom_div">
                <p className="parrafo_abajo">¿No tienes una cuenta? <Link to="/registro" id="show-register" className="text-indigo-600 hover:text-indigo-800">Regístrate</Link></p>
            </div>
        </div>
    </div>  
        
  )
}
