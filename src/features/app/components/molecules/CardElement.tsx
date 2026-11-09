import type { CardElementProps } from "../../types/components.types"
import styles from "./css/cardElement.module.css"

// "hoy", "mañana", "en 5 días" o "hace 2 días" (vencida)
function cuandoToca(fecha: Date): { texto: string, vencida: boolean } {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const dia = new Date(fecha)
  dia.setHours(0, 0, 0, 0)
  const dias = Math.round((dia.getTime() - hoy.getTime()) / 86_400_000)

  if (dias < 0) return { texto: `vencida hace ${-dias} día${dias !== -1 ? 's' : ''}`, vencida: true }
  if (dias === 0) return { texto: 'hoy', vencida: true }
  if (dias === 1) return { texto: 'mañana', vencida: false }
  return { texto: `en ${dias} días`, vencida: false }
}

export default function CardElement({ pregunta, respuesta, proxima_revision, onEliminar }: CardElementProps) {

  const { texto, vencida } = cuandoToca(proxima_revision)

  return (
    <li className={styles.card}>
      <div className={styles.contenido}>
        <p className={styles.pregunta}>{pregunta}</p>
        <p className={styles.respuesta}>{respuesta}</p>
        <span className={`${styles.revision} ${vencida ? styles.vencida : ''}`} title={new Date(proxima_revision).toLocaleDateString()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          Próximo repaso: {texto}
        </span>
      </div>
      <button type="button" className={styles.eliminar} onClick={onEliminar} aria-label={`Eliminar tarjeta: ${pregunta}`} title="Eliminar tarjeta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </button>
    </li>
  )
}
