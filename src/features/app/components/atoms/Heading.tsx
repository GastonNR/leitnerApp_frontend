
interface HeadingProps{
  clase: string
  texto: string
  nombreEncabezado: string
}

export default function Heading({nombreEncabezado, clase, texto}: HeadingProps) {

  if(nombreEncabezado === 'tituloIcono'){
    return (
      <h1 className={clase}>{texto}</h1>
    )
  }

  if(nombreEncabezado === 'tituloCaja'){
    return(
      <h3 className={clase}>{texto}</h3>
    )
  }

}
