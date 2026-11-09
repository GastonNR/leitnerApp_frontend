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
    crearLeccion: (nombre: string)=> Promise<void> // lanza Error con el mensaje del backend si falla
    cambiarLeccion: (leccionId: string)=> void
    eliminarLeccion: (id: string)=> Promise<void>
    crearNuevaTarjeta: (leccionId: string, tarjeta: NuevaTarjeta)=> Promise<true | string> // true o el mensaje de error
    actualizarTarjeta: (esCorrecta: boolean, tarjeta: Tarjeta)=> Promise<Leccion[]>
    guardar: (leccionesActualizadas: Leccion[])=> Promise<{ok: true} | undefined>
    eliminarTarjetaContext: (indexCaja: number, cajaElegida: Tarjeta[], indiceCajaNum: number)=> Promise<boolean>
    cambiarImagenTarjeta: (tarjetaId: string, imagen: Blob)=> Promise<true | string> // true o el mensaje de error
    eliminarImagenTarjeta: (tarjetaId: string)=> Promise<true | string>
    editarTarjeta: (tarjetaId: string, datos: EdicionTarjeta)=> Promise<true | string> // true o el mensaje de error
}

export interface LeccionesProviderProps{
    children: ReactNode
}
// DOMINIO
export interface Leccion{
    nombre: string
    fechaCreacion: Date
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
    es_correcta: boolean | null
    /* _id de la imagen asociada a la pregunta (se descarga de /imagenes/:id) */
    imagen?: string | null
    _id: string
}

// Cambios de una tarjeta existente. imagen: la nueva (reemplaza a la actual);
// quitarImagen: borrar la actual sin poner otra.
export interface EdicionTarjeta{
    pregunta: string
    respuesta: string
    imagen?: Blob | null
    quitarImagen?: boolean
}

export interface NuevaTarjeta{
    pregunta: string
    respuesta: string
    /* Imagen ya comprimida en el navegador, lista para subir */
    imagen?: Blob | null
}