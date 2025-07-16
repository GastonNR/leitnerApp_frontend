import React from 'react'
import { Link } from 'react-router-dom'
import "../css/auth.css"

export default function Registro() {

    async function registrarUsuario(){
        const nombre = document.querySelector("#reg-name").value.trim()
        const email = document.querySelector("#reg-email").value.trim()
        const password = document.querySelector("#reg-password").value.trim()

        const nombre_regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9._-]{4,20}$/
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        let camposValidos = 0;

        if(!nombre_regex.test(nombre)){
            document.querySelector('#nombre_reg').style.display = "inline"
            camposValidos++;
        }
        
        if(!email_regex.test(email)){
            document.querySelector('#email_reg').style.display = "inline"
            camposValidos++;
        }

        if(camposValidos === 0){
            const datos = {
                nombre: nombre,
                email: email,
                password: password
            }

            try{
                const res = await fetch(import.meta.env.VITE_REGISTRO_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                })
                const resultado = await res.json();
                console.log(resultado)

            } catch(error) {
                console.error("Error al registrar al usuario: ", error)

            }
        }
    }

  return (
    <div className="auth-container">
      <div id="register-page" className="auth-form">
          <h2 className="titulo">Crear cuenta</h2>

          <form id="register-form" className="space-y-4">
              <div className='field-container'>
                  <label htmlFor="reg-name" className="label">Nombre</label>
                  <input type="text" id="reg-name" className="input" required={true} />
                  <p id='nombre_reg' className='p_campo_invalido'>Campo inválido</p>
              </div>
              <div className='field-container'>
                  <label htmlFor="reg-email" className="label">Correo electrónico</label>
                  <input type="email" id="reg-email" className="input" required={true} />
                  <p id='email_reg' className='p_campo_invalido'>Campo inválido</p>
              </div>
              <div className='field-container'>
                  <label htmlFor="reg-password" className="label">Contraseña</label>
                  <input type="password" id="reg-password" className="input" required={true} />
                  <p id='pass_reg' className='p_campo_invalido'>Campo inválido</p>
              </div>
              <div>
                  <button type="button" className="btn_submit" onClick={registrarUsuario}>Registrarse</button>
              </div>
          </form>

          <div className="bottom_div">
              <p className="parrafo_abajo">¿Ya tienes una cuenta? <Link to="/" id="show-login" className="link">Inicia sesión</Link></p>
          </div>
      </div>
    </div>
  )
}
