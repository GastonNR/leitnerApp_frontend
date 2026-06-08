import { useState, MouseEvent } from 'react'
import CountCards from '../molecules/CountCards'
import { useLecciones } from '../../context/LeccionesContext'
import QuestionAnswer from '../molecules/QuestionAnswer'
import { NuevaTarjeta } from '../../types/context.types'
import "../../css/sidebar.css"
import Heading from '../atoms/Heading'
import Paragraph from '../atoms/Paragraph'


export default function Sidebar() {

    const { leccionActiva } = useLecciones()

    return (
        <div className="sidebar">
            <div className="sidebar_superior">
                <Heading variante={'h2'} className={'sidebar_titulo'} texto={'Sistema Leitner'} />
                <Paragraph className={'sidebar_parr'} texto={'Organiza tus tarjetas en 5 cajas según tu nivel de conocimiento. Las tarjetas se mueven entre cajas según tu desempeño.'} />

                {leccionActiva && (
                    <div className="contenedor_texto_caja_sidebar">
                        <CountCards id={"box-1-count"} texto={"Caja 1 (Diario)"} resaltado={"cant_cards cant_cards_1"} caja={leccionActiva.cajas[0]} />
                        <CountCards id={"box-2-count"} texto={"Caja 2 (3 días)"} resaltado={"cant_cards cant_cards_2"} caja={leccionActiva.cajas[1]} />
                        <CountCards id={"box-3-count"} texto={"Caja 3 (7 días)"} resaltado={"cant_cards cant_cards_3"} caja={leccionActiva.cajas[2]} />
                        <CountCards id={"box-4-count"} texto={"Caja 4 (14 días)"} resaltado={"cant_cards cant_cards_4"} caja={leccionActiva.cajas[3]} />
                        <CountCards id={"box-5-count"} texto={"Caja 5 (30 días)"} resaltado={"cant_cards cant_cards_5"} caja={leccionActiva.cajas[4]} />
                    </div>
                )}
            </div>

        </div>
    )
}
