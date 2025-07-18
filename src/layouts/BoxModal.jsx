import { useCajas } from "../context/cajasContext"
import CardElement  from "../components/CardElement.jsx"
import "../css/boxModal.css"

export default function BoxModal({setEstiloDisplay, indiceCaja}) {
    const { cajas } = useCajas()
    const cajaElegida = cajas[Number(indiceCaja) -1]?.tarjetas || [];

  return (
    <div id="box-modal" className="box-modal">
            <div className="container-box-modal">
                <div className="contenedor-arriba">
                    <h3 id="box-modal-title" className="box-modal-texto">Tarjetas en Caja</h3>
                    <button id="close-box-modal" className="btn_cerrar" onClick={()=> setEstiloDisplay(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="img_btn_cerrar" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="contenedor-abajo">
                    <div id="box-cards-container" className="box-card-container">
                        {cajaElegida.length > 0 ? 
                        cajaElegida.map(tarjeta => (                                
                            <CardElement key={tarjeta._id } pregunta={tarjeta.pregunta} respuesta={tarjeta.respuesta} proxima_revision={tarjeta.proxima_revision} />
                        )) : (
                        <div id="box-empty-message" className="box-empty-message">
                            <p className="parr-box-empty-message">No hay tarjetas en esta caja.</p>
                        </div>

                        )}

                    </div>
                </div>
            </div>
        </div>
  )
}
