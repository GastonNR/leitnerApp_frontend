import axios from "axios"

export const SESION_EXPIRADA_EVENT = "auth:sesion-expirada"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Un 401 en una petición autenticada significa token inválido o expirado:
// se avisa al AuthContext para que cierre la sesión. (El 401 del login no lleva token.)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401 && error.config?.headers?.Authorization) {
            window.dispatchEvent(new Event(SESION_EXPIRADA_EVENT))
        }
        return Promise.reject(error)
    }
)

// Devuelve el mensaje de error enviado por el backend, o uno genérico si no hubo respuesta.
export function mensajeDeError(error: unknown, porDefecto = "Error de conexión con el servidor"): string {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message
        if (typeof message === "string" && message) return message
        if (error.response) return `Error del servidor (${error.response.status})`
    }
    return porDefecto
}
