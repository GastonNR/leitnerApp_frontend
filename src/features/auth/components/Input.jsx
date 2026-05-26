import styles from '../css/components.module.css'

export default function Input({labelText, inputType, inputId, setOnChange, error}) {

  return (
    <div className={styles.field_container}>
        <label htmlFor={inputId} className={styles.label}>{labelText}</label>
        <input
            type={inputType}
            id={inputId}
            className={styles.input}
            onChange={(e)=>setOnChange(e.target.value.trim())}
            required
        />
        {
          error &&
          <p className={styles.p_campo_invalido}>Campo inválido</p>
        }
    </div>
  )
  
}
