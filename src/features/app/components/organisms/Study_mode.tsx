import { Dispatch, SetStateAction, useState } from 'react'
import StudyCard from './StudyCard'
import { useLecciones } from '../../context/LeccionesContext'
import Heading from '../atoms/Heading'
import IconSvg from '../atoms/IconSvg'
import Paragraph from '../atoms/Paragraph'
import CustomButton from '../molecules/CustomButton'
import "./css/study_mode.css"

interface Study_modeProps{
    setModalStudyCard: Dispatch<SetStateAction<boolean>>
}

export default function Study_mode({setModalStudyCard}: Study_modeProps) {

    const { tarjetasDeHoy } = useLecciones()
    const [tarjetaIndex, setTarjetaIndex] = useState<number>(0)

    return (
        <div className="study_modal">

            <div id="study-container" className="study-container">
                <div className="modal-header">
                    <Heading variante='h2' className={'subtitulo-contenedor-tarjetas'} texto={'Tarjetas para estudiar hoy'} />
                    <CustomButton
                        className={'lm-close'}
                        variante={'cerrar_btn'}
                        onclick={() => setModalStudyCard(false)}
                    />
                </div>
                <div className="contenedor-tarjetas">
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
        </div>
    )
}
