import { useState, type KeyboardEvent } from 'react'
import { StudyCardProps } from '../../types/components.types'
import ImagenTarjeta from '../atoms/ImagenTarjeta'
import TextoMarkdown from '../atoms/TextoMarkdown'
import { textoPlano } from '../../utils/markdown'
import styles from './css/studyCard.module.css'

// Tarjeta del modo estudio: se voltea con un click y, ya volteada, se responde.
export default function StudyCard({ tarjeta, bloqueado, onResponder }: StudyCardProps) {

    const [flipped, setFlipped] = useState<boolean>(false)
    const voltear = () => setFlipped(prev => !prev)

    // Es un div con rol de botón (y no un <button>) porque el texto con formato
    // tiene párrafos y listas, que no pueden ir dentro de un botón.
    const teclado = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            voltear()
        }
    }

    return (
        <div id="study-card-container" className={styles.contenedor}>

            <div
                role="button"
                tabIndex={0}
                className={`${styles.card} ${flipped ? styles.flipped : ''} ${tarjeta.imagen ? styles.conImagen : ''}`}
                onClick={voltear}
                onKeyDown={teclado}
                aria-label={flipped
                    ? `Respuesta: ${textoPlano(tarjeta.respuesta)}. Toca para ver la pregunta`
                    : `Pregunta: ${textoPlano(tarjeta.pregunta)}. Toca para ver la respuesta`}
            >
                <div className={styles.inner}>
                    <div className={`${styles.cara} ${styles.frente}`} aria-hidden={flipped}>
                        <span className={styles.etiqueta}>Pregunta</span>
                        {tarjeta.imagen && <ImagenTarjeta imagenId={tarjeta.imagen} alt="Imagen de la pregunta" className={styles.imagen} />}
                        <TextoMarkdown id="current-question" texto={tarjeta.pregunta} className={styles.pregunta} />
                        <span className={styles.pista}>Piensa la respuesta y toca la tarjeta</span>
                    </div>
                    <div className={`${styles.cara} ${styles.dorso}`} aria-hidden={!flipped}>
                        <span className={styles.etiqueta}>Respuesta</span>
                        <TextoMarkdown id="current-answer" texto={tarjeta.respuesta} className={styles.respuesta} />
                        <span className={styles.pista}>¿La sabías?</span>
                    </div>
                </div>
            </div>

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
