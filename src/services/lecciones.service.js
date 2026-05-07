
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
    
    const datos = res.json()
    return datos

}

export const getLecciones = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }

    })

    if(!res.ok) throw new Error("Error al obtener las lecciones.")
    return res.json()

}

export const deleteLecciones = async (id) =>{

    console.log("Id de la lección desde service frontend: ", id)
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!res.ok) throw new Error("Error al eliminar la lección.")
    return res.json()

}

// CARDS

export const guardarNuevaTarjeta = async (leccion_id, datosTarjeta) => {

    const token = localStorage.getItem('token')
    
    const nuevaTarjeta = await fetch(`${API_URL}/leccion/${leccion_id}`, {
        method: 'POST',
        headers:{
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosTarjeta)

    })

    if(!nuevaTarjeta.ok) throw new Error("Error al guardar la tarjeta")

    const nuevaTarjetaGuardada = nuevaTarjeta.json()
    console.log("nueva tarjeta guardada: ", nuevaTarjetaGuardada)
    return nuevaTarjetaGuardada

}

export const eliminarTarjetaService = async (tarjetaId) => {

    const token = localStorage.getItem('token')

    try {
        const eliminar = await fetch(`${API_URL}/leccion/${tarjetaId}`, {
            method: 'DELETE',
            headers:{
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
    
        })
    
        return eliminar.json()
           
    } catch (error) {
        throw new Error("Error al eliminar la tarjeta")
        
    }

}