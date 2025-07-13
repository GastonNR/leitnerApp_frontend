import React from 'react'
import { Link } from 'react-router-dom'


export default function Registro() {
  return (
    <div className="auth-container">
      <div id="register-page" className="auth-form">
          <h2 className="titulo">Crear cuenta</h2>

          <form id="register-form" className="space-y-4">
              <div>
                  <label for="reg-name" className="label">Nombre</label>
                  <input type="text" id="reg-name" className="input" required="" />
              </div>
              <div>
                  <label for="reg-email" className="label">Correo electrónico</label>
                  <input type="email" id="reg-email" className="input" required="" />
              </div>
              <div>
                  <label for="reg-password" className="label">Contraseña</label>
                  <input type="text" id="reg-password" className="input" required="" />
              </div>
              <div>
                  <button type="submit" className="btn_submit">Registrarse</button>
              </div>
          </form>

          <div className="bottom_div">
              <p className="parrafo_abajo">¿Ya tienes una cuenta? <Link to="/" id="show-login" className="link">Inicia sesión</Link></p>
          </div>
      </div>
    </div>
  )
}
