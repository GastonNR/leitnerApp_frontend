import { MouseEventHandler, Dispatch, SetStateAction } from "react"
import { Caja, Tarjeta } from "./context.types"

export interface BoxProps{
    caja: string
    periodo: string
    parrafo: string
    /* Datos de la caja para mostrar el contador dentro de la tarjeta. */
    datosCaja?: Caja
    resaltado: string
    setEstiloDisplay: Dispatch<SetStateAction<boolean>>
    setIndiceCaja: Dispatch<SetStateAction<string>>
}

export interface CardElementProps{
    pregunta: string
    respuesta: string
    proxima_revision: Date
    onEliminar: MouseEventHandler<HTMLButtonElement>
}

export interface CountCardsProps{
    id: string
    texto: string
    resaltado: string
    caja: Caja
}

export interface QuestionAnswerProps{
    textAreaId: string
    textLabel: string
    value: string
    setOnChange: Dispatch<SetStateAction<string>>
}

export interface BoxModalProps{
    setEstiloDisplay: Dispatch<SetStateAction<boolean>>
    indiceCaja: string
}

export interface StudyCardProps{
    cantTarjetas: number
    tarjeta: Tarjeta
    tarjetaIndex: number
    setTarjetaIndex: Dispatch<SetStateAction<number>>
}