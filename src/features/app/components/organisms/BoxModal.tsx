import { createPortal } from 'react-dom'
import type { CSSProperties } from "react"
import { useLecciones } from "../../context/LeccionesContext"
import CardElement from "../molecules/CardElement"
import CerrarModal from "../molecules/CerrarModal"
import { BoxModalProps } from "../../types/components.types"
import type { Tarjeta } from "../../types/context.types"
import modal from "./css/modal.module.css"
import styles from "./css/boxModal.module.css"

const PERIODOS = ['se repasa cada día', 'se repasa cada 3 días', 'se repasa cada semana', 'se repasa cada 2 semanas', 'se repasa cada mes']

export default function BoxModal({ setEstiloDisplay, indiceCaja }: BoxModalProps) {

    const { leccionActiva, eliminarTarjetaContext, cambiarImagenTarjeta, eliminarImagenTarjeta } = useLecciones()
    const indiceCajaNum = Number(indiceCaja) - 1
    const cajaElegida = leccionActiva?.cajas[indiceCajaNum]?.tarjetas || []
    const cerrar = () => setEstiloDisplay(false)

    const eliminarTarjeta = async (indexAEliminar: number, cajaElegida: Tarjeta[], indiceCajaNum: number) => {
        const eliminada = await eliminarTarjetaContext(indexAEliminar, cajaElegida, indiceCajaNum)
        if (!eliminada) alert("No se ha podido eliminar la tarjeta.")
    }

    return createPortal(
        <div id="box-modal" className={`dashboard ${modal.overlay}`} onClick={cerrar}>
            <div
                className={modal.panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="box-modal-title"
                onClick={e => e.stopPropagation()}
                style={{ '--box-color': `var(--d-box-${indiceCaja})` } as CSSProperties}
            >
                <div className={modal.header}>
                    <div className={styles.encabezado}>
                        <span className={styles.numero}>{indiceCaja}</span>
                        <div>
                            <h2 id="box-modal-title" className={modal.title}>Caja {indiceCaja}</h2>
                            <p className={modal.subtitle}>
                                {cajaElegida.length} tarjeta{cajaElegida.length !== 1 ? 's' : ''} · {PERIODOS[indiceCajaNum]}
                            </p>
                        </div>
                    </div>
                    <CerrarModal id={'close-box-modal'} onclick={cerrar} />
                </div>

                <div className={modal.body}>
                    {cajaElegida.length > 0 ? (
                        <ul id="box-cards-container" className={styles.lista}>
                            {cajaElegida.map((tarjeta, index) => (
                                <CardElement
                                    key={tarjeta._id}
                                    pregunta={tarjeta.pregunta}
                                    respuesta={tarjeta.respuesta}
                                    proxima_revision={tarjeta.proxima_revision}
                                    imagen={tarjeta.imagen}
                                    onEliminar={() => eliminarTarjeta(index, cajaElegida, indiceCajaNum)}
                                    onCambiarImagen={imagen => cambiarImagenTarjeta(tarjeta._id, imagen)}
                                    onQuitarImagen={() => eliminarImagenTarjeta(tarjeta._id)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div id="box-empty-message" className={modal.empty}>
                            <span className={modal.emptyIcon}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="6" width="14" height="12" rx="2" />
                                    <path d="M7 3h12a2 2 0 0 1 2 2v10" />
                                </svg>
                            </span>
                            <p className={modal.emptyTitle}>No hay tarjetas en esta caja</p>
                            <p>Las tarjetas llegan aquí a medida que las aciertas en tus repasos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
