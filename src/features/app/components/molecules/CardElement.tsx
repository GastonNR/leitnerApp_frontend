import { useRef, useState, type ChangeEvent } from "react"
import type { CardElementProps } from "../../types/components.types"
import { comprimirImagen, ErrorImagen } from "../../utils/comprimirImagen"
import ImagenTarjeta from "../atoms/ImagenTarjeta"
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

export default function CardElement({ pregunta, respuesta, proxima_revision, imagen, onEliminar, onCambiarImagen, onQuitarImagen }: CardElementProps) {

  const { texto, vencida } = cuandoToca(proxima_revision)
  const input = useRef<HTMLInputElement>(null)
  const [ocupado, setOcupado] = useState<null | 'subiendo' | 'quitando'>(null)
  const [error, setError] = useState<string | null>(null)

  async function alElegir(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return

    setError(null)
    setOcupado('subiendo')
    try {
      const resultado = await onCambiarImagen(await comprimirImagen(archivo))
      if (resultado !== true) setError(resultado)
    } catch (err) {
      setError(err instanceof ErrorImagen ? err.message : 'No se pudo procesar la imagen.')
    } finally {
      setOcupado(null)
    }
  }

  async function quitar() {
    setError(null)
    setOcupado('quitando')
    const resultado = await onQuitarImagen()
    if (resultado !== true) setError(resultado)
    setOcupado(null)
  }

  return (
    <li className={styles.card}>
      {imagen && <ImagenTarjeta imagenId={imagen} alt={`Imagen de: ${pregunta}`} className={styles.miniatura} />}
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

        <div className={styles.imagenAcciones}>
          <button type="button" className={styles.enlace} onClick={() => input.current?.click()} disabled={!!ocupado}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="9" cy="10" r="1.6" />
              <path d="m21 16-5-5-8 9" />
            </svg>
            {ocupado === 'subiendo' ? 'Subiendo…' : imagen ? 'Cambiar imagen' : 'Agregar imagen'}
          </button>
          {imagen && (
            <button type="button" className={`${styles.enlace} ${styles.enlacePeligro}`} onClick={quitar} disabled={!!ocupado}>
              {ocupado === 'quitando' ? 'Quitando…' : 'Quitar imagen'}
            </button>
          )}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={styles.oculto}
            onChange={alElegir}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>
      <button type="button" className={styles.eliminar} onClick={onEliminar} aria-label={`Eliminar tarjeta: ${pregunta}`} title="Eliminar tarjeta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </button>
    </li>
  )
}
