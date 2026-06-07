interface ParagraphProps{
    className: string
    texto: string
}

export default function Paragraph({className, texto}: ParagraphProps){
    return(
        <p className={className} >{texto} </p>
    )
}