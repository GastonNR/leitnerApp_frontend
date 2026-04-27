
const API_URL = import.meta.env.VITE_HOME_URL

export const crearLeccionRequest = async (nuevaLeccion) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/leccion`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nuevaLeccion })
    })

    if(!res.ok) throw new Error("Error al crear lección.")
    
    return res.json()

}

export const getLecciones = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }

    })

    if(!res.ok) throw new Error("Error al obtener las lecciones.")
    return res.json()

}