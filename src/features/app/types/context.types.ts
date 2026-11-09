import { ReactNode, SetStateAction } from "react"

// ASIGNATURAS CONTEXT
export interface AsignaturasContextType{
    asignaturas: Asignatura[]
    // Tema que se estudia ahora y la asignatura a la que pertenece
    temaActivo: Tema | undefined
    asignaturaActiva: Asignatura | undefined
    // Tarjetas del tema activo que tocan hoy (o la caja 1 si no toca ninguna)
    tarjetasDeHoy: Tarjeta[]
    // Cambia cada vez que el historial de repasos cambia en el servidor
    // (sesión guardada, tema o asignatura borrados): las métricas lo vuelven a pedir
    versionRepasos: number
    modalTemasAbierto: boolean
    setModalTemasAbierto: React.Dispatch<SetStateAction<boolean>>
    // Las de crear lanzan Error con el mensaje del backend si fallan
    crearAsignatura: (nombre: string)=> Promise<Asignatura>
    renombrarAsignatura: (asignaturaId: string, nombre: string)=> Promise<void>
    eliminarAsignatura: (asignaturaId: string)=> Promise<void>
    crearTema: (asignaturaId: string, nombre: string)=> Promise<Tema> // queda como tema activo
    renombrarTema: (temaId: string, nombre: string)=> Promise<void>
    moverTema: (temaId: string, asignaturaId: string)=> Promise<void>
    eliminarTema: (temaId: string)=> Promise<void>
    cambiarTema: (temaId: string)=> void
    crearNuevaTarjeta: (temaId: string, tarjeta: NuevaTarjeta)=> Promise<true | string> // true o el mensaje de error
    // Sesión de estudio: marcar una respuesta (solo en el navegador) y guardar el tema
    actualizarTarjeta: (esCorrecta: boolean, tarjeta: Tarjeta)=> Tema | undefined
    guardar: (tema: Tema)=> Promise<boolean>
    eliminarTarjeta: (tarjetaId: string)=> Promise<boolean>
    editarTarjeta: (tarjetaId: string, datos: EdicionTarjeta)=> Promise<true | string> // true o el mensaje de error
}

export interface AsignaturasProviderProps{
    children: ReactNode
}

// DOMINIO
// Asignatura → temas → 5 cajas → tarjetas
export interface Asignatura{
    nombre: string
    fechaCreacion: Date
    temas: Tema[]
    _id: string
}

export interface Tema{
    nombre: string
    fechaCreacion: Date
    cajas: Caja[]
    _id: string
}

// Una sesión de estudio guardada (historial para las métricas)
export interface Repaso{
    tema: string
    fecha: string
    aciertos: number
    fallos: number
}

export interface Caja{
    nombre: string
    tarjetas: Tarjeta[]
    _id: string
}

// Una respuesta de la sesión de estudio, tal como se envía al backend.
export interface RespuestaSesion{
    _id: string
    es_correcta: boolean
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