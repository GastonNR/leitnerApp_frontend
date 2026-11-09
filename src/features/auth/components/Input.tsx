import type { InputProps } from '../types/components.types'
import CampoMensaje from './CampoMensaje'
import styles from '../css/components.module.css'

export default function Input({ labelText, inputType, inputId, error, hint, placeholder, autoComplete, setOnChange }: InputProps) {

  const idMensaje = `${inputId}-mensaje`

  return (
    <div className={styles.field_container}>
      <label htmlFor={inputId} className={styles.label}>{labelText}</label>
      <input
        type={inputType}
        id={inputId}
        name={inputId}
        className={`${styles.input} ${error ? styles.input_error : ''}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error || hint ? idMensaje : undefined}
        onChange={(e) => setOnChange(e.target.value.trim())}
      />
      <CampoMensaje id={idMensaje} error={error} hint={hint} />
    </div>
  )

}
