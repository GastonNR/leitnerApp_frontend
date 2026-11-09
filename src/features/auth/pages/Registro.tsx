import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Aviso from '../components/Aviso'
import Input from '../components/Input'
import InputPassword from '../components/InputPassword'
import ButtonSubmit from '../components/ButtonSubmit'
import { registroService } from '../services/auth.service'
import styles from '../css/auth.module.css'
import type { RegistroRequest } from '../types/auth.types'

const NOMBRE_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9._-]{4,20}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_MIN = 6

interface ErroresRegistro {
    nombre: string | null
    email: string | null
    password: string | null
    repPassword: string | null
}

const SIN_ERRORES: ErroresRegistro = { nombre: null, email: null, password: null, repPassword: null }

export default function Registro() {

    const navigate = useNavigate()

    // CAMPOS
    const [nombreUsuario, setNombreUsuario] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repPassword, setRepPassword] = useState<string>('')

    // ERRORES Y ESTADO DEL ENVÍO
    const [errores, setErrores] = useState<ErroresRegistro>(SIN_ERRORES)
    const [errorServidor, setErrorServidor] = useState<string | null>(null)
    const [enviando, setEnviando] = useState<boolean>(false)

    const cambiar = (campo: keyof ErroresRegistro, setter: (v: string) => void) => (valor: string) => {
        setter(valor)
        setErrores(prev => ({ ...prev, [campo]: null }))
        setErrorServidor(null)
    }

    async function registrarUsuario(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault()
        if (enviando) return

        const nuevosErrores: ErroresRegistro = {
            nombre: NOMBRE_REGEX.test(nombreUsuario)
                ? null
                : 'Entre 4 y 20 caracteres: letras, números, punto, guion o guion bajo.',
            email: EMAIL_REGEX.test(email) ? null : 'Escribe un correo electrónico válido.',
            password: password.length >= PASSWORD_MIN ? null : `Usa al menos ${PASSWORD_MIN} caracteres.`,
            repPassword: password === repPassword ? null : 'Las contraseñas no coinciden.',
        }
        setErrores(nuevosErrores)
        if (Object.values(nuevosErrores).some(Boolean)) return

        const datos: RegistroRequest = {
            nombre: nombreUsuario,
            email: email,
            password: password
        }

        setEnviando(true)
        const respuesta = await registroService(datos)
        setEnviando(false)

        if (!respuesta.ok) {
            setErrorServidor(respuesta.message)
            return
        }

        navigate("/login", { state: { registrado: true } })
    }

    return (
        <AuthLayout
            titulo="Crea tu cuenta"
            subtitulo="Empieza a entrenar tu memoria en menos de un minuto."
            pie={
                <p>¿Ya tienes una cuenta?{' '}
                    <Link to="/login" id="show-login" className={styles.link}>Inicia sesión</Link>
                </p>
            }
        >
            {errorServidor && <Aviso tipo="error">{errorServidor}</Aviso>}

            <form id="register-form" className={styles.form} onSubmit={registrarUsuario} noValidate>
                <Input
                    labelText={'Nombre de usuario'}
                    inputType={'text'}
                    inputId={'reg-name'}
                    placeholder={'Ej: ana_garcia'}
                    autoComplete={'username'}
                    hint={'Entre 4 y 20 caracteres.'}
                    setOnChange={cambiar('nombre', setNombreUsuario)}
                    error={errores.nombre}
                />

                <Input
                    labelText={'Correo electrónico'}
                    inputType={'email'}
                    inputId={'reg-email'}
                    placeholder={'tu@correo.com'}
                    autoComplete={'email'}
                    setOnChange={cambiar('email', setEmail)}
                    error={errores.email}
                />

                <InputPassword
                    labelText={'Contraseña'}
                    inputId={'reg-password'}
                    placeholder={`Mínimo ${PASSWORD_MIN} caracteres`}
                    autoComplete={'new-password'}
                    setOnChange={cambiar('password', setPassword)}
                    error={errores.password}
                />

                <InputPassword
                    labelText={'Repetir contraseña'}
                    inputId={'rep-reg-password'}
                    placeholder={'Vuelve a escribirla'}
                    autoComplete={'new-password'}
                    setOnChange={cambiar('repPassword', setRepPassword)}
                    error={errores.repPassword}
                />

                <ButtonSubmit text={'Crear cuenta'} loading={enviando} loadingText={'Creando cuenta…'} />
            </form>
        </AuthLayout>
    )
}
