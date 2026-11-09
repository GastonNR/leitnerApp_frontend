import { useState, type KeyboardEvent } from "react"
import type { CardElementProps } from "../../types/components.types"
import ImagenTarjeta from "../atoms/ImagenTarjeta"
import TextoMarkdown from "../atoms/TextoMarkdown"
import { textoPlano } from "../../utils/markdown"
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

// Texto e imagen se cambian desde "Editar" (modal); acá solo se ve la pregunta.
export default function CardElement({ pregunta, proxima_revision, imagen, onEditar, onEliminar }: CardElementProps) {

  const { texto, vencida } = cuandoToca(proxima_revision)
  // Borrado pendiente de confirmar
  const [confirmando, setConfirmando] = useState<boolean>(false)

  function cancelarConEscape(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      setConfirmando(false)
    }
  }

  // La respuesta no se muestra: mirar la caja no debería resolver el repaso.
  return (
    <li className={styles.card}>
      {imagen && <ImagenTarjeta imagenId={imagen} alt={`Imagen de: ${textoPlano(pregunta)}`} className={styles.miniatura} />}
      <div className={styles.contenido}>
        <TextoMarkdown texto={pregunta} className={styles.pregunta} />
        <span className={`${styles.revision} ${vencida ? styles.vencida : ''}`} title={new Date(proxima_revision).toLocaleDateString()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          Próximo repaso: {texto}
        </span>

        <div className={styles.acciones}>
          <button type="button" className={styles.enlace} onClick={onEditar} aria-label={`Editar tarjeta: ${textoPlano(pregunta)}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
              <path d="m14 8 3 3" />
            </svg>
            Editar
          </button>
        </div>
      </div>
      <button type="button" className={styles.eliminar} onClick={() => setConfirmando(true)} disabled={confirmando} aria-label={`Eliminar tarjeta: ${textoPlano(pregunta)}`} title="Eliminar tarjeta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </button>

      {confirmando && (
        <div
          className={styles.confirmar}
          role="alertdialog"
          aria-label="Confirmar eliminación de la tarjeta"
          onKeyDown={cancelarConEscape}
        >
          <p className={styles.confirmarTexto}>
            <strong>¿Borrar esta tarjeta?</strong> Se pierde su progreso{imagen ? ' y su imagen' : ''}. No se puede deshacer.
          </p>
          <div className={styles.confirmarBotones}>
            <button type="button" className={styles.cancelar} onClick={() => setConfirmando(false)} autoFocus>
              Cancelar
            </button>
            <button
              type="button"
              className={styles.peligro}
              onClick={() => {
                setConfirmando(false)
                onEliminar()
              }}
            >
              Borrar tarjeta
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
