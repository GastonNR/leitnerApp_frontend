import { api } from "../../../shared/api/axios"
import { EdicionTarjeta, Leccion, NuevaTarjeta, Tarjeta } from "../types/context.types"
import { CrearLeccionResponse, DeleteLeccionResponse } from "../types/services.types"

// MANEJO DE LECCIONES

export const crearLeccionService = async (nuevaLeccion: string): Promise<Leccion> => {

    const {data} = await api.post<CrearLeccionResponse>('/lecciones/leccion', {nuevaLeccion})

    if(!data.ok) throw new Error("Error al crear lección.")
    console.log("data: ", data)   
    return data.nuevaLeccion

}

export const getLeccionesService = async (): Promise<Leccion[]> => {

    const {data} = await api.get<Leccion[]>('/lecciones')
    return data
}

export const deleteLeccionService = async (id: string): Promise<DeleteLeccionResponse> =>{

    const {data} = await api.delete<DeleteLeccionResponse>(`lecciones/${id}`)
    if(!data.ok) throw new Error('No se ha podido eliminar la lección')
    return data

}

export const guardarLeccionService = async (leccion: Leccion): Promise<Leccion> => {
    
    const leccionId = leccion._id
    const {data} = await api.put<Leccion>(`/lecciones/leccion`, leccion)
    
    return data

}

// MANEJO DE TARJETAS

function nombreArchivo(imagen: Blob): string {
    const extension = imagen.type.split('/')[1] || 'img'
    return `imagen.${extension}`
}

// Descarga una imagen con el token (un <img src> no puede enviarlo).
export const obtenerImagenService = async (imagenId: string): Promise<Blob> => {
    const {data} = await api.get<Blob>(`/imagenes/${imagenId}`, { responseType: 'blob' })
    return data
}

export const crearNuevaTarjetaService = async (leccion_id: string, datosTarjeta: NuevaTarjeta): Promise<Tarjeta> => {
    
    const { pregunta, respuesta, imagen } = datosTarjeta

    if (!imagen) {
        const {data} = await api.post<Tarjeta>(`/lecciones/leccion/${leccion_id}`, { pregunta, respuesta })
        return data
    }

    // Con imagen: multipart/form-data en una sola petición (tarjeta + imagen).
    // El Content-Type explícito evita que axios convierta el FormData a JSON;
    // el navegador completa el boundary.
    const formulario = new FormData()
    formulario.append('pregunta', pregunta)
    formulario.append('respuesta', respuesta)
    formulario.append('imagen', imagen, nombreArchivo(imagen))

    const {data} = await api.post<Tarjeta>(`/lecciones/leccion/${leccion_id}`, formulario, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data

}

export const eliminarTarjetaService = async (tarjetaId: string): Promise<void> => {

    const respuesta = await api.delete(`/lecciones/leccion/${tarjetaId}`)
    if(respuesta.status !== 204) throw new Error('No se pudo eliminar la tarjeta.')

}
// Edita texto e imagen en una sola petición. El progreso de la tarjeta no cambia.
export const editarTarjetaService = async (tarjetaId: string, datos: EdicionTarjeta): Promise<Tarjeta> => {

    const { pregunta, respuesta, imagen, quitarImagen } = datos

    if (!imagen) {
        const {data} = await api.patch<Tarjeta>(`/lecciones/leccion/${tarjetaId}`, { pregunta, respuesta, quitarImagen: !!quitarImagen })
        return data
    }

    const formulario = new FormData()
    formulario.append('pregunta', pregunta)
    formulario.append('respuesta', respuesta)
    formulario.append('imagen', imagen, nombreArchivo(imagen))

    const {data} = await api.patch<Tarjeta>(`/lecciones/leccion/${tarjetaId}`, formulario, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
}

// IMAGEN DE UNA TARJETA EXISTENTE

// Agrega o reemplaza la imagen. Devuelve la tarjeta actualizada.
export const cambiarImagenTarjetaService = async (tarjetaId: string, imagen: Blob): Promise<Tarjeta> => {
    const formulario = new FormData()
    formulario.append('imagen', imagen, nombreArchivo(imagen))

    const {data} = await api.put<Tarjeta>(`/imagenes/tarjeta/${tarjetaId}`, formulario, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
}

// Quita la imagen. Devuelve la tarjeta actualizada.
export const eliminarImagenTarjetaService = async (tarjetaId: string): Promise<Tarjeta> => {
    const {data} = await api.delete<Tarjeta>(`/imagenes/tarjeta/${tarjetaId}`)
    return data
}
