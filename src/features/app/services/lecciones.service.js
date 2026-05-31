const API_URL = import.meta.env.VITE_HOME_URL

// MANEJO DE LECCIONES

export const crearLeccionRequest = async (nuevaLeccion, token) => {

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

export const getLecciones = async (token) => {

    const res = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }

    })

    if(!res.ok) throw new Error("Error al obtener las lecciones.")
    return res.json()

}

export const deleteLecciones = async (id, token) =>{

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!res.ok) throw new Error("Error al eliminar la lección.")
    return res.json()

}

export const guardarLeccion = async (leccion, token) => {

    const leccionId = leccion._id
    
    try {
      const res = await fetch(`${API_URL}/leccion/${leccionId}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        "body": JSON.stringify(leccion)
      })

      if(!res.ok) throw new Error("Error al guardar la lección")
      const leccionActualizada = await res.json()

      return leccionActualizada

    } catch (error) {
      console.error("Error al guardar los datos de las cajas: ", error)
    }

}

// MANEJO DE TARJETAS

export const guardarNuevaTarjeta = async (leccion_id, datosTarjeta, token) => {
    
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
    
    return nuevaTarjetaGuardada

}

export const eliminarTarjetaService = async (tarjetaId, token) => {

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