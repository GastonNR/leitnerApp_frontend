import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'
import AuthLayout from '../components/AuthLayout'
import Aviso from '../components/Aviso'
import Input from '../components/Input'
import InputPassword from '../components/InputPassword'
import ButtonSubmit from '../components/ButtonSubmit'
import styles from '../css/auth.module.css'
import type { LoginRequest } from '../types/auth.types.js'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface ErroresLogin {
    email: string | null
    password: string | null
}

export default function LoginForm() {

    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    // Si venimos del registro, mostramos la confirmación
    const recienRegistrado = (location.state as { registrado?: boolean } | null)?.registrado === true

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errores, setErrores] = useState<ErroresLogin>({ email: null, password: null })
    const [errorServidor, setErrorServidor] = useState<string | null>(null)
    const [enviando, setEnviando] = useState<boolean>(false)

    const cambiar = (campo: keyof ErroresLogin, setter: (v: string) => void) => (valor: string) => {
        setter(valor)
        setErrores(prev => ({ ...prev, [campo]: null }))
        setErrorServidor(null)
    }

    async function validar(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault()
        if (enviando) return

        const nuevosErrores: ErroresLogin = {
            email: EMAIL_REGEX.test(email) ? null : 'Escribe un correo electrónico válido.',
            password: password.length > 0 ? null : 'Escribe tu contraseña.',
        }
        setErrores(nuevosErrores)
        if (nuevosErrores.email || nuevosErrores.password) return

        const datos: LoginRequest = { email, password }

        setEnviando(true)
        const respuesta = await login(datos)
        setEnviando(false)

        if (!respuesta.ok) {
            setErrorServidor(respuesta.message)
            return
        }

        navigate("/leitnerApp")
    }

    return (
        <AuthLayout
            titulo="Bienvenido de nuevo"
            subtitulo="Inicia sesión para seguir con tus repasos de hoy."
            pie={
                <p>¿No tienes una cuenta?{' '}
                    <Link to="/registro" id="show-register" className={styles.link}>Regístrate</Link>
                </p>
            }
        >
            {recienRegistrado && !errorServidor && (
                <Aviso tipo="exito">Cuenta creada. Ya puedes iniciar sesión.</Aviso>
            )}
            {errorServidor && <Aviso tipo="error">{errorServidor}</Aviso>}

            <form id="login-form" className={styles.form} onSubmit={validar} noValidate>
                <Input
                    labelText={'Correo electrónico'}
                    inputType={'email'}
                    inputId={'email'}
                    placeholder={'tu@correo.com'}
                    autoComplete={'email'}
                    setOnChange={cambiar('email', setEmail)}
                    error={errores.email}
                />

                <InputPassword
                    labelText={'Contraseña'}
                    inputId={'password'}
                    placeholder={'Tu contraseña'}
                    autoComplete={'current-password'}
                    setOnChange={cambiar('password', setPassword)}
                    error={errores.password}
                />

                <ButtonSubmit text={'Iniciar sesión'} loading={enviando} loadingText={'Ingresando…'} />
            </form>
        </AuthLayout>
    )
}
