import { useState } from 'react'
import StudyCard from './StudyCard'
import { useLecciones } from '../../context/LeccionesContext'
import Heading from '../atoms/Heading'
import IconSvg from '../atoms/IconSvg'
import Paragraph from '../atoms/Paragraph'
import "../css/study_mode.css"

export default function Study_mode() {

    const {tarjetasDeHoy} = useLecciones()
    const [tarjetaIndex, setTarjetaIndex] = useState<number>(0)

    return (
        <div id="study-container" className="study-container">

            <div className="contenedor-tarjetas">
                <Heading variante='h2' className={'subtitulo-contenedor-tarjetas'} texto={'Tarjetas para estudiar hoy'} />
                <div>
                    <span id="cards-remaining" className="cards-remaining">0 tarjetas restantes</span>
                </div>
            </div>
            {
                (tarjetasDeHoy.length > 0 && tarjetaIndex >= 0) ?
                    <StudyCard
                        cantTarjetas={tarjetasDeHoy.length}
                        tarjeta={tarjetasDeHoy[tarjetaIndex]}
                        tarjetaIndex={tarjetaIndex}
                        setTarjetaIndex={setTarjetaIndex}
                    />
                    :
                    <div id="study-empty" className="study-empty">
                        <IconSvg imagenSvg={'libro2'} />
                        <Heading variante='h3' className={'texto-study-empty'} texto={'No hay más tarjetas para estudiar hoy'} />
                        
                        <Paragraph className={'parr-study-empty'} texto={'Crea nuevas tarjetas o espera hasta mañana para continuar estudiando.'} />
                        
                    </div>
            }

        </div>
    )
}
