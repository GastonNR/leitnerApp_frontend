import { Dispatch, SetStateAction } from 'react'
import BookIcon from '../atoms/BookIcon'

interface LectionButtonProps{
    texto: string
    onclick: Dispatch<SetStateAction<boolean>>
}

export default function LectionButton({texto, onclick}: LectionButtonProps) {
    return (
        <button className="header-btn header-btn--leccion" onClick={() => onclick(true)}>
            <BookIcon />
            {texto}
        </button>
    )
}
