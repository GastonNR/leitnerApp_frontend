import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputPassword from '../components/InputPassword'
import Input from '../components/Input'
import ButtonSubmit from '../components/ButtonSubmit'
import { registroService } from '../services/auth.service'
import styles from '../css/auth.module.css'
import { RegistroRequest } from '../types/auth.types'


export default function Registro() {

    const navigate = useNavigate()

    // CAMPOS
    const [nombreUsuario, setNombreUsuario] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [rep_pass, setRep_pass] = useState<string>('')

    // MANEJO DE ERRORES EN LA VALIDACIÓN DE CAMPOS
    const [errorNombre, setErrorNombre] = useState<boolean>(false)
    const [errorEmail, setErrorEmail] = useState<boolean>(false)
    const [errorPassword, setErrorPassword] = useState<boolean>(false)
    const [errorRep_pass, setErrorRep_pass] = useState<boolean>(false)


    async function registrarUsuario(): Promise<void> {

        const nombre_regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9._-]{4,20}$/
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        let camposValidos = 0;

        const nombreValido = nombre_regex.test(nombreUsuario)
        const emailValido = email_regex.test(email)
        const passwordsCoinciden = password === rep_pass

        setErrorNombre(!nombreValido)
        setErrorEmail(!emailValido)
        setErrorPassword(!passwordsCoinciden)
        setErrorRep_pass(!passwordsCoinciden)

        if(!nombreValido) camposValidos++
        if(!emailValido) camposValidos++
        if(!passwordsCoinciden) camposValidos++

        if (camposValidos === 0) {
            const datos: RegistroRequest = {
                nombre: nombreUsuario,
                email: email,
                password: password
            }

            const respuesta = await registroService(datos)
            if(!respuesta.ok) {
                alert(respuesta.message)
                return
            }
            
            alert(respuesta.message)
            navigate("/login")

        }
    }

    return (
        <div className={styles.auth_container}>
            <div id="register-page" className={styles.auth_form}>
                <h2 className={styles.titulo}>Crear cuenta</h2>

                <form id="register-form" className="space-y-4">
                    <Input
                        labelText={'Nombre de usuario'}
                        inputType={'text'}
                        inputId={'reg-name'}
                        setOnChange={setNombreUsuario}
                        error={errorNombre}
                    />

                    <Input
                        labelText={'Correo electrónico'}
                        inputType={'email'}
                        inputId={'reg-email'}
                        setOnChange={setEmail}
                        error={errorEmail}
                    />

                    <InputPassword
                        labelText={'Contraseña'}
                        inputId={'reg-password'}
                        setOnChange={setPassword}
                        error={errorPassword}
                    />

                    <InputPassword
                        labelText={'Repetir Contraseña'}
                        inputId={'rep-reg-password'}
                        setOnChange={setRep_pass}
                        error={errorRep_pass}
                    />

                    <ButtonSubmit text={'Registrarse'} onclick={registrarUsuario} />

                </form>

                <div className={styles.bottom_div}>
                    <p className={styles.parrafo_abajo}>¿Ya tienes una cuenta? <Link to="/login" id="show-login" className={styles.link}>Inicia sesión</Link></p>
                </div>
            </div>
        </div>
    )
}
