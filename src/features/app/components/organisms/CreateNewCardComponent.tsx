import { useState, MouseEvent } from 'react'
import { useLecciones } from '../../context/LeccionesContext'
import QuestionAnswer from '../molecules/QuestionAnswer'
import type { NuevaTarjeta } from '../../types/context.types'
import Button from '../atoms/Button'
import Heading from '../atoms/Heading'
import './css/createNewCard.modules.css'


export default function CreateNewCardComponent() {

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
        <div className="contenedor_crearNuevaTarjeta">
            <Heading variante={'h2'} className={'sidebar_titulo'} texto={'Crear nueva tarjeta'} />

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

                <div className="button_container">
                    <Button
                        className='btn_crearTarjeta'
                        texto={'Crear Tarjeta'}
                        onclick={nuevaTarjeta}
                    />
                </div>

            </form>
        </div>
    )
}
