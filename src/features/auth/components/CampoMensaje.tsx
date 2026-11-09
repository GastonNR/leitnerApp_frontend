import styles from '../css/components.module.css'

interface CampoMensajeProps {
    id: string
    error?: string | null
    hint?: string
}

// Debajo de cada campo: el error si lo hay, si no el texto de ayuda.
export default function CampoMensaje({ id, error, hint }: CampoMensajeProps) {
    if (error) {
        return (
            <p id={id} className={styles.mensaje_error}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5M12 16.5v.01" />
                </svg>
                {error}
            </p>
        )
    }

    if (hint) return <p id={id} className={styles.mensaje_hint}>{hint}</p>

    return null
}
