import BookIcon from '../atoms/BookIcon'

interface ActiveLectionHeaderProps{
    nombreLeccionActiva: string
}

export default function ActiveLectionHeader({nombreLeccionActiva}: ActiveLectionHeaderProps) {
    return (
        <span className="header-leccion-activa">
            <BookIcon/>
            {nombreLeccionActiva}
        </span>
    )
}
