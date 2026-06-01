import { LoginRequest, LoginResponse, ApiError, RegistroRequest, RegistroResponse } from "../types/auth.types"
const AUTH_URL = import.meta.env.VITE_LOGIN_URL

export const loginService = async (datosLogin: LoginRequest): Promise<LoginResponse | ApiError> => {

    try {
        const res = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosLogin)
        })

        const datos: LoginResponse | ApiError = await res.json()
        return datos

    } catch (error) {
        console.log("Error en la conexión: ", error)

        return {
            ok: false,
            message: "Error de conexión con el servidor"
        }
    }

}

export const registroService = async (datosUsuario: RegistroRequest): Promise<RegistroResponse> => {
    try {
        const res = await fetch(import.meta.env.VITE_REGISTRO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosUsuario)
        })
        
        const respuesta: RegistroResponse = await res.json();
        return respuesta

    } catch (error) {
        console.log("Error en la conexión: ", error)

        return {
            ok: false,
            message: "Error de conexión con el servidor"
        }

    }
}