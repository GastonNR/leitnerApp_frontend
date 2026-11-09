import type { AvisoProps } from '../types/components.types'
import styles from '../css/components.module.css'

// Mensaje general del formulario (error del servidor o confirmación), en lugar de alert().
export default function Aviso({ tipo, children }: AvisoProps) {
    return (
        <div className={`${styles.aviso} ${tipo === 'error' ? styles.aviso_error : styles.aviso_exito}`} role={tipo === 'error' ? 'alert' : 'status'}>
            {tipo === 'error' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5M12 16.5v.01" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
            )}
            <span>{children}</span>
        </div>
    )
}
