import { api } from "../../../shared/api/axios"
import { Asignatura, Caja, EdicionTarjeta, NuevaTarjeta, Repaso, Tarjeta, Tema } from "../types/context.types"

// ASIGNATURAS

// Todas las asignaturas del usuario, con sus temas, cajas y tarjetas.
export const getAsignaturasService = async (): Promise<Asignatura[]> => {
    const {data} = await api.get<Asignatura[]>('/asignaturas')
    return data
}

export const crearAsignaturaService = async (nombre: string): Promise<Asignatura> => {
    const {data} = await api.post<Asignatura>('/asignaturas', { nombre })
    return data
}

export const renombrarAsignaturaService = async (asignaturaId: string, nombre: string): Promise<Asignatura> => {
    const {data} = await api.patch<Asignatura>(`/asignaturas/${asignaturaId}`, { nombre })
    return data
}

export const eliminarAsignaturaService = async (asignaturaId: string): Promise<void> => {
    await api.delete(`/asignaturas/${asignaturaId}`)
}

// TEMAS

// Crea un tema con sus 5 cajas vacías.
export const crearTemaService = async (asignaturaId: string, nombre: string): Promise<Tema> => {
    const {data} = await api.post<Tema>(`/asignaturas/${asignaturaId}/temas`, { nombre })
    return data
}

export const renombrarTemaService = async (temaId: string, nombre: string): Promise<Tema> => {
    const {data} = await api.patch<Tema>(`/temas/${temaId}`, { nombre })
    return data
}

// Mueve el tema (con sus tarjetas y progreso) a otra asignatura.
export const moverTemaService = async (temaId: string, asignaturaId: string): Promise<Tema> => {
    const {data} = await api.patch<Tema>(`/temas/${temaId}/asignatura`, { asignaturaId })
    return data
}

export const eliminarTemaService = async (temaId: string): Promise<void> => {
    await api.delete(`/temas/${temaId}`)
}

// Guarda una sesión de estudio: el backend aplica el algoritmo Leitner y
// devuelve el tema con las tarjetas ya repartidas en sus nuevas cajas.
export const guardarSesionService = async (temaId: string, cajas: Caja[]): Promise<Tema> => {
    const {data} = await api.put<Tema>(`/temas/${temaId}/cajas`, { cajas })
    return data
}

// HISTORIAL (métricas)

// Sesiones de estudio guardadas en los últimos `dias` días, de la más vieja a la más nueva.
export const getRepasosService = async (dias: number): Promise<Repaso[]> => {
    const {data} = await api.get<Repaso[]>('/repasos', { params: { dias } })
    return data
}

// TARJETAS

function nombreArchivo(imagen: Blob): string {
    const extension = imagen.type.split('/')[1] || 'img'
    return `imagen.${extension}`
}

// Descarga una imagen con el token (un <img src> no puede enviarlo).
export const obtenerImagenService = async (imagenId: string): Promise<Blob> => {
    const {data} = await api.get<Blob>(`/imagenes/${imagenId}`, { responseType: 'blob' })
    return data
}

// Con imagen: multipart/form-data en una sola petición (tarjeta + imagen).
// El Content-Type explícito evita que axios convierta el FormData a JSON;
// el navegador completa el boundary.
function formularioTarjeta(pregunta: string, respuesta: string, imagen: Blob): FormData {
    const formulario = new FormData()
    formulario.append('pregunta', pregunta)
    formulario.append('respuesta', respuesta)
    formulario.append('imagen', imagen, nombreArchivo(imagen))
    return formulario
}

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

// Nueva tarjeta en la caja 1 del tema.
export const crearNuevaTarjetaService = async (temaId: string, datosTarjeta: NuevaTarjeta): Promise<Tarjeta> => {

    const { pregunta, respuesta, imagen } = datosTarjeta
    const ruta = `/temas/${temaId}/tarjetas`

    const {data} = imagen
        ? await api.post<Tarjeta>(ruta, formularioTarjeta(pregunta, respuesta, imagen), multipart)
        : await api.post<Tarjeta>(ruta, { pregunta, respuesta })
    return data
}

export const eliminarTarjetaService = async (tarjetaId: string): Promise<void> => {
    await api.delete(`/tarjetas/${tarjetaId}`)
}

// Edita texto e imagen en una sola petición. El progreso de la tarjeta no cambia.
export const editarTarjetaService = async (tarjetaId: string, datos: EdicionTarjeta): Promise<Tarjeta> => {

    const { pregunta, respuesta, imagen, quitarImagen } = datos
    const ruta = `/tarjetas/${tarjetaId}`

    const {data} = imagen
        ? await api.patch<Tarjeta>(ruta, formularioTarjeta(pregunta, respuesta, imagen), multipart)
        : await api.patch<Tarjeta>(ruta, { pregunta, respuesta, quitarImagen: !!quitarImagen })
    return data
}
