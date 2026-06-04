import { api } from "../../../shared/api/axios"
import { Leccion, NuevaTarjeta, Tarjeta } from "../types/context.types"
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
    const {data} = await api.put<Leccion>(`/leccion/${leccionId}`, leccion)
    //if(!data.ok) throw new Error("Error al guardar la lección")
    
    return data

}

// MANEJO DE TARJETAS

export const crearNuevaTarjetaService = async (leccion_id: string, datosTarjeta: NuevaTarjeta): Promise<Tarjeta> => {
    
    const {data} = await api.post<Tarjeta>(`/leccion/${leccion_id}`, datosTarjeta)
    return data

}

export const eliminarTarjetaService = async (tarjetaId: string): Promise<void> => {

    const respuesta = await api.delete(`/leccion/${tarjetaId}`)
    if(respuesta.status !== 204) throw new Error('No se pudo eliminar la tarjeta.')

}