import type { ButtonSubmitProps } from '../types/components.types'
import styles from '../css/components.module.css'

export default function ButtonSubmit({text, onclick}: ButtonSubmitProps) {
  return (
    <button type="button" className={styles.btn_submit} onClick={onclick}>
        {text}
    </button>
  )
}
