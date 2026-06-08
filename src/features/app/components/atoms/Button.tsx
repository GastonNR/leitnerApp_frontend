import { MouseEventHandler } from "react"
import './css/button.modules.css'


interface ButtonProps{
    id?: string
    className?: string,
    texto: string,
    data_box?: string
    onclick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button({id, className, texto, data_box, onclick}: ButtonProps) {

    return (
        <button
            id={id}
            className={className}
            data-box={data_box}
            onClick={onclick}
        >
            {texto}
        </button>
    )
    
}
