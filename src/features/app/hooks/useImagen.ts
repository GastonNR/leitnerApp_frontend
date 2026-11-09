import { useEffect, useState } from 'react'
import { obtenerImagenService } from '../services/estudio.service'

// Caché en memoria: cada imagen se descarga una sola vez por sesión.
// Las imágenes no cambian (una imagen nueva tiene otro id), así que no caducan.
const cache = new Map<string, Promise<string>>()

function cargar(imagenId: string): Promise<string> {
    let promesa = cache.get(imagenId)
    if (!promesa) {
        promesa = obtenerImagenService(imagenId).then(blob => URL.createObjectURL(blob))
        // Si falla, se olvida para poder reintentar más tarde.
        promesa.catch(() => cache.delete(imagenId))
        cache.set(imagenId, promesa)
    }
    return promesa
}

// Registra una imagen que ya tenemos en el navegador (la que se acaba de subir),
// para no volver a descargarla.
export function precargarImagen(imagenId: string, blob: Blob): void {
    if (!cache.has(imagenId)) cache.set(imagenId, Promise.resolve(URL.createObjectURL(blob)))
}

type Estado = 'cargando' | 'lista' | 'error'

// Devuelve una URL local (blob:) para mostrar la imagen de una tarjeta.
export function useImagen(imagenId: string | null | undefined): { url: string | null, estado: Estado } {
    const [resultado, setResultado] = useState<{ id: string, url: string | null, estado: Estado } | null>(null)

    useEffect(() => {
        if (!imagenId) return
        let vigente = true
        cargar(imagenId)
            .then(url => { if (vigente) setResultado({ id: imagenId, url, estado: 'lista' }) })
            .catch(() => { if (vigente) setResultado({ id: imagenId, url: null, estado: 'error' }) })
        return () => { vigente = false }
    }, [imagenId])

    if (!imagenId) return { url: null, estado: 'error' }
    if (resultado?.id !== imagenId) return { url: null, estado: 'cargando' }
    return { url: resultado.url, estado: resultado.estado }
}
