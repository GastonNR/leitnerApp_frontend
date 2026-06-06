
interface CircleProps{
    id: string
    resaltado: string
    cantidadTarjetas: number
}

export default function Circle({id, resaltado, cantidadTarjetas}: CircleProps) {
  return (
    <span id={id} className={resaltado}>{cantidadTarjetas}</span>
  )
}
