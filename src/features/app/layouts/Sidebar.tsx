import { useState, MouseEvent } from 'react'
import CountCards from '../components/CountCards'
import { useLecciones } from '../context/LeccionesContext'
import QuestionAnswer from '../components/QuestionAnswer'
import "../css/sidebar.css"
import { NuevaTarjeta } from '../types/context.types'


export default function Sidebar() {

    const { leccionActiva, crearNuevaTarjeta } = useLecciones()

    const [pregunta, setPregunta] = useState<string>('')
    const [respuesta, setRespuesta] = useState<string>('')

    async function nuevaTarjeta(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        if (!leccionActiva) {
            alert("Debe crear una lección o tiene que haber una lección activa para poder crear tarjetas.")
            return
        }

        let comprobacionCampos: number = 0

        if (!pregunta) {
            alert("El campo de pregunta está vacío")
            comprobacionCampos++
        }
        if (!respuesta) {
            alert("El campo de respuesta está vacío")
            comprobacionCampos++
        }

        if (comprobacionCampos === 0) {

            const nuevaTarjeta: NuevaTarjeta = {
                pregunta: pregunta,
                respuesta: respuesta
            }

            if (leccionActiva) await crearNuevaTarjeta(leccionActiva._id, nuevaTarjeta)

            setPregunta('')
            setRespuesta('')
        }

    }

    return (
        <div className="sidebar">
            <div className="sidebar_superior">
                <h2 className="sidebar_titulo">Sistema Leitner</h2>
                <p className="sidebar_parr">Organiza tus tarjetas en 5 cajas según tu nivel de conocimiento. Las tarjetas se mueven entre cajas según tu desempeño.</p>

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

            <div className="contenedor_sidebar_inferior">
                <h2 className="sidebar_titulo">Crear nueva tarjeta</h2>
                <form id="new-card-form" className="form_card">
                    <QuestionAnswer
                        textAreaId={'card-question'}
                        textLabel={'Pregunta'}
                        value={pregunta}
                        setOnChange={setPregunta}
                    />

                    <QuestionAnswer
                        textAreaId={'card-answer'}
                        textLabel={'Respuesta'}
                        value={respuesta}
                        setOnChange={setRespuesta}
                    />

                    <div>
                        <button type="submit" className="btn_crearTarjeta" onClick={nuevaTarjeta}>Crear tarjeta</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
