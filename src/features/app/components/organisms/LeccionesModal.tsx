import { createPortal } from 'react-dom'
import { useState, MouseEvent, ChangeEvent, FormEvent } from "react"
import { useLecciones } from "../../context/LeccionesContext"
import CerrarModal from "../molecules/CerrarModal"
import Label from "../atoms/Label"
import Input from "../atoms/Input"
import modal from "./css/modal.module.css"
import styles from "./css/leccionesModal.module.css"

type Vista = "lista" | "nueva"

export default function LeccionesModal() {
    const { lecciones, leccionActiva, crearLeccion, cambiarLeccion, eliminarLeccion, setModalLeccionesAbierto } = useLecciones()
    const [vista, setVista] = useState<Vista>(lecciones.length === 0 ? "nueva" : "lista")
    const [nombreNueva, setNombreNueva] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [creando, setCreando] = useState<boolean>(false)

    const cerrar = () => setModalLeccionesAbierto(false)

    const handleCrear = async (e?: FormEvent<HTMLFormElement>): Promise<void> => {
        e?.preventDefault()
        if (creando) return
        if (!nombreNueva.trim()) {
            setError("El nombre no puede estar vacío.")
            return
        }
        if (lecciones.some(l => l.nombre.toLowerCase() === nombreNueva.trim().toLowerCase())) {
            setError("Ya existe una lección con ese nombre.")
            return
        }
        try {
            setCreando(true)
            await crearLeccion(nombreNueva)
            setNombreNueva("")
            setError("")
            setVista("lista")
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo crear la lección.")
        } finally {
            setCreando(false)
        }
    }

    const handleEliminar = async (e: MouseEvent<HTMLButtonElement>, id: string, nombre: string): Promise<void> => {
        e.stopPropagation()
        if (window.confirm(`¿Eliminar la lección «${nombre}»? Se perderán todas sus tarjetas.`)) {
            await eliminarLeccion(id)
        }
    }

    const elegir = (id: string) => {
        cambiarLeccion(id)
        cerrar()
    }

    return createPortal(
        <div className={`dashboard ${modal.overlay}`} onClick={cerrar}>
            <div
                className={`${modal.panel} ${styles.panel}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="lm-titulo"
                onClick={e => e.stopPropagation()}
            >
                <div className={modal.header}>
                    <div>
                        <h2 id="lm-titulo" className={modal.title}>Lecciones</h2>
                        <p className={modal.subtitle}>Cada lección tiene sus propias 5 cajas.</p>
                    </div>
                    <CerrarModal onclick={cerrar} />
                </div>

                <div className={styles.tabs} role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={vista === "lista"}
                        className={`${styles.tab} ${vista === "lista" ? styles.tabActiva : ""}`}
                        onClick={() => setVista("lista")}
                    >
                        Mis lecciones
                        <span className={styles.tabContador}>{lecciones.length}</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={vista === "nueva"}
                        className={`${styles.tab} ${vista === "nueva" ? styles.tabActiva : ""}`}
                        onClick={() => setVista("nueva")}
                    >
                        + Nueva lección
                    </button>
                </div>

                <div className={modal.body}>
                    {/* Vista: lista de lecciones */}
                    {vista === "lista" && (
                        lecciones.length === 0 ? (
                            <div className={modal.empty}>
                                <span className={modal.emptyIcon}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2" />
                                        <path d="M8 8h6M8 12h4" />
                                    </svg>
                                </span>
                                <p className={modal.emptyTitle}>Todavía no tienes lecciones</p>
                                <p>Crea una por cada tema que quieras estudiar.</p>
                                <button type="button" className={styles.primario} onClick={() => setVista("nueva")}>
                                    Crear primera lección
                                </button>
                            </div>
                        ) : (
                            <ul className={styles.lista}>
                                {lecciones.map(leccion => {
                                    const totalTarjetas = leccion.cajas.reduce((acc, c) => acc + (c.tarjetas?.length || 0), 0)
                                    const estaActiva = leccionActiva?._id === leccion._id
                                    return (
                                        <li key={leccion._id} className={`${styles.item} ${estaActiva ? styles.itemActivo : ""}`}>
                                            <button type="button" className={styles.itemBoton} onClick={() => elegir(leccion._id)} aria-current={estaActiva}>
                                                <span className={styles.inicial} aria-hidden="true">{leccion.nombre.charAt(0).toUpperCase()}</span>
                                                <span className={styles.itemInfo}>
                                                    <span className={styles.itemNombre}>{leccion.nombre}</span>
                                                    <span className={styles.itemMeta}>{totalTarjetas} tarjeta{totalTarjetas !== 1 ? "s" : ""}</span>
                                                </span>
                                                {estaActiva && <span className={styles.badge}>Activa</span>}
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.eliminar}
                                                onClick={(e: MouseEvent<HTMLButtonElement>) => handleEliminar(e, leccion._id, leccion.nombre)}
                                                aria-label={`Eliminar lección ${leccion.nombre}`}
                                                title="Eliminar lección"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                                                </svg>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                    )}

                    {/* Vista: nueva lección */}
                    {vista === "nueva" && (
                        <form className={styles.form} onSubmit={handleCrear} noValidate>
                            <Label forId={'nombre-leccion'} classLabel={styles.label} text={'Nombre de la lección'} />

                            <Input
                                id={'nombre-leccion'}
                                type={'text'}
                                className={`${styles.input} ${error ? styles.inputError : ""}`}
                                placeholder={'Ej: Inglés, Biología, Historia...'}
                                value={nombreNueva}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setNombreNueva(e.target.value)
                                    setError("")
                                }}
                                autoFocus={true}
                            />

                            {error
                                ? <p className={styles.error} role="alert">{error}</p>
                                : <p className={styles.hint}>Se crea con sus 5 cajas vacías, lista para agregarle tarjetas.</p>}

                            <div className={styles.acciones}>
                                <button
                                    type="button"
                                    className={styles.secundario}
                                    onClick={() => {
                                        setVista('lista')
                                        setError('')
                                        setNombreNueva('')
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.primario} disabled={creando}>
                                    {creando ? 'Creando…' : 'Crear lección'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
