import { MouseEventHandler } from "react"


interface ButtonProps{
    className?: string,
    texto: string,
    data_box?: string
    onclick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button({className, texto, data_box, onclick}: ButtonProps) {

    return (
        <button className={className} data-box={data_box} onClick={onclick}>{texto}</button>
    )
    
}
