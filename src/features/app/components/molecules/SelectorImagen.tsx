import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { comprimirImagen, ErrorImagen } from '../../utils/comprimirImagen'
import styles from './css/selectorImagen.module.css'

interface SelectorImagenProps {
    imagen: Blob | null
    onCambiar: (imagen: Blob | null) => void
    deshabilitado?: boolean
    /* Ocupa todo el alto disponible (columna del formulario en escritorio) */
    expandido?: boolean
    /* Imagen que la tarjeta ya tiene (al editar), mientras no se elija otra */
    urlActual?: string | null
}

// Imagen opcional de la pregunta: se elige desde la computadora, se arrastra o se
// pega con Ctrl+V. Se comprime aquí mismo, antes de llegar al formulario.
export default function SelectorImagen({ imagen, onCambiar, deshabilitado = false, expandido = false, urlActual = null }: SelectorImagenProps) {
    const id = useId()
    const input = useRef<HTMLInputElement>(null)
    const raiz = useRef<HTMLDivElement>(null)
    const [arrastrando, setArrastrando] = useState(false)
    const [procesando, setProcesando] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [vista, setVista] = useState<string | null>(null)
    useEffect(() => {
        if (!imagen) { setVista(null); return }
        const url = URL.createObjectURL(imagen)
        setVista(url)
        return () => URL.revokeObjectURL(url)
    }, [imagen])

    // Referencia estable para el listener de "pegar"
    const procesarRef = useRef<(archivo: File) => void>(() => {})

    async function procesar(archivo: File) {
        if (deshabilitado || procesando) return
        setError(null)
        setProcesando(true)
        try {
            onCambiar(await comprimirImagen(archivo))
        } catch (e) {
            setError(e instanceof ErrorImagen ? e.message : 'No se pudo procesar la imagen.')
        } finally {
            setProcesando(false)
        }
    }
    procesarRef.current = procesar

    // Ctrl+V con una imagen en el portapapeles (por ejemplo, una captura de pantalla).
    // El texto pegado en los campos no se toca.
    useEffect(() => {
        function alPegar(e: ClipboardEvent) {
            // Si el formulario está oculto (otra pestaña), la imagen no es para él.
            if (!raiz.current || raiz.current.closest('[hidden]')) return
            const archivo = [...(e.clipboardData?.files ?? [])].find(f => f.type.startsWith('image/'))
            if (!archivo) return
            e.preventDefault()
            procesarRef.current(archivo)
        }
        document.addEventListener('paste', alPegar)
        return () => document.removeEventListener('paste', alPegar)
    }, [])

    function alElegir(e: ChangeEvent<HTMLInputElement>) {
        const archivo = e.target.files?.[0]
        e.target.value = '' // permite volver a elegir el mismo archivo
        if (archivo) procesar(archivo)
    }

    function alSoltar(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setArrastrando(false)
        const archivo = e.dataTransfer.files?.[0]
        if (archivo) procesar(archivo)
    }

    function quitar() {
        setError(null)
        onCambiar(null)
    }

    const idAyuda = `${id}-ayuda`
    const mostrada = vista ?? urlActual

    return (
        <div ref={raiz} className={`${styles.campo} ${expandido ? styles.expandido : ''}`}>
            <span className={styles.label}>
                Imagen <span className={styles.opcional}>(opcional, se muestra con la pregunta)</span>
            </span>

            {mostrada ? (
                <div className={styles.vista}>
                    <img src={mostrada} alt="Vista previa de la imagen de la pregunta" />
                    <div className={styles.vistaAcciones}>
                        <button type="button" className={styles.accion} onClick={() => input.current?.click()} disabled={deshabilitado || procesando}>
                            Cambiar
                        </button>
                        <button type="button" className={`${styles.accion} ${styles.quitar}`} onClick={quitar} disabled={deshabilitado || procesando}>
                            Quitar
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`${styles.zona} ${arrastrando ? styles.zonaActiva : ''} ${error ? styles.zonaError : ''}`}
                    onDragOver={e => { e.preventDefault(); setArrastrando(true) }}
                    onDragLeave={() => setArrastrando(false)}
                    onDrop={alSoltar}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <circle cx="9" cy="10" r="1.6" />
                        <path d="m21 16-5-5-8 9" />
                    </svg>
                    <p id={idAyuda} className={styles.texto}>
                        {procesando ? 'Preparando la imagen…' : (
                            <>
                                <button type="button" className={styles.elegir} onClick={() => input.current?.click()} disabled={deshabilitado}>
                                    Elige un archivo
                                </button>
                                , arrástralo aquí o <span className={styles.sinCorte}>pégalo con <kbd>Ctrl</kbd> + <kbd>V</kbd></span>
                            </>
                        )}
                    </p>
                    <p className={styles.formatos}>JPG, PNG, WebP o GIF</p>
                </div>
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

            {error && <p className={styles.error} role="alert">{error}</p>}
        </div>
    )
}
