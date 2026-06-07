import { useLecciones } from "../../context/LeccionesContext"
import CardElement from "../molecules/CardElement"
import { BoxModalProps } from "../../types/components.types"
import type { Tarjeta } from "../../types/context.types"
import CustomButton from "../molecules/CustomButton"
import Heading from "../atoms/Heading"
import Paragraph from "../atoms/Paragraph"
import "../css/boxModal.css"

export default function BoxModal({ setEstiloDisplay, indiceCaja }: BoxModalProps) {

    const { leccionActiva, eliminarTarjetaContext } = useLecciones()
    const indiceCajaNum = Number(indiceCaja) - 1
    const cajaElegida = leccionActiva?.cajas[indiceCajaNum]?.tarjetas || []

    //console.log("indice caja: ", indiceCaja)
    //console.log("indice caja numero: ", indiceCajaNum)

    const eliminarTarjeta = async (indexAEliminar: number, cajaElegida: Tarjeta[], indiceCajaNum: number) => {
        const eliminada = await eliminarTarjetaContext(indexAEliminar, cajaElegida, indiceCajaNum)
        if (!eliminada) alert("No se ha podido eliminar la tarjeta.")

        setEstiloDisplay(false)
    }

    return (
        <div id="box-modal" className="box-modal">
            <div className="container-box-modal">
                <div className="contenedor-arriba">

                    <Heading
                        id={'box-modal-title'}
                        nombreEncabezado={'tituloCaja'}
                        className={'box-modal-texto'}
                        texto={'Tarjetas en caja'}
                    />


                    <CustomButton id={'close-box-modal'} className={'btn-cerrar'} variante={'cerrar_btn'} onclick={setEstiloDisplay} />

                </div>

                <div className="contenedor-abajo">
                    <div id="box-cards-container" className="box-card-container">
                        {cajaElegida.length > 0 ?
                            cajaElegida.map((tarjeta, index) => (
                                <CardElement
                                    key={tarjeta._id}
                                    pregunta={tarjeta.pregunta}
                                    respuesta={tarjeta.respuesta}
                                    proxima_revision={tarjeta.proxima_revision}
                                    onEliminar={() => eliminarTarjeta(index, cajaElegida, indiceCajaNum)}
                                />
                            )) : (
                                <div id="box-empty-message" className="box-empty-message">
                                    <Paragraph
                                        className={'parr-box-empty-message'}
                                        texto={'No hay tarjetas en esta caja.'}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}