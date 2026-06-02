import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/context/AuthContext.tsx'

export default function RutaProtegida() {

    const {token, loading} = useAuth()

    if (loading) return <p>Cargando...</p>
    
    if(!token) return <Navigate to="/" replace />

  return <Outlet />
}
