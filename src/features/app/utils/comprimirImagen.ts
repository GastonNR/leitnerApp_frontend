// Reduce y comprime una imagen en el navegador antes de subirla, para que una foto
// de varios MB del celular llegue al servidor como unos cientos de KB.

export const LADO_MAXIMO = 1280
export const TAMANO_MAXIMO_ORIGINAL = 15 * 1024 * 1024 // lo que aceptamos elegir
export const TAMANO_MAXIMO_SUBIDA = 2 * 1024 * 1024    // lo que acepta el backend

const TIPOS_ADMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export class ErrorImagen extends Error {}

function aBlob(canvas: HTMLCanvasElement, tipo: string, calidad: number): Promise<Blob | null> {
    return new Promise(resolve => canvas.toBlob(resolve, tipo, calidad))
}

export async function comprimirImagen(archivo: Blob): Promise<Blob> {

    if (!TIPOS_ADMITIDOS.includes(archivo.type)) {
        throw new ErrorImagen('Formato no admitido. Usa una imagen JPG, PNG, WebP o GIF.')
    }
    if (archivo.size > TAMANO_MAXIMO_ORIGINAL) {
        throw new ErrorImagen('La imagen es demasiado grande (máximo 15 MB).')
    }

    let bitmap: ImageBitmap
    try {
        bitmap = await createImageBitmap(archivo, { imageOrientation: 'from-image' })
    } catch {
        throw new ErrorImagen('No se pudo leer la imagen. Prueba con otro archivo.')
    }

    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height))
    const ancho = Math.max(1, Math.round(bitmap.width * escala))
    const alto = Math.max(1, Math.round(bitmap.height * escala))

    const canvas = document.createElement('canvas')
    canvas.width = ancho
    canvas.height = alto
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new ErrorImagen('Tu navegador no permite procesar imágenes.')

    ctx.drawImage(bitmap, 0, 0, ancho, alto)

    // WebP conserva la transparencia y pesa poco. Si el navegador no sabe generarlo
    // (devuelve PNG), se usa JPEG con fondo blanco.
    let resultado = await aBlob(canvas, 'image/webp', 0.82)
    if (!resultado || resultado.type !== 'image/webp') {
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, ancho, alto)
        resultado = await aBlob(canvas, 'image/jpeg', 0.85)
    }

    // Último intento con más compresión si todavía supera el límite.
    if (resultado && resultado.size > TAMANO_MAXIMO_SUBIDA) {
        resultado = await aBlob(canvas, resultado.type, 0.6)
    }

    bitmap.close()

    if (!resultado) throw new ErrorImagen('No se pudo procesar la imagen.')
    if (resultado.size > TAMANO_MAXIMO_SUBIDA) throw new ErrorImagen('La imagen sigue pesando más de 2 MB después de comprimirla.')

    return resultado
}
