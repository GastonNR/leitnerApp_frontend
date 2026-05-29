import { createContext, useState, useContext, useEffect } from "react"
import { loginService } from "../services/auth.service"

const AuthContext = createContext()

export default function AuthProvider({ children }){

    const [usuario, setUsuario] = useState(null)
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [loading, setLoading] = useState(true)

    useEffect(()=>{

        const tokenGuardado = localStorage.getItem("token")
        if(tokenGuardado){
            setToken(tokenGuardado)
        }

        setLoading(false)
    }, [])

    const login = async (datos)=>{

        const respuesta = await loginService(datos)

        if (respuesta.ok) {
            localStorage.setItem("token", respuesta.token)
            localStorage.setItem("nombre_usuario", respuesta.usuario.nombre)
            localStorage.setItem("id", respuesta.usuario.id)

            setToken(respuesta.token)
            setUsuario(respuesta.usuario)

            return {ok: true}
        }
        
        if(!respuesta.ok) return respuesta

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

export const useAuth = () => useContext(AuthContext);