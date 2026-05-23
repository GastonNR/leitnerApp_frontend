import React from 'react'
import "../css/header.css"
import { useCajas } from '../context/cajasContext'
import LeccionesModal from './LeccionesModal'
import { guardarLeccion } from '../services/lecciones.service'

export default function Header() {
  const { leccionActivaId, leccionActiva, setLecciones, setLeccionActiva, setModalLeccionesAbierto, modalLeccionesAbierto } = useCajas()

  async function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    localStorage.removeItem("nombre_usuario")
    window.location.href = '/'
  }

  async function guardar() {
    const leccion = leccionActiva
    const leccionActualizada = await guardarLeccion(leccion)

    if(leccionActualizada) alert("Lección guardada.")
    
    setLecciones(prev => 
      prev.map(leccion => {
        if(leccion._id !== leccionActivaId) return leccion
        return leccionActualizada
      })
    )
    //setLeccionActiva(leccionActualizada)
    
  }

  //async function guardar() {
  //  const leccion = leccionActiva
  //  const leccionActualizada = await guardarLeccion(leccion)
//
  //  if(leccionActualizada) alert("Lección guardada.")
  //  setLeccionActiva(leccionActualizada)
  //  
  //}

  return (
    <>
      <header className="header">
          <div className="container-header">
              <div className="header-izquierda">
                  <h1 className="titulo-header">LeitnerApp</h1>
                  {leccionActiva && (
                    <span className="header-leccion-activa">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {leccionActiva.nombre}
                    </span>
                  )}
              </div>
              <div className="header-derecha">
                  <span id="user-name" className="span md:inline">Usuario</span>
                  <button className="header-btn header-btn--leccion" onClick={() => setModalLeccionesAbierto(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Lecciones
                  </button>
                  <button className="logout-btn" onClick={guardar}>Guardar</button>
                  <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
              </div>
          </div>
      </header>
      {modalLeccionesAbierto && <LeccionesModal />}
    </>
  )
}
