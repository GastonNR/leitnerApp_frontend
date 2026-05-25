import { Link } from 'react-router-dom'
import "../css/auth.css"
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginForm() {

    const { login } = useAuth()
    async function validar() {
        const email = document.querySelector('#email').value.trim()
        const password = document.querySelector('#password').value.trim()

        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        let camposValidos = 0;

        if (!email_regex.test(email)) {
            document.querySelector('#email_login').style.display = "inline"
            camposValidos++;
        }

        if (camposValidos === 0) {
            const datos = { email: email, password: password }

            const respuesta = await login(datos)
            if (respuesta) window.location.href = "/LeitnerApp"
        }
    }

    return (

        <div id="auth-container" className="auth-container">
            <div id="login-page" className="auth-form">
                <Link to="/">
                    <h2 className="titulo">LeitnerApp</h2>
                </Link>
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
                        <button type="button" className="btn_submit" onClick={validar}>Iniciar sesión</button>
                    </div>
                </form>

                <div className="bottom_div">
                    <p className="parrafo_abajo">¿No tienes una cuenta? <Link to="/registro" id="show-register" className="link">Regístrate</Link></p>
                </div>
            </div>
        </div>

    )
}
