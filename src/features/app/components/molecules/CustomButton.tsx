import { Dispatch, SetStateAction, MouseEvent } from 'react'
import IconSvg from '../atoms/IconSvg'

interface CustomButtonProps {
    id?: string
    className: string
    variante: 'btn_leccion' | 'cerrar_btn' | 'lm-header-btn'
    texto?: string
    onclick: (e: MouseEvent<HTMLButtonElement>) => void
}

export default function CustomButton({ id, className, variante, texto, onclick }: CustomButtonProps) {

    const incons: Partial<Record<typeof variante, string>> = {
        btn_leccion: 'libro',
        cerrar_btn: 'Xcerrar'
    }

    if (variante === 'btn_leccion') {
        return (
            <button className={className} onClick={onclick}>
                <IconSvg imagenSvg='libro' />
                {texto}
            </button>
        )
    }


    if (variante === 'cerrar_btn') {
        return (
            <button id={id} className={className} onClick={onclick}>
                <IconSvg imagenSvg='Xcerrar' />
            </button>
        )
    }

    if (variante === 'lm-header-btn') {
        return (
            <button className={className} onClick={onclick} >{texto}</button>
        )
    }

}
