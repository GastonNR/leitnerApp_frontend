const AUTH_URL = import.meta.env.VITE_LOGIN_URL

export const loginService = async (datos) => {
    try {
        const res = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        })

        const resultado = await res.json()
        return resultado
        
    } catch (error) {
        console.log("Error al logear al usuario: ", error)
    }

}