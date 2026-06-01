import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { Usuario, AuthContextType, LoginResponse, LoginRequest, ApiError, AuthProviderProps } from '../types/auth.types'
import { loginService } from "../services/auth.service"

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: AuthProviderProps){

    const [usuario, setUsuario] = useState<Usuario | null>(null)
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

    const logout = ()=>{
        setUsuario(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        localStorage.removeItem("nombre_usuario")
        
    }

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