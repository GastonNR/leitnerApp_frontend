
interface HeadingProps{
  id?: string
  className: string
  texto: string
  variante: string
}

export default function Heading({id, variante, className, texto}: HeadingProps) {

  if(variante === 'h1'){
    return (
      <h1 id={id} className={className}>{texto}</h1>
    )
  }

  if(variante === 'h2'){
    return (
      <h2 id={id} className={className}>{texto}</h2>
    )
  }

  if(variante === 'h3'){
    return(
      <h3 id={id} className={className}>{texto}</h3>
    )
  }

}
