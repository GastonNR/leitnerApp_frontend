import type { ButtonSubmitProps } from '../types/components.types'
import styles from '../css/components.module.css'

export default function ButtonSubmit({ text, loading = false, loadingText }: ButtonSubmitProps) {
  return (
    <button type="submit" className={styles.btn_submit} disabled={loading} aria-busy={loading}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {loading ? (loadingText ?? text) : text}
    </button>
  )
}
