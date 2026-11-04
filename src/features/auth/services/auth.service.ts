import { api, mensajeDeError } from "../../../shared/api/axios"
import { LoginRequest, LoginResponse, ApiError, RegistroRequest, RegistroResponse } from "../types/auth.types"

export const loginService = async (datosLogin: LoginRequest): Promise<LoginResponse | ApiError> => {
    try {
        const { data } = await api.post<LoginResponse>("/usuarios/login", datosLogin)
        return data
    } catch (error) {
        console.error("Error en el login: ", error)
        return {
            ok: false,
            message: mensajeDeError(error)
        }
    }
}

export const registroService = async (datosUsuario: RegistroRequest): Promise<RegistroResponse> => {
    try {
        const { data } = await api.post<RegistroResponse>('/usuarios/registro', datosUsuario)
        return data
    } catch (error) {
        console.error("Error en el registro: ", error)
        return {
            ok: false,
            message: mensajeDeError(error)
        }
    }
}
