import React, { MouseEventHandler } from "react"
import CountCards from "../components/CountCards"
import { Caja } from "./context.types"

export interface BoxProps{
    caja: string
    periodo: string
    parrafo: string
    setEstiloDisplay: React.Dispatch<React.SetStateAction<boolean>>
    setIndiceCaja: React.Dispatch<React.SetStateAction<string>>
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
    setOnChange: React.Dispatch<React.SetStateAction<string>>
}