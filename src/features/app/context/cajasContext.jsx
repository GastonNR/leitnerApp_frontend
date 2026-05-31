import { createContext, useState, useContext, useEffect } from "react";
import { crearLeccionRequest, deleteLecciones, eliminarTarjetaService, getLecciones, guardarLeccion, guardarNuevaTarjeta } from "../services/lecciones.service";
import { useAuth } from '../../auth/context/AuthContext.jsx'

const CajasContext = createContext();

export default function CajasProvider({ children }) {

  const [tarjetasDeHoy, setTarjetasDeHoy] = useState([])
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)

  // Manejo de lecciones
  const [lecciones, setLecciones] = useState([]); // [{ id, nombre, cajas }]
  const [leccionActivaId, setLeccionActivaId] = useState(localStorage.getItem("leccion_activa") || null) // 'id'
  const leccionActiva = lecciones.find(l => l._id === leccionActivaId)

  // Modal de lecciones
  const [modalLeccionesAbierto, setModalLeccionesAbierto] = useState(false);

  //Trae todas las lecciones de la base de datos al inicio.
  useEffect(() => {
    const traerLeccionesDB = async () => {
      try {
        const leccionesEncontradas = await getLecciones(token)

        if (leccionesEncontradas?.length > 0) {
          setLecciones(leccionesEncontradas)

          const idGuardado = localStorage.getItem("leccion_activa")
          const existeLeccion = leccionesEncontradas.some(l => l._id === idGuardado)
          const idInicial = existeLeccion ? idGuardado : leccionesEncontradas[0]._id

          setLeccionActivaId(idInicial)
          localStorage.setItem("leccion_activa", idInicial)
        }


      } catch (error) {
        console.error("Error al traer las lecciones", error)

      } finally {
        setLoading(false);

      }
    }

    traerLeccionesDB()

  }, [token])

  //Carga las tarjetas del día.
  useEffect(() => {

    if (leccionActiva?.cajas?.length === 5) {

      const hoy = new Date().toLocaleDateString('sv-SE')

      const todasLasTarjetas = leccionActiva.cajas.flatMap(
        caja => caja.tarjetas || []
      )

      const tarjetasHoy = todasLasTarjetas.filter((tarjeta) => {

        if (!tarjeta.proxima_revision) return false

        const fechaRevision = new Date(
          tarjeta.proxima_revision
        ).toLocaleDateString('sv-SE')

        return fechaRevision <= hoy
      })

      if (tarjetasHoy.length > 0) {

        setTarjetasDeHoy(tarjetasHoy)

      } else {

        const tarjetasCaja1 =
          leccionActiva.cajas[0]?.tarjetas || []

        setTarjetasDeHoy(tarjetasCaja1)
      }
    }

  }, [leccionActiva])

  // Crear nueva lección
  const crearLeccion = async (nombre) => {

    try {
      const nombreNuevaLeccion = nombre.trim()
      const nuevaLeccion = await crearLeccionRequest(nombreNuevaLeccion, token)

      setLecciones(prev => [...prev, nuevaLeccion])
      setLeccionActivaId(nuevaLeccion._id)

      localStorage.setItem("leccion_activa", nuevaLeccion._id)

      setModalLeccionesAbierto(false);

    } catch (error) {
      console.error("Error al crear una nueva lección", error)

    }

  }

  // Cambiar a una lección existente
  const cambiarLeccion = (leccionId) => {

    setLeccionActivaId(leccionId)
    localStorage.setItem("leccion_activa", leccionId)

    setModalLeccionesAbierto(false);

  }

  // Eliminar lección
  const eliminarLeccion = async (id) => {

    try {
      await deleteLecciones(id, token)

      const nuevasLecciones = lecciones.filter(l => l._id !== id)
      setLecciones(nuevasLecciones)

      if (leccionActivaId === id) {
        const nuevaLeccionActiva = nuevasLecciones[0]?._id || null
        setLeccionActivaId(nuevaLeccionActiva)

        if (!nuevaLeccionActiva) {
          localStorage.setItem("leccion_activa", nuevaLeccionActiva)
        } else {
          localStorage.removeItem("leccion_activa")
        }

      }

      setModalLeccionesAbierto(false)

    } catch (error) {
      console.error("Error eliminando: ", error)
    }

  }

  //===========//
  // TARJETAS //
  //==========//
  const crearNuevaTarjeta = async (leccionId, tarjeta) => {
    const nuevaTarjeta = await guardarNuevaTarjeta(leccionActiva._id, tarjeta, token)

    const nuevasCajas = leccionActiva.cajas.map((caja, index) => {

      if (index === 0) {
        const tarjetasActualizadas = [...(caja.tarjetas || []), nuevaTarjeta]
        return { ...caja, tarjetas: tarjetasActualizadas }

      } else {
        return caja

      }
    })

    setLecciones(prevLecciones =>
      prevLecciones.map(leccion => {
        if (leccion._id !== leccionActivaId) return leccion

        const leccionActualizada = {
          ...leccion,
          cajas: nuevasCajas
        }

        return leccionActualizada
      })

    )
  }

  const actualizarTarjeta = async (esCorrecta, tarjeta) => {

    const leccionesActualizadas = lecciones.map(leccion => {

      if (leccion._id !== leccionActivaId) return leccion

      return {
        ...leccion,
        cajas: leccion.cajas.map(caja => ({
          ...caja,
          tarjetas: caja.tarjetas.map(t => {

            if (t._id !== tarjeta._id) return t

            return {
              ...t,
              es_correcta: esCorrecta
            }

          })
        }))
      }

    })

    setLecciones(leccionesActualizadas)

    return leccionesActualizadas
  }

  const guardar = async (leccionesActualizadas) => {

    const leccionActualizada = leccionesActualizadas.find(
      l => l._id === leccionActivaId
    )

    if (!leccionActualizada) return

    const respuesta = await guardarLeccion(leccionActualizada, token)

    if (respuesta) {
      alert("Lección guardada.")

      setLecciones(prev =>
        prev.map(leccion => {
          if (leccion._id !== leccionActivaId) return leccion
          return respuesta
        })
      )
    }
  }

  const eliminarTarjetaContext = async (indexCaja, cajaElegida, indiceCajaNum) => {

    const tarjetaId = cajaElegida[indexCaja]._id
    const eliminarYActualizar = await eliminarTarjetaService(tarjetaId, token)

    setLecciones(prev =>
      
      prev.map(leccion => {
        
        if (leccion._id !== leccionActivaId) return leccion
        
        const nuevasCajas = [...leccion.cajas]
        
        nuevasCajas[indiceCajaNum] = {
          ...nuevasCajas[indiceCajaNum],
          tarjetas: nuevasCajas[indiceCajaNum].tarjetas.filter(tarjeta => tarjeta._id !== tarjetaId)
        }
        return {
          ...leccion,
          cajas: nuevasCajas
        }
      })
    )

    return true
  }

  if (loading) return <p>Cargando cajas...</p>;

  //RETURN
  return (
    <CajasContext.Provider value={{
      tarjetasDeHoy,
      lecciones,
      setLecciones,
      leccionActiva,
      leccionActivaId,
      setLeccionActivaId,
      crearLeccion,
      cambiarLeccion,
      eliminarLeccion,
      crearNuevaTarjeta,
      actualizarTarjeta,
      eliminarTarjetaContext,
      guardar,
      modalLeccionesAbierto,
      setModalLeccionesAbierto,
    }}>
      {children}
    </CajasContext.Provider>
  );
}

export const useCajas = () => useContext(CajasContext);