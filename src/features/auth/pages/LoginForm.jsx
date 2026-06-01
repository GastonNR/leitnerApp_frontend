import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'
import InputPassword from '../components/InputPassword.jsx'
import Input from '../components/Input.jsx'
import ButtonSubmit from '../components/ButtonSubmit.jsx'
import styles from '../css/auth.module.css'

export default function LoginForm() {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorPass, setErrorPass] = useState(false)
    const { login } = useAuth()

    async function validar() {

        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        let camposValidos = 0

        if (!email_regex.test(email)) {
            setErrorEmail(prev=>!prev)
            camposValidos++
        }

        if (camposValidos === 0) {
            const datos = { email: email, password: password }

            const respuesta = await login(datos)
            
            if(!respuesta.ok) {
                alert(`Error: ${respuesta.message}`)
                return
            }
            
            navigate("/leitnerApp")
        }
    }

    return (

        <div id="auth-container" className={styles.auth_container}>
            <div id="login-page" className={styles.auth_form}>
                <Link to="/">
                    <h2 className={styles.titulo}>LeitnerApp</h2>
                </Link>
                <p className={styles.subtitulo}>Sistema Leitner para memorización efectiva</p>

                <form id="login-form" className="">

                    <Input
                        labelText={'Correo electrónico'}
                        inputType={'email'}
                        inputId={'email'}
                        setOnChange={setEmail}
                        error={errorEmail}
                    />

                    <InputPassword 
                        labelText={'Contraseña'}
                        inputId={'password'}
                        setOnChange={setPassword}
                        error={errorPass}
                    />

                    <ButtonSubmit text={'Iniciar Sesión'} onclick={validar}/>
                    
                </form>

                <div className="bottom_div">
                    <p className={styles.parrafo_abajo}>¿No tienes una cuenta?  
                        <Link to="/registro" id="show-register" className={styles.link}>
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>

    )
}
