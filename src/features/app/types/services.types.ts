import { Leccion } from "./context.types"

export interface CrearLeccionRequest{
    nuevaLeccion: string
}

export interface CrearLeccionResponse{
    nuevaLeccion: Leccion
}

