import { useImagen } from '../../hooks/useImagen'
import styles from './css/imagenTarjeta.module.css'

interface ImagenTarjetaProps {
    imagenId: string
    alt: string
    className?: string
}

// Imagen de una tarjeta, descargada con el token. Muestra un hueco mientras carga.
export default function ImagenTarjeta({ imagenId, alt, className = '' }: ImagenTarjetaProps) {
    const { url, estado } = useImagen(imagenId)

    if (estado === 'error') {
        return <span className={`${styles.marco} ${styles.error} ${className}`}>Imagen no disponible</span>
    }

    if (!url) {
        return <span className={`${styles.marco} ${styles.cargando} ${className}`} aria-label="Cargando imagen" />
    }

    return <img src={url} alt={alt} className={`${styles.imagen} ${className}`} draggable={false} />
}
