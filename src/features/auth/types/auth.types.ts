import { Dispatch, ReactNode, SetStateAction } from "react"

// lOGIN
export interface Usuario {
    id: string
    nombre: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    ok: boolean
    token: string
    usuario: Usuario
}

export interface ApiError {
    ok: false
    message: string
}

// REGISTRO

export interface RegistroRequest{
    nombre: string
    email: string
    password: string
}

export interface RegistroResponse{
    ok: boolean
    message: string
}

// AUTH-CONTEXT
export interface AuthContextType{
    usuario: Usuario | null
    token: string | null
    loading: boolean
    login: (datos: LoginRequest) => Promise<{} | ApiError>
    logout: () => void
    setUsuario: Dispatch<SetStateAction<Usuario | null>>
}

export interface AuthProviderProps {
    children: ReactNode
}