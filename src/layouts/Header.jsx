import React from 'react'
import "../css/header.css"

export default function Header() {

  async function logout() {
    localStorage.removeItem("token")
    window.location.href = '/'
  }


  return (
    <header className="header">
        <div className="container-header">
            <h1 className="titulo-header">LeitnerApp</h1>
            <div className="header-derecha">
                <span id="user-name" className="span md:inline">Usuario</span>
                <button id="logout-btn" className="logout-btn" onClick={logout}>Cerrar sesión</button>
            </div>
        </div>
    </header>
  )
}
