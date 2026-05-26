import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InputPassword from '../components/InputPassword'
import Input from '../components/Input'
import ButtonSubmit from '../components/ButtonSubmit'
import { registroService } from '../services/auth.service'
import styles from '../css/auth.module.css'


export default function Registro() {

    // CAMPOS
    const [nombreUsuario, setNombreUsuario] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rep_pass, setRep_pass] = useState('')

    // MANEJO DE ERRORES EN LA VALIDACIÓN DE CAMPOS
    const [errorNombre, setErrorNombre] = useState(false)
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorRep_pass, setErrorRep_pass] = useState(false)

    async function registrarUsuario() {

        const nombre_regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9._-]{4,20}$/
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        let camposValidos = 0;

        if (!nombre_regex.test(nombre)) {
            setErrorNombre(prev=>!prev)
            camposValidos++;
        }

        if (!email_regex.test(email)) {
            setErrorEmail(prev=>!prev)
            camposValidos++;
        }

        if(password !== rep_pass) {
            alert('Las contraseñas no coinciden')
            camposValidos++
        }

        if (camposValidos === 0) {
            const datos = {
                nombre: nombre,
                email: email,
                password: password
            }

            console.log(`Datos cargados:  ${datos}`)

            const res = await registroService(datos)
            
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
