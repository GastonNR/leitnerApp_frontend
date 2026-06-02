import { ReactNode, SetStateAction } from "react"

// LECCIONES CONTEXT
export interface LeccionesContextType{
    tarjetasDeHoy: Tarjeta[]
    lecciones: Array<Leccion>
    setLecciones: React.Dispatch<React.SetStateAction<Leccion[]>>
    leccionActivaId: string | null
    setLeccionActivaId: React.Dispatch<SetStateAction<string | null>>
    leccionActiva: Leccion | undefined
    modalLeccionesAbierto: boolean
    setModalLeccionesAbierto: React.Dispatch<SetStateAction<boolean>>
    crearLeccion: (nombre: string)=> Promise<void>
    cambiarLeccion: (leccionId: string)=> void
    eliminarLeccion: (id: string)=> Promise<void>
    crearNuevaTarjeta: (leccionId: string, tarjeta: NuevaTarjeta)=> Promise<void>
    actualizarTarjeta: (esCorrecta: boolean, tarjeta: Tarjeta)=> Promise<Leccion[]>
    guardar: (leccionesActualizadas: Leccion[])=> Promise<{ok: true} | undefined>
    eliminarTarjetaContext: (indexCaja: number, cajaElegida: Tarjeta[], indiceCajaNum: number)=> Promise<boolean>
}

export interface LeccionesProviderProps{
    children: ReactNode
}
// DOMINIO
export interface Leccion{
    nombre: string
    cajas: Caja[]
    _id: string
}

export interface Caja{
    nombre: string
    tarjetas: Tarjeta[]
    _id: string
}

export interface Tarjeta{
    pregunta: string
    respuesta: string
    nivel: number
    ultima_revision: Date
    proxima_revision: Date
    es_correcta: boolean
    _id: string
}

export interface NuevaTarjeta{
    pregunta: string
    respuesta: string
}