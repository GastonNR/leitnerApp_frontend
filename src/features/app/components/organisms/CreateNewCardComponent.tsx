import { useEffect, useRef, useState, FormEvent, KeyboardEvent, type CSSProperties } from 'react'
import { useLecciones } from '../../context/LeccionesContext'
import { useImagen } from '../../hooks/useImagen'
import QuestionAnswer from '../molecules/QuestionAnswer'
import SelectorImagen from '../molecules/SelectorImagen'
import Divisor from '../molecules/Divisor'
import type { NuevaTarjeta, Tarjeta } from '../../types/context.types'
import { textoPlano } from '../../utils/markdown'
import styles from './css/createNewCard.module.css'

// Repartos del espacio que elige el usuario, recordados entre visitas.
const CLAVE_PROPORCION = 'proporcion_pregunta'       // alto: pregunta / respuesta
const CLAVE_PROPORCION_IMAGEN = 'proporcion_texto'   // ancho: textos / imagen

function leerProporcion(clave: string, min: number, max: number): number {
    try {
        const v = Number(localStorage.getItem(clave))
        return v >= min && v <= max ? v : 0.5
    } catch {
        return 0.5
    }
}

function guardarProporcion(clave: string, nuevo: number): number {
    const valor = Math.round(nuevo * 100) / 100
    try { localStorage.setItem(clave, String(valor)) } catch { /* sin almacenamiento */ }
    return valor
}

interface Errores {
    pregunta: string | null
    respuesta: string | null
}

interface CreateNewCardProps {
    /* Si viene una tarjeta, el formulario la edita en vez de crear una nueva */
    tarjeta?: Tarjeta
    /* Número de caja de la tarjeta que se edita (solo para el subtítulo) */
    caja?: number
    /* Al editar: cerrar sin guardar, o después de actualizar */
    onCerrar?: () => void
}

// Formulario de tarjeta: crea una nueva (pestaña "Nueva tarjeta") o edita una
// existente (modal desde la caja). Al editar, el progreso de la tarjeta no cambia.
export default function CreateNewCardComponent({ tarjeta, caja, onCerrar }: CreateNewCardProps) {

    const esEdicion = !!tarjeta
    // Ids distintos para que el formulario de edición conviva con el de la pestaña
    const id = esEdicion
        ? { titulo: 'titulo-editar-tarjeta', form: 'edit-card-form', pregunta: 'edit-question', respuesta: 'edit-answer', textos: 'edit-columna-textos', imagen: 'edit-columna-imagen' }
        : { titulo: 'titulo-nueva-tarjeta', form: 'new-card-form', pregunta: 'card-question', respuesta: 'card-answer', textos: 'columna-textos', imagen: 'columna-imagen' }

    const { leccionActiva, crearNuevaTarjeta, editarTarjeta } = useLecciones()
    const [pregunta, setPregunta] = useState<string>(tarjeta?.pregunta ?? '')
    const [respuesta, setRespuesta] = useState<string>(tarjeta?.respuesta ?? '')
    const [errores, setErrores] = useState<Errores>({ pregunta: null, respuesta: null })
    const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error', texto: string } | null>(null)
    const [enviando, setEnviando] = useState<boolean>(false)
    // Imagen nueva elegida en este formulario (todavía no subida)
    const [imagen, setImagen] = useState<Blob | null>(null)
    // Al editar: el usuario quitó la imagen que la tarjeta ya tenía
    const [quitarActual, setQuitarActual] = useState<boolean>(false)
    const { url: urlActual } = useImagen(esEdicion && !quitarActual ? tarjeta.imagen : null)

    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const columnaTexto = useRef<HTMLDivElement>(null)
    const formulario = useRef<HTMLFormElement>(null)
    const [proporcion, setProporcion] = useState<number>(() => leerProporcion(CLAVE_PROPORCION, 0.2, 0.8))
    const [proporcionTexto, setProporcionTexto] = useState<number>(() => leerProporcion(CLAVE_PROPORCION_IMAGEN, 0.3, 0.75))

    const cambiarProporcion = (v: number) => setProporcion(guardarProporcion(CLAVE_PROPORCION, v))
    const cambiarProporcionTexto = (v: number) => setProporcionTexto(guardarProporcion(CLAVE_PROPORCION_IMAGEN, v))

    useEffect(() => () => clearTimeout(timer.current), [])

    const quitaImagen = esEdicion && quitarActual && !!tarjeta.imagen
    const hayCambios = !esEdicion
        || pregunta !== tarjeta.pregunta
        || respuesta !== tarjeta.respuesta
        || !!imagen
        || quitaImagen

    const cambiar = (campo: keyof Errores, setter: (v: string) => void) => (valor: string) => {
        setter(valor)
        setErrores(prev => ({ ...prev, [campo]: null }))
        setAviso(null)
    }

    // Elegir otra imagen la reemplaza; "Quitar" deja la tarjeta sin imagen
    // (también la que tenía antes de editar).
    function cambiarImagen(valor: Blob | null) {
        setImagen(valor)
        if (!valor) setQuitarActual(true)
        setAviso(null)
    }

    function validar(): boolean {
        const nuevosErrores: Errores = {
            pregunta: textoPlano(pregunta) ? null : 'Escribe la pregunta.',
            respuesta: textoPlano(respuesta) ? null : 'Escribe la respuesta.',
        }
        setErrores(nuevosErrores)
        return !nuevosErrores.pregunta && !nuevosErrores.respuesta
    }

    async function crear() {
        if (!leccionActiva) return
        const nueva: NuevaTarjeta = { pregunta, respuesta, imagen }

        setEnviando(true)
        const creada = await crearNuevaTarjeta(leccionActiva._id, nueva)
        setEnviando(false)

        if (creada !== true) {
            setAviso({ tipo: 'error', texto: creada })
            return
        }

        setPregunta('')
        setRespuesta('')
        setImagen(null)
        // Listo para escribir la siguiente
        document.getElementById(id.pregunta)?.focus()
        setAviso({ tipo: 'ok', texto: 'Tarjeta creada en la caja 1.' })
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setAviso(null), 3500)
    }

    async function actualizar() {
        if (!tarjeta) return
        if (!hayCambios) return onCerrar?.()

        setEnviando(true)
        const resultado = await editarTarjeta(tarjeta._id, { pregunta, respuesta, imagen, quitarImagen: quitaImagen })
        setEnviando(false)

        if (resultado !== true) {
            setAviso({ tipo: 'error', texto: resultado })
            return
        }
        onCerrar?.()
    }

    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (enviando || !validar()) return
        return esEdicion ? actualizar() : crear()
    }

    // Ctrl/Cmd + Enter guarda sin salir del teclado
    function atajoTeclado(e: KeyboardEvent<HTMLFormElement>) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            e.currentTarget.requestSubmit()
        }
    }

    return (
        <section className={`${styles.contenedor} ${esEdicion ? styles.enModal : ''}`} aria-labelledby={id.titulo}>
            <div className={styles.head}>
                <span className={styles.icono} aria-hidden="true">
                    {esEdicion ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
                            <path d="m14 8 3 3" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    )}
                </span>
                <div>
                    <h2 id={id.titulo} className={styles.titulo}>{esEdicion ? 'Editar tarjeta' : 'Nueva tarjeta'}</h2>
                    <p className={styles.texto}>
                        {esEdicion
                            ? `Su progreso no cambia: sigue en la caja ${caja ?? ''} con la misma fecha de repaso.`
                            : 'Entra en la caja 1 y se repasa mañana.'}
                    </p>
                </div>
            </div>

            <form
                ref={formulario}
                id={id.form}
                className={styles.form}
                // Ancho de cada columna (lo usa el CSS de escritorio)
                style={{ '--fr-texto': `${proporcionTexto}fr`, '--fr-imagen': `${1 - proporcionTexto}fr` } as CSSProperties}
                onSubmit={enviar}
                onKeyDown={atajoTeclado}
                noValidate
            >
                {/* Izquierda: pregunta y respuesta. Derecha: imagen de la pregunta */}
                <div ref={columnaTexto} id={id.textos} className={`${styles.columna} ${styles.columnaTexto}`}>
                    <div className={styles.panel} style={{ flexGrow: proporcion }}>
                        <QuestionAnswer
                            textAreaId={id.pregunta}
                            textLabel={'Pregunta'}
                            placeholder={'Ej: ¿Cuál es la capital de Australia?'}
                            value={pregunta}
                            error={errores.pregunta}
                            autoFocus={esEdicion}
                            setOnChange={cambiar('pregunta', setPregunta)}
                        />
                    </div>
                    <Divisor
                        contenedor={columnaTexto}
                        valor={proporcion}
                        onCambiar={cambiarProporcion}
                        etiqueta="Repartir el espacio entre pregunta y respuesta"
                        controla={`${id.pregunta} ${id.respuesta}`}
                    />
                    <div className={styles.panel} style={{ flexGrow: 1 - proporcion }}>
                        <QuestionAnswer
                            textAreaId={id.respuesta}
                            textLabel={'Respuesta'}
                            placeholder={'Ej: Canberra'}
                            value={respuesta}
                            error={errores.respuesta}
                            setOnChange={cambiar('respuesta', setRespuesta)}
                        />
                    </div>
                </div>

                <Divisor
                    orientacion="vertical"
                    contenedor={formulario}
                    valor={proporcionTexto}
                    onCambiar={cambiarProporcionTexto}
                    min={0.3}
                    max={0.75}
                    etiqueta="Repartir el ancho entre los textos y la imagen"
                    controla={`${id.textos} ${id.imagen}`}
                />

                <div id={id.imagen} className={styles.columna}>
                    <SelectorImagen
                        imagen={imagen}
                        urlActual={urlActual}
                        onCambiar={cambiarImagen}
                        deshabilitado={enviando}
                        expandido
                    />
                </div>

                <div className={styles.acciones}>
                    <p className={`${styles.aviso} ${aviso?.tipo === 'error' ? styles.avisoError : ''}`} role="status" aria-live="polite">
                        {aviso?.texto}
                    </p>
                    <span className={styles.atajo}><kbd>Ctrl</kbd> + <kbd>Enter</kbd></span>
                    {esEdicion && (
                        <button type="button" className={styles.botonSecundario} onClick={onCerrar} disabled={enviando}>
                            Cancelar
                        </button>
                    )}
                    <button type="submit" className={styles.boton} disabled={enviando}>
                        {esEdicion
                            ? (enviando ? 'Actualizando…' : 'Actualizar')
                            : (enviando ? 'Creando…' : 'Crear tarjeta')}
                    </button>
                </div>
            </form>
        </section>
    )
}
