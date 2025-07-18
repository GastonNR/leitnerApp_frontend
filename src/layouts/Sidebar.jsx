import React from 'react'
import "../css/sidebar.css"
import CountCards from '../components/CountCards'

export default function Sidebar() {

    async function crearNuevaTarjeta(){
        const pregunta = document.querySelector('#card-question').value
        const respuesta = document.querySelector('#card-answer').value

        let comprobacionCampos = 0

        if (!pregunta) {
            alert("El campo de pregunta está vacío")
            comprobacionCampos++
        }
        if (!respuesta){
            alert("El campo de respuesta está vacío")
            comprobacionCampos++
        }
         
        if (comprobacionCampos === 0) {

            const fechaActual = new Date();
            const proxima_revision = new Date(fechaActual)
            proxima_revision.setDate( proxima_revision.getDate() + 1 )

            const tarjeta = { 
                pregunta: pregunta,
                respuesta: respuesta,
                nivel: 1, 
                ultima_revision: fechaActual,
                proxima_revision: proxima_revision
            }

            //try {
            //    const res = await fetch(`${import.meta.env.VITE_HOME_URL}/nuevaTarjeta`, {
            //        method: 'POST',
            //        headers: {
            //            'Content-Type': 'application/json',
            //            'Authorization': `Bearer ${localStorage.getItem('token')}`
            //        },
            //        body: JSON.stringify(datos)
            //    })
            //     const resultado = await res.json()
                
            //if (res.ok) {
            //    document.querySelector('#card-question').value = ""
            //    document.querySelector('#card-answer').value = ""

            //} else {
            //    alert(resultado.mensaje || "Error al guardar la tarjeta")
            //}

            //} catch (error) {
            //   console.error("Error al guardar las tarjetas: ", error)

            //}
        }
        
    }

  return (
    <div className="sidebar">
        <div className="sidebar_superior">
            <h2 className="sidebar_titulo">Sistema Leitner</h2>
            <p className="sidebar_parr">Organiza tus tarjetas en 5 cajas según tu nivel de conocimiento. Las tarjetas se mueven entre cajas según tu desempeño.</p>
            
            <div className="contenedor_texto_caja_sidebar">
                <CountCards id={"box-1-count"} texto={"Caja 1 (Diario)"} cantidad={0} resaltado={"cant_cards cant_cards_1"}/>
                <CountCards id={"box-2-count"} texto={"Caja 2 (3 días)"} cantidad={0} resaltado={"cant_cards cant_cards_2"}/>
                <CountCards id={"box-3-count"} texto={"Caja 3 (7 días)"} cantidad={0} resaltado={"cant_cards cant_cards_3"}/>
                <CountCards id={"box-4-count"} texto={"Caja 4 (14 días)"} cantidad={0} resaltado={"cant_cards cant_cards_4"}/>
                <CountCards id={"box-5-count"} texto={"Caja 5 (30 días)"} cantidad={0} resaltado={"cant_cards cant_cards_5"}/>
            </div>
        </div>
        
        <div className="contenedor_sidebar_inferior">
            <h2 className="sidebar_titulo">Crear nueva tarjeta</h2>
            <form id="new-card-form" className="form_card">
                <div>
                    <label htmlFor="card-question">Pregunta</label>
                    <textarea id="card-question" rows="2" required=""></textarea>
                </div>
                <div>
                    <label htmlFor="card-answer">Respuesta</label>
                    <textarea id="card-answer" rows="2" required=""></textarea>
                </div>
                <div>
                    <button type="submit" className="btn_crearTarjeta" onClick={crearNuevaTarjeta}>Crear tarjeta</button>
                </div>
            </form>
        </div>
    </div>
  )
}
