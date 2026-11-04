import { createContext, useState, useContext, useEffect, useCallback } from "react"
import { Usuario, AuthContextType, LoginResponse, LoginRequest, ApiError, AuthProviderProps } from '../types/auth.types'
import { loginService } from "../services/auth.service"
import { SESION_EXPIRADA_EVENT } from "../../../shared/api/axios"

const AuthContext = createContext<AuthContextType | null>(null)

function leerUsuarioGuardado(): Usuario | null {
    const id = localStorage.getItem("id")
    const nombre = localStorage.getItem("nombre_usuario")
    return id && nombre ? { id, nombre } : null
}

export default function AuthProvider({ children }: AuthProviderProps){

    const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado)
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(()=>{

        const tokenGuardado = localStorage.getItem("token")
        if(tokenGuardado){
            setToken(tokenGuardado)
        }

        setLoading(false)
    }, [])

    const login = async (datos: LoginRequest): Promise<LoginResponse | ApiError> =>{

        const respuesta = await loginService(datos)

        if (respuesta.ok) {
            localStorage.setItem("token", respuesta.token)
            localStorage.setItem("nombre_usuario", respuesta.usuario.nombre)
            localStorage.setItem("id", respuesta.usuario.id)

            setToken(respuesta.token)
            setUsuario(respuesta.usuario)

        }

        return respuesta

    }

    const logout = useCallback(()=>{
        setUsuario(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        localStorage.removeItem("nombre_usuario")
        localStorage.removeItem("leccion_activa")
    }, [])

    // Token expirado o inválido (lo detecta el interceptor de axios): se cierra la sesión
    // y RutaProtegida redirige fuera de la app.
    useEffect(()=>{
        window.addEventListener(SESION_EXPIRADA_EVENT, logout)
        return () => window.removeEventListener(SESION_EXPIRADA_EVENT, logout)
    }, [logout])

    return(
        <AuthContext.Provider value={{
            usuario,
            token,
            loading,
            login,
            logout,
            setUsuario
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext)

    if(!context) throw Error("useContext debe utilizarse dentro del AuthProvider")
    return context

}
