import { Leccion } from "./context.types"

export interface CrearLeccionResponse{
    ok: true
    nuevaLeccion: Leccion
}

//export interface GetLeccionesResponse{
//    ok: true
//    lecciones: Leccion[]
//}


export interface DeleteLeccionResponse{
    ok: true
    mensaje: string
}

//export interface GuardarLeccionRequest{
//    leccion: Leccion
//}

//export interface GuardarLeccionResponse{
//    ok: boolean
//    leccion: Leccion
//}