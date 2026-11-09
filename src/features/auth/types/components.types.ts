import { ReactNode } from "react"

export interface InputProps{
    labelText: string
    inputType: string
    inputId: string
    /** Mensaje de error del campo; null o vacío si es válido */
    error?: string | null
    /** Texto de ayuda que se muestra cuando no hay error */
    hint?: string
    placeholder?: string
    autoComplete?: string
    setOnChange: (valor: string) => void
}

export interface InputPasswordProps{
    labelText: string
    inputId: string
    error?: string | null
    hint?: string
    placeholder?: string
    autoComplete?: string
    setOnChange: (valor: string) => void
}

export interface ButtonSubmitProps{
    text: string
    loading?: boolean
    loadingText?: string
}

export interface AuthLayoutProps{
    titulo: string
    subtitulo: string
    children: ReactNode
    pie: ReactNode
}

export interface AvisoProps{
    tipo: 'error' | 'exito'
    children: ReactNode
}
