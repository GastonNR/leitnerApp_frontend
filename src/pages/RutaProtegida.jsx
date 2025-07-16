import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function RutaProtegida() {
    const token = localStorage.getItem("token")

    if(!token) return <Navigate to="/" replace />


  return <Outlet />
}
