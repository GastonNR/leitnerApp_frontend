import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Tarjeta } from '../../types/context.types'
import CreateNewCardComponent from './CreateNewCardComponent'
import modal from './css/modal.module.css'

interface EditarTarjetaModalProps {
    tarjeta: Tarjeta
    caja: number
    onCerrar: () => void
}

// Modal con el formulario de tarjeta en modo edición. Se abre sobre la caja.
// No se cierra al hacer click afuera, para no perder cambios por accidente:
// solo con Cancelar, Escape o después de actualizar.
export default function EditarTarjetaModal({ tarjeta, caja, onCerrar }: EditarTarjetaModalProps) {

    // Escape cierra sin guardar, esté donde esté el foco. (El cursor arranca
    // en la pregunta: autoFocus del editor.)
    const cerrar = useRef(onCerrar)
    useEffect(() => { cerrar.current = onCerrar })
    useEffect(() => {
        function teclado(e: KeyboardEvent) {
            if (e.key !== 'Escape') return
            e.stopPropagation()
            cerrar.current()
        }
        document.addEventListener('keydown', teclado)
        return () => document.removeEventListener('keydown', teclado)
    }, [])

    return createPortal(
        <div className={`dashboard ${modal.overlay} ${modal.overlayEncima}`}>
            <div role="dialog" aria-modal="true" aria-labelledby="titulo-editar-tarjeta" className={modal.dialogoEdicion}>
                <CreateNewCardComponent tarjeta={tarjeta} caja={caja} onCerrar={onCerrar} />
            </div>
        </div>,
        document.body
    )
}
