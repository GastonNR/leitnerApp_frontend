import { Link } from 'react-router-dom'
import "../css/auth.css"

export default function Login() {
    async function login() {
        const email = document.querySelector('#email').value.trim()
        const password = document.querySelector('#password').value.trim()

        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        let camposValidos = 0;

        if(!email_regex.test(email)){
            document.querySelector('#email_login').style.display = "inline"
            camposValidos++;
        }

        if(camposValidos === 0) {
            const datos = {email: email, password: password}

            try {
                const res = await fetch(import.meta.env.VITE_LOGIN_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                })
                const resultado = await res.json()
                console.log(resultado)
                if(res.ok){
                    localStorage.setItem("token", resultado.token)
                    localStorage.setItem("nombre_usuario", resultado.usuario.nombre)
                    localStorage.setItem("id", resultado.usuario.id)
                    window.location.href = "/home"
                } else {
                    alert( resultado.mensaje || "Credenciales inválidas")
                }

            } catch (error) {
                console.log("Error al logear al usuario: ", error)

            }

        }
    }
  
    return (
    
    <div id="auth-container" className="auth-container">
        <div id="login-page" className="auth-form">
            <h2 className="titulo">LeitnerApp</h2>
            <p className="subtitulo">Sistema Leitner para memorización efectiva</p>
            
            <form id="login-form" className="space-y-4">
                <div className='field-container'>
                    <label htmlFor="email" className="label">Correo electrónico</label>
                    <input type="email" id="email" className="input" required="" />
                    <p id='email_login' className='p_campo_invalido'>Campo inválido</p>
                </div>
                <div className='field-container'>
                    <label htmlFor="password" className="label">Contraseña</label>
                    <input type="password" id="password" className="input" required="" />
                    <p id='pass_login' className='p_campo_invalido'>Campo inválido</p>
                </div>
                <div>
                    <button type="button" className="btn_submit" onClick={login}>Iniciar sesión</button>
                </div>
            </form>
            
            <div className="bottom_div">
                <p className="parrafo_abajo">¿No tienes una cuenta? <Link to="/registro" id="show-register" className="link">Regístrate</Link></p>
            </div>
        </div>
    </div>  
        
  )
}
