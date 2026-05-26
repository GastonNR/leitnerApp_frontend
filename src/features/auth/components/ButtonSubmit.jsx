import styles from '../css/components.module.css'

export default function ButtonSubmit({text, onclick}) {
  return (
    <button type="button" className={styles.btn_submit} onClick={onclick}>
        {text}
    </button>
  )
}
