
interface HeadingProps{
  id?: string
  className: string
  texto: string
  nombreEncabezado: string
}

export default function Heading({id, nombreEncabezado, className, texto}: HeadingProps) {

  if(nombreEncabezado === 'tituloIcono'){
    return (
      <h1 id={id} className={className}>{texto}</h1>
    )
  }

  if(nombreEncabezado === 'tituloCaja'){
    return(
      <h3 id={id} className={className}>{texto}</h3>
    )
  }

}
