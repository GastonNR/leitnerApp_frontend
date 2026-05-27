const AUTH_URL = import.meta.env.VITE_LOGIN_URL

export const loginService = async (datosLogin) => {
    try {
        const res = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosLogin)
        })

        const datos = await res.json()
        //console.log("datos desde el backend: ", datos)

        return datos

    } catch (error) {
        console.log("Error en la conexión: ", error)
        return {
            ok: false,
            status: 500,
            datos: {
                mensaje: "Error de conexión con el servidor"
            }
        }
    }

}

export const registroService = async (datosUsuario) => {
    try {
        const res = await fetch(import.meta.env.VITE_REGISTRO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosUsuario)
        })
        const respuesta = await res.json();

        return respuesta

    } catch (error) {
        console.log("Error en la conexión: ", error)
        return {
            ok: false,
            status: 500,
            datos: {
                mensaje: "Error de conexión con el servidor"
            }
        }

    }
}