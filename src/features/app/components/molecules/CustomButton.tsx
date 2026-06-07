import { Dispatch, SetStateAction } from 'react'
import IconSvg from '../atoms/IconSvg'

interface CustomButtonProps {
    id?: string
    className: string
    variante: string
    texto?: string
    onclick: Dispatch<SetStateAction<boolean>>
}

export default function CustomButton({id, className, variante, texto, onclick }: CustomButtonProps) {

    if (variante === 'btn_leccion') {
        return (
            <button className={className} onClick={() => onclick(true)}>
                <IconSvg imagenSvg='libro' />
                {texto}
            </button>
        )
    }


    if (variante === 'cerrar_btn') {
        return (
            <button id={id} className={className} onClick={() => onclick(false)}>
                <IconSvg imagenSvg='Xcerrar' />
            </button>
        )
    }
}
