import { useState } from "react"
import type { InputPasswordProps } from "../types/components.types"
import CampoMensaje from "./CampoMensaje"
import styles from '../css/components.module.css'

export default function InputPassword({ labelText, inputId, error, hint, placeholder, autoComplete, setOnChange }: InputPasswordProps) {

    const [mostrarPassword, setMostrarPassword] = useState(false)
    const idMensaje = `${inputId}-mensaje`

    return (
        <div className={styles.field_container}>
            <label htmlFor={inputId} className={styles.label}>{labelText}</label>
            <div className={`${styles.input} ${styles.input_pass_container} ${error ? styles.input_error : ''}`}>
                <input
                    type={mostrarPassword ? 'text' : 'password'}
                    id={inputId}
                    name={inputId}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    aria-invalid={!!error}
                    aria-describedby={error || hint ? idMensaje : undefined}
                    onChange={(e) => setOnChange(e.target.value.trim())}
                />
                <button
                    type='button'
                    className={styles.btn_mostrar_pass}
                    onClick={() => setMostrarPassword(prev => !prev)}
                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={mostrarPassword}
                >
                    {
                        mostrarPassword ?
                            (
                                // OJO ABIERTO
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            ) : (
                                // OJO CERRADO
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.74 1.86-3.41 3.32-4.86" />
                                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.8 11.8 0 0 1-2.16 3.19" />
                                    <path d="M1 1l22 22" />
                                </svg>
                            )
                    }
                </button>
            </div>
            <CampoMensaje id={idMensaje} error={error} hint={hint} />
        </div>
    )
}
