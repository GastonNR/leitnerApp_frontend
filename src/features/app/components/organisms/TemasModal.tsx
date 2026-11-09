import { createPortal } from 'react-dom'
import { useState, ChangeEvent, FormEvent, KeyboardEvent } from "react"
import { useAsignaturas } from "../../context/AsignaturasContext"
import type { Asignatura, Tema } from "../../types/context.types"
import CerrarModal from "../molecules/CerrarModal"
import Label from "../atoms/Label"
import Input from "../atoms/Input"
import modal from "./css/modal.module.css"
import styles from "./css/temasModal.module.css"

// Igual que el límite del backend (NOMBRE_MAX en config/limites.ts).
const NOMBRE_MAX = 80

const iconoBorrar = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
)

const iconoEditar = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
        <path d="m14 8 3 3" />
    </svg>
)

const iconoMover = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M9 13h6m-2-2 2 2-2 2" />
    </svg>
)

const iconoMas = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
    </svg>
)

const contarTarjetas = (tema: Tema) => tema.cajas.reduce((n, c) => n + (c.tarjetas?.length || 0), 0)
const plural = (n: number, palabra: string) => `${n} ${palabra}${n !== 1 ? 's' : ''}`

interface FormNombreProps {
    id: string
    etiqueta: string
    placeholder: string
    ayuda: string
    textoBoton: string
    textoEnviando?: string
    // Al renombrar: el nombre actual
    inicial?: string
    // Nombres que ya existen en el mismo lugar (para avisar antes de enviar)
    existentes: string[]
    mensajeDuplicado: string
    onGuardar: (nombre: string) => Promise<void>
    onCancelar?: () => void
}

// Formulario de un solo campo para crear o renombrar una asignatura o un tema.
function FormNombre({ id, etiqueta, placeholder, ayuda, textoBoton, textoEnviando = 'Creando…', inicial = "", existentes, mensajeDuplicado, onGuardar, onCancelar }: FormNombreProps) {
    const [nombre, setNombre] = useState<string>(inicial)
    const [error, setError] = useState<string>("")
    const [creando, setCreando] = useState<boolean>(false)

    const enviar = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (creando) return
        const limpio = nombre.trim()
        if (!limpio) return setError("El nombre no puede estar vacío.")
        // Renombrar sin cambios: no hace falta llamar al servidor
        if (inicial && limpio === inicial) return onCancelar?.()
        if (existentes.some(n => n.toLowerCase() === limpio.toLowerCase())) return setError(mensajeDuplicado)

        setCreando(true)
        try {
            await onGuardar(limpio)
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo guardar.")
            setCreando(false)
        }
    }

    return (
        <form className={`${styles.form} ${onCancelar ? styles.formEnLista : ''}`} onSubmit={enviar} noValidate>
            <Label forId={id} classLabel={styles.label} text={etiqueta} />
            <Input
                id={id}
                type="text"
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                placeholder={placeholder}
                value={nombre}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setNombre(e.target.value)
                    setError("")
                }}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    // Escape cancela este formulario (si se puede), no cierra el modal
                    if (e.key === 'Escape' && onCancelar) {
                        e.stopPropagation()
                        onCancelar()
                    }
                }}
                autoFocus
                maxLength={NOMBRE_MAX}
            />
            {error
                ? <p className={styles.error} role="alert">{error}</p>
                : <p className={styles.hint}>{ayuda}</p>}
            <div className={styles.acciones}>
                {onCancelar && (
                    <button type="button" className={styles.secundario} onClick={onCancelar}>Cancelar</button>
                )}
                <button type="submit" className={styles.primario} disabled={creando}>
                    {creando ? textoEnviando : textoBoton}
                </button>
            </div>
        </form>
    )
}

interface FormMoverProps {
    tema: Tema
    // Asignaturas a las que se puede mover (todas menos la actual)
    destinos: Asignatura[]
    onMover: (asignaturaId: string) => Promise<void>
    onCancelar: () => void
}

// Elegir la asignatura a la que pasa un tema.
function FormMover({ tema, destinos, onMover, onCancelar }: FormMoverProps) {
    const [destinoId, setDestinoId] = useState<string>(destinos[0]?._id ?? "")
    const [error, setError] = useState<string>("")
    const [moviendo, setMoviendo] = useState<boolean>(false)
    const id = `mover-${tema._id}`

    const enviar = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (moviendo) return
        const destino = destinos.find(a => a._id === destinoId)
        if (!destino) return
        if (destino.temas.some(t => t.nombre.toLowerCase() === tema.nombre.toLowerCase())) {
            return setError(`«${destino.nombre}» ya tiene un tema llamado «${tema.nombre}». Renómbralo antes de moverlo.`)
        }

        setMoviendo(true)
        try {
            await onMover(destinoId)
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo mover el tema.")
            setMoviendo(false)
        }
    }

    return (
        <form className={`${styles.form} ${styles.formEnLista}`} onSubmit={enviar} noValidate>
            <Label forId={id} classLabel={styles.label} text={`Mover «${tema.nombre}» a`} />
            <select
                id={id}
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                value={destinoId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setDestinoId(e.target.value)
                    setError("")
                }}
                onKeyDown={(e: KeyboardEvent<HTMLSelectElement>) => {
                    if (e.key === 'Escape') {
                        e.stopPropagation()
                        onCancelar()
                    }
                }}
                autoFocus
            >
                {destinos.map(a => <option key={a._id} value={a._id}>{a.nombre}</option>)}
            </select>
            {error
                ? <p className={styles.error} role="alert">{error}</p>
                : <p className={styles.hint}>Se mueve con sus tarjetas y su progreso.</p>}
            <div className={styles.acciones}>
                <button type="button" className={styles.secundario} onClick={onCancelar}>Cancelar</button>
                <button type="submit" className={styles.primario} disabled={moviendo}>
                    {moviendo ? 'Moviendo…' : 'Mover'}
                </button>
            </div>
        </form>
    )
}

// Modal para elegir el tema que se estudia y administrar asignaturas y temas.
// Cada asignatura muestra sus temas; elegir un tema lo deja activo y cierra.
export default function TemasModal() {
    const {
        asignaturas, temaActivo, crearAsignatura, renombrarAsignatura, eliminarAsignatura,
        crearTema, renombrarTema, moverTema, eliminarTema, cambiarTema, setModalTemasAbierto
    } = useAsignaturas()
    // Un solo formulario abierto a la vez: nueva asignatura, nuevo tema en una
    // asignatura (su id), renombrar una asignatura o un tema (su id) o mover un tema (su id)
    const [creandoAsignatura, setCreandoAsignatura] = useState<boolean>(false)
    const [creandoTemaEn, setCreandoTemaEn] = useState<string | null>(null)
    const [renombrando, setRenombrando] = useState<string | null>(null)
    const [moviendo, setMoviendo] = useState<string | null>(null)

    const cerrarFormularios = () => {
        setCreandoAsignatura(false)
        setCreandoTemaEn(null)
        setRenombrando(null)
        setMoviendo(null)
    }

    const cerrar = () => setModalTemasAbierto(false)

    const elegir = (temaId: string) => {
        cambiarTema(temaId)
        cerrar()
    }

    const abrirNuevoTema = (asignaturaId: string) => {
        cerrarFormularios()
        setCreandoTemaEn(asignaturaId)
    }

    const abrirRenombrar = (id: string) => {
        cerrarFormularios()
        setRenombrando(id)
    }

    const abrirMover = (temaId: string) => {
        cerrarFormularios()
        setMoviendo(temaId)
    }

    const mover = async (temaId: string, asignaturaId: string) => {
        await moverTema(temaId, asignaturaId)
        setMoviendo(null)
    }

    const guardarNombreAsignatura = async (asignaturaId: string, nombre: string) => {
        await renombrarAsignatura(asignaturaId, nombre)
        setRenombrando(null)
    }

    const guardarNombreTema = async (temaId: string, nombre: string) => {
        await renombrarTema(temaId, nombre)
        setRenombrando(null)
    }

    // Una asignatura sin temas no sirve para estudiar: al crearla se abre
    // directamente el formulario de su primer tema.
    const nuevaAsignatura = async (nombre: string) => {
        const creada = await crearAsignatura(nombre)
        abrirNuevoTema(creada._id)
    }

    const nuevoTema = async (asignaturaId: string, nombre: string) => {
        await crearTema(asignaturaId, nombre)
        cerrar()
    }

    const borrarAsignatura = async (asignatura: Asignatura) => {
        const temas = asignatura.temas.length
        const detalle = temas > 0 ? ` y sus ${plural(temas, 'tema')}` : ''
        if (!window.confirm(`¿Eliminar la asignatura «${asignatura.nombre}»${detalle}? Se perderán todas sus tarjetas.`)) return
        try {
            await eliminarAsignatura(asignatura._id)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'No se pudo eliminar la asignatura.')
        }
    }

    const borrarTema = async (tema: Tema) => {
        if (!window.confirm(`¿Eliminar el tema «${tema.nombre}»? Se perderán todas sus tarjetas.`)) return
        try {
            await eliminarTema(tema._id)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'No se pudo eliminar el tema.')
        }
    }

    const formAsignatura = (conCancelar: boolean) => (
        <FormNombre
            id="nombre-asignatura"
            etiqueta="Nombre de la asignatura"
            placeholder="Ej: Inglés, Biología, Historia…"
            ayuda="Después le agregas los temas; cada tema tiene sus propias 5 cajas."
            textoBoton="Crear asignatura"
            existentes={asignaturas.map(a => a.nombre)}
            mensajeDuplicado="Ya existe una asignatura con ese nombre."
            onGuardar={nuevaAsignatura}
            onCancelar={conCancelar ? () => setCreandoAsignatura(false) : undefined}
        />
    )

    return createPortal(
        <div className={`dashboard ${modal.overlay}`} onClick={cerrar}>
            <div
                className={`${modal.panel} ${styles.panel}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tm-titulo"
                onClick={e => e.stopPropagation()}
            >
                <div className={modal.header}>
                    <div>
                        <h2 id="tm-titulo" className={modal.title}>Asignaturas y temas</h2>
                        <p className={modal.subtitle}>Elige el tema que quieres estudiar. Cada tema tiene sus propias 5 cajas.</p>
                    </div>
                    <CerrarModal onclick={cerrar} />
                </div>

                <div className={modal.body}>
                    {asignaturas.length === 0 ? (
                        <>
                            <div className={modal.empty}>
                                <span className={modal.emptyIcon}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2" />
                                        <path d="M8 8h6M8 12h4" />
                                    </svg>
                                </span>
                                <p className={modal.emptyTitle}>Todavía no tienes asignaturas</p>
                                <p>Empieza por una asignatura y luego divídela en temas.</p>
                            </div>
                            {formAsignatura(false)}
                        </>
                    ) : (
                        <>
                            <ul className={styles.asignaturas}>
                                {asignaturas.map(asignatura => (
                                    <li key={asignatura._id} className={styles.asignatura}>
                                        {renombrando === asignatura._id ? (
                                            <FormNombre
                                                id={`renombrar-${asignatura._id}`}
                                                etiqueta="Nombre de la asignatura"
                                                placeholder="Ej: Inglés, Biología, Historia…"
                                                ayuda="Sus temas y tarjetas no cambian."
                                                textoBoton="Guardar"
                                                textoEnviando="Guardando…"
                                                inicial={asignatura.nombre}
                                                existentes={asignaturas.filter(a => a._id !== asignatura._id).map(a => a.nombre)}
                                                mensajeDuplicado="Ya existe una asignatura con ese nombre."
                                                onGuardar={nombre => guardarNombreAsignatura(asignatura._id, nombre)}
                                                onCancelar={() => setRenombrando(null)}
                                            />
                                        ) : (
                                        <div className={styles.asignaturaCabecera}>
                                            <span className={styles.inicial} aria-hidden="true">{asignatura.nombre.charAt(0).toUpperCase()}</span>
                                            <span className={styles.asignaturaInfo}>
                                                <h3 className={styles.asignaturaNombre}>{asignatura.nombre}</h3>
                                                <span className={styles.itemMeta}>{plural(asignatura.temas.length, 'tema')}</span>
                                            </span>
                                            <button
                                                type="button"
                                                className={styles.renombrar}
                                                onClick={() => abrirRenombrar(asignatura._id)}
                                                aria-label={`Renombrar asignatura ${asignatura.nombre}`}
                                                title="Renombrar asignatura"
                                            >
                                                {iconoEditar}
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.eliminar}
                                                onClick={() => borrarAsignatura(asignatura)}
                                                aria-label={`Eliminar asignatura ${asignatura.nombre}`}
                                                title="Eliminar asignatura"
                                            >
                                                {iconoBorrar}
                                            </button>
                                        </div>
                                        )}

                                        {asignatura.temas.length > 0 ? (
                                            <ul className={styles.lista} aria-label={`Temas de ${asignatura.nombre}`}>
                                                {asignatura.temas.map(tema => {
                                                    const total = contarTarjetas(tema)
                                                    const estaActivo = temaActivo?._id === tema._id
                                                    if (renombrando === tema._id) return (
                                                        <li key={tema._id}>
                                                            <FormNombre
                                                                id={`renombrar-${tema._id}`}
                                                                etiqueta={`Nombre del tema de ${asignatura.nombre}`}
                                                                placeholder="Ej: Verbos irregulares, La célula…"
                                                                ayuda="Sus cajas, tarjetas y progreso no cambian."
                                                                textoBoton="Guardar"
                                                                textoEnviando="Guardando…"
                                                                inicial={tema.nombre}
                                                                existentes={asignatura.temas.filter(t => t._id !== tema._id).map(t => t.nombre)}
                                                                mensajeDuplicado="Ya existe un tema con ese nombre en esta asignatura."
                                                                onGuardar={nombre => guardarNombreTema(tema._id, nombre)}
                                                                onCancelar={() => setRenombrando(null)}
                                                            />
                                                        </li>
                                                    )
                                                    if (moviendo === tema._id) return (
                                                        <li key={tema._id}>
                                                            <FormMover
                                                                tema={tema}
                                                                destinos={asignaturas.filter(a => a._id !== asignatura._id)}
                                                                onMover={destino => mover(tema._id, destino)}
                                                                onCancelar={() => setMoviendo(null)}
                                                            />
                                                        </li>
                                                    )
                                                    return (
                                                        <li key={tema._id} className={`${styles.item} ${estaActivo ? styles.itemActivo : ""}`}>
                                                            <button type="button" className={styles.itemBoton} onClick={() => elegir(tema._id)} aria-current={estaActivo}>
                                                                <span className={styles.itemInfo}>
                                                                    <span className={styles.itemNombre}>{tema.nombre}</span>
                                                                    <span className={styles.itemMeta}>{plural(total, 'tarjeta')}</span>
                                                                </span>
                                                                {estaActivo && <span className={styles.badge}>Activo</span>}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={styles.renombrar}
                                                                onClick={() => abrirRenombrar(tema._id)}
                                                                aria-label={`Renombrar tema ${tema.nombre}`}
                                                                title="Renombrar tema"
                                                            >
                                                                {iconoEditar}
                                                            </button>
                                                            {asignaturas.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className={styles.renombrar}
                                                                    onClick={() => abrirMover(tema._id)}
                                                                    aria-label={`Mover tema ${tema.nombre} a otra asignatura`}
                                                                    title="Mover a otra asignatura"
                                                                >
                                                                    {iconoMover}
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className={styles.eliminar}
                                                                onClick={() => borrarTema(tema)}
                                                                aria-label={`Eliminar tema ${tema.nombre}`}
                                                                title="Eliminar tema"
                                                            >
                                                                {iconoBorrar}
                                                            </button>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        ) : creandoTemaEn !== asignatura._id && (
                                            <p className={styles.sinTemas}>Todavía no tiene temas.</p>
                                        )}

                                        {creandoTemaEn === asignatura._id ? (
                                            <FormNombre
                                                id={`nombre-tema-${asignatura._id}`}
                                                etiqueta={`Nuevo tema de ${asignatura.nombre}`}
                                                placeholder="Ej: Verbos irregulares, La célula…"
                                                ayuda="Se crea con sus 5 cajas vacías y queda como tema activo."
                                                textoBoton="Crear tema"
                                                existentes={asignatura.temas.map(t => t.nombre)}
                                                mensajeDuplicado="Ya existe un tema con ese nombre en esta asignatura."
                                                onGuardar={nombre => nuevoTema(asignatura._id, nombre)}
                                                onCancelar={() => setCreandoTemaEn(null)}
                                            />
                                        ) : (
                                            <button type="button" className={styles.agregar} onClick={() => abrirNuevoTema(asignatura._id)}>
                                                {iconoMas} Nuevo tema
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {creandoAsignatura ? formAsignatura(true) : (
                                <button
                                    type="button"
                                    className={`${styles.agregar} ${styles.agregarAsignatura}`}
                                    onClick={() => {
                                        cerrarFormularios()
                                        setCreandoAsignatura(true)
                                    }}
                                >
                                    {iconoMas} Nueva asignatura
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
