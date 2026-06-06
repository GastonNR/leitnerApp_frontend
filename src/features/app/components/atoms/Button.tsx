import { MouseEventHandler } from "react"


interface ButtonProps{
    clase: string,
    texto: string,
    onclick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button({clase, texto, onclick}: ButtonProps) {

    return (
        <button className={clase} onClick={onclick}>{texto}</button>
    )
    
}
