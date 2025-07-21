import React from 'react'
import "../css/header.css"
import { useCajas } from '../context/cajasContext'

export default function Header() {
  const {cajas} = useCajas()

  async function logout() {
    localStorage.removeItem("token")
    window.location.href = '/'
  }

  async function guardar() {
    try {
      console.log("Cajas:", cajas)
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      const res = await fetch(`${import.meta.env.VITE_HOME_URL}/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        "body": JSON.stringify(cajas)
      })

      if(!res.ok) throw new Error("Error al crear el usuario.")
      const data = await res.json()
      console.log("Datos guardados: ", data)

    } catch (error) {
      console.error("Error al guardar los datos de las cajas: ", error)

    }
  }


  return (
    <header className="header">
        <div className="container-header">
            <h1 className="titulo-header">LeitnerApp</h1>
            <div className="header-derecha">
                <span id="user-name" className="span md:inline">Usuario</span>
                <button id="logout-btn" className="logout-btn" onClick={guardar}>Guardar</button>
                <button id="logout-btn" className="logout-btn" onClick={logout}>Cerrar sesión</button>
            </div>
        </div>
    </header>
  )
}
