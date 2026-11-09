import styles from '../organisms/css/modal.module.css'

interface CerrarModalProps {
    id?: string
    className?: string
    onclick: () => void
}

// Botón "X" de los modales
export default function CerrarModal({ id, className, onclick }: CerrarModalProps) {
    return (
        <button id={id} type="button" className={`${styles.close} ${className ?? ''}`} onClick={onclick} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    )
}
