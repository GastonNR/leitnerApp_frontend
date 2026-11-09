import { createPortal } from 'react-dom'
import { useState, ChangeEvent, FormEvent } from "react"
import { useAsignaturas } from "../../context/AsignaturasContext"
import type { Asignatura, Tema } from "../../types/context.types"
import CerrarModal from "../molecules/CerrarModal"
import Label from "../atoms/Label"
import Input from "../atoms/Input"
import modal from "./css/modal.module.css"
import styles from "./css/temasModal.module.css"

const iconoBorrar = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
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
    // Nombres que ya existen en el mismo lugar (para avisar antes de enviar)
    existentes: string[]
    mensajeDuplicado: string
    onCrear: (nombre: string) => Promise<void>
    onCancelar?: () => void
}

// Formulario de un solo campo para crear una asignatura o un tema.
function FormNombre({ id, etiqueta, placeholder, ayuda, textoBoton, existentes, mensajeDuplicado, onCrear, onCancelar }: FormNombreProps) {
    const [nombre, setNombre] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [creando, setCreando] = useState<boolean>(false)

    const enviar = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (creando) return
        const limpio = nombre.trim()
        if (!limpio) return setError("El nombre no puede estar vacío.")
        if (existentes.some(n => n.toLowerCase() === limpio.toLowerCase())) return setError(mensajeDuplicado)

        setCreando(true)
        try {
            await onCrear(limpio)
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo crear.")
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
                autoFocus
            />
            {error
                ? <p className={styles.error} role="alert">{error}</p>
                : <p className={styles.hint}>{ayuda}</p>}
            <div className={styles.acciones}>
                {onCancelar && (
                    <button type="button" className={styles.secundario} onClick={onCancelar}>Cancelar</button>
                )}
                <button type="submit" className={styles.primario} disabled={creando}>
                    {creando ? 'Creando…' : textoBoton}
                </button>
            </div>
        </form>
    )
}

// Modal para elegir el tema que se estudia y administrar asignaturas y temas.
// Cada asignatura muestra sus temas; elegir un tema lo deja activo y cierra.
export default function TemasModal() {
    const { asignaturas, temaActivo, crearAsignatura, eliminarAsignatura, crearTema, eliminarTema, cambiarTema, setModalTemasAbierto } = useAsignaturas()
    // Formulario abierto: nueva asignatura, o nuevo tema en una asignatura (su id)
    const [creandoAsignatura, setCreandoAsignatura] = useState<boolean>(false)
    const [creandoTemaEn, setCreandoTemaEn] = useState<string | null>(null)

    const cerrar = () => setModalTemasAbierto(false)

    const elegir = (temaId: string) => {
        cambiarTema(temaId)
        cerrar()
    }

    const abrirNuevoTema = (asignaturaId: string) => {
        setCreandoAsignatura(false)
        setCreandoTemaEn(asignaturaId)
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
            onCrear={nuevaAsignatura}
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
                                        <div className={styles.asignaturaCabecera}>
                                            <span className={styles.inicial} aria-hidden="true">{asignatura.nombre.charAt(0).toUpperCase()}</span>
                                            <span className={styles.asignaturaInfo}>
                                                <h3 className={styles.asignaturaNombre}>{asignatura.nombre}</h3>
                                                <span className={styles.itemMeta}>{plural(asignatura.temas.length, 'tema')}</span>
                                            </span>
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

                                        {asignatura.temas.length > 0 ? (
                                            <ul className={styles.lista} aria-label={`Temas de ${asignatura.nombre}`}>
                                                {asignatura.temas.map(tema => {
                                                    const total = contarTarjetas(tema)
                                                    const estaActivo = temaActivo?._id === tema._id
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
                                                onCrear={nombre => nuevoTema(asignatura._id, nombre)}
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
                                        setCreandoTemaEn(null)
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
