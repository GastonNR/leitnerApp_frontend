import { useState } from 'react'
import { StudyCardProps } from '../../types/components.types'
import styles from './css/studyCard.module.css'

// Tarjeta del modo estudio: se voltea con un click y, ya volteada, se responde.
export default function StudyCard({ tarjeta, bloqueado, onResponder }: StudyCardProps) {

    const [flipped, setFlipped] = useState<boolean>(false)

    return (
        <div id="study-card-container" className={styles.contenedor}>

            <button
                type="button"
                className={`${styles.card} ${flipped ? styles.flipped : ''}`}
                onClick={() => setFlipped(prev => !prev)}
                aria-label={flipped ? `Respuesta: ${tarjeta.respuesta}. Toca para ver la pregunta` : `Pregunta: ${tarjeta.pregunta}. Toca para ver la respuesta`}
            >
                <span className={styles.inner}>
                    <span className={`${styles.cara} ${styles.frente}`}>
                        <span className={styles.etiqueta}>Pregunta</span>
                        <span id="current-question" className={styles.pregunta}>{tarjeta.pregunta}</span>
                        <span className={styles.pista}>Piensa la respuesta y toca la tarjeta</span>
                    </span>
                    <span className={`${styles.cara} ${styles.dorso}`}>
                        <span className={styles.etiqueta}>Respuesta</span>
                        <span id="current-answer" className={styles.respuesta}>{tarjeta.respuesta}</span>
                        <span className={styles.pista}>¿La sabías?</span>
                    </span>
                </span>
            </button>

            <div id="answer-buttons" className={styles.botones}>
                <button
                    id="btn-incorrect"
                    type="button"
                    className={styles.incorrecta}
                    onClick={() => onResponder(false)}
                    disabled={!flipped || bloqueado}
                >
                    No lo sabía
                </button>
                <button
                    id="btn-correct"
                    type="button"
                    className={styles.correcta}
                    onClick={() => onResponder(true)}
                    disabled={!flipped || bloqueado}
                >
                    Lo sabía
                </button>
            </div>
        </div>
    )
}
