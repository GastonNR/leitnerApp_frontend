import { Dispatch, SetStateAction } from "react"
import { Caja, Tarjeta } from "./context.types"

export interface BoxProps{
    caja: string
    periodo: string
    /* Datos de la caja para mostrar el contador dentro de la tarjeta. */
    datosCaja?: Caja
    /** Tarjetas de esta caja que tocan hoy (o están vencidas) */
    pendientesHoy: number
    /** Cantidad de la caja más llena, para la barra proporcional */
    maximo: number
    setEstiloDisplay: Dispatch<SetStateAction<boolean>>
    setIndiceCaja: Dispatch<SetStateAction<string>>
}

export interface CardElementProps{
    pregunta: string
    respuesta: string
    proxima_revision: Date
    imagen?: string | null
    onEliminar: () => void
    /* Agregar o reemplazar la imagen (ya comprimida). Devuelve true o un mensaje de error. */
    onCambiarImagen: (imagen: Blob) => Promise<true | string>
    onQuitarImagen: () => Promise<true | string>
}

export interface QuestionAnswerProps{
    textAreaId: string
    textLabel: string
    value: string
    placeholder?: string
    error?: string | null
    setOnChange: (valor: string) => void
}

export interface BoxModalProps{
    setEstiloDisplay: Dispatch<SetStateAction<boolean>>
    indiceCaja: string
}

export interface StudyCardProps{
    tarjeta: Tarjeta
    /** true mientras se procesa la respuesta anterior */
    bloqueado: boolean
    onResponder: (esCorrecta: boolean) => void
}
