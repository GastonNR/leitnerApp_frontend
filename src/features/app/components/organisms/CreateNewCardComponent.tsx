import { useEffect, useRef, useState, FormEvent } from 'react'
import { useLecciones } from '../../context/LeccionesContext'
import QuestionAnswer from '../molecules/QuestionAnswer'
import type { NuevaTarjeta } from '../../types/context.types'
import styles from './css/createNewCard.module.css'

interface Errores {
    pregunta: string | null
    respuesta: string | null
}

export default function CreateNewCardComponent() {

    const { leccionActiva, crearNuevaTarjeta } = useLecciones()
    const [pregunta, setPregunta] = useState<string>('')
    const [respuesta, setRespuesta] = useState<string>('')
    const [errores, setErrores] = useState<Errores>({ pregunta: null, respuesta: null })
    const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error', texto: string } | null>(null)
    const [enviando, setEnviando] = useState<boolean>(false)
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    useEffect(() => () => clearTimeout(timer.current), [])

    const cambiar = (campo: keyof Errores, setter: (v: string) => void) => (valor: string) => {
        setter(valor)
        setErrores(prev => ({ ...prev, [campo]: null }))
        setAviso(null)
    }

    async function nuevaTarjeta(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!leccionActiva || enviando) return

        const nuevosErrores: Errores = {
            pregunta: pregunta.trim() ? null : 'Escribe la pregunta.',
            respuesta: respuesta.trim() ? null : 'Escribe la respuesta.',
        }
        setErrores(nuevosErrores)
        if (nuevosErrores.pregunta || nuevosErrores.respuesta) return

        const nueva: NuevaTarjeta = { pregunta, respuesta }

        setEnviando(true)
        const creada = await crearNuevaTarjeta(leccionActiva._id, nueva)
        setEnviando(false)

        if (!creada) {
            setAviso({ tipo: 'error', texto: 'No se pudo crear la tarjeta. Inténtalo de nuevo.' })
            return
        }

        setPregunta('')
        setRespuesta('')
        setAviso({ tipo: 'ok', texto: 'Tarjeta creada en la caja 1.' })
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setAviso(null), 3500)
    }

    return (
        <section className={styles.contenedor} aria-labelledby="titulo-nueva-tarjeta">
            <div className={styles.head}>
                <span className={styles.icono} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </span>
                <div>
                    <h2 id="titulo-nueva-tarjeta" className={styles.titulo}>Nueva tarjeta</h2>
                    <p className={styles.texto}>Entra en la caja 1 y se repasa mañana.</p>
                </div>
            </div>

            <form id="new-card-form" className={styles.form} onSubmit={nuevaTarjeta} noValidate>
                <QuestionAnswer
                    textAreaId={'card-question'}
                    textLabel={'Pregunta'}
                    placeholder={'Ej: ¿Cuál es la capital de Australia?'}
                    value={pregunta}
                    error={errores.pregunta}
                    setOnChange={cambiar('pregunta', setPregunta)}
                />

                <QuestionAnswer
                    textAreaId={'card-answer'}
                    textLabel={'Respuesta'}
                    placeholder={'Ej: Canberra'}
                    value={respuesta}
                    error={errores.respuesta}
                    setOnChange={cambiar('respuesta', setRespuesta)}
                />

                <div className={styles.acciones}>
                    <p className={`${styles.aviso} ${aviso?.tipo === 'error' ? styles.avisoError : ''}`} role="status" aria-live="polite">
                        {aviso?.texto}
                    </p>
                    <button type="submit" className={styles.boton} disabled={enviando}>
                        {enviando ? 'Creando…' : 'Crear tarjeta'}
                    </button>
                </div>
            </form>
        </section>
    )
}
