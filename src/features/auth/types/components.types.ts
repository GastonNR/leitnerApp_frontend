import React, { Dispatch, SetStateAction } from "react"

export interface InputProps{
    labelText: string
    inputType: string
    inputId: string
    error: boolean
    setOnChange: React.Dispatch<React.SetStateAction<string>>
}

export interface InputPasswordProps{
    labelText: string
    inputId: string
    error: boolean
    setOnChange: React.Dispatch<SetStateAction<string>>
}

export interface ButtonSubmitProps{
    text: string
    onclick: ()=> Promise<void>
}