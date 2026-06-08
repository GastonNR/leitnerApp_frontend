interface ParagraphProps{
    id?: string
    className?: string
    texto: string
}

export default function Paragraph({id, className, texto}: ParagraphProps){
    return(
        <p id={id} className={className} >{texto}</p>
    )
}