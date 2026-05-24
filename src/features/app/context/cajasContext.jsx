import { createContext, useState, useContext, useEffect } from "react";
import { crearLeccionRequest, deleteLecciones, getLecciones } from "../services/lecciones.service";

const CajasContext = createContext();

export default function CajasProvider({ children }) {

  const [tarjetasDeHoy, setTarjetasDeHoy] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const leccionesEncontradas = await getLecciones()

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

  }, [])

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
      const nuevaLeccion = await crearLeccionRequest(nombreNuevaLeccion)

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
      await deleteLecciones(id)

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

  if (loading) return <p>Cargando cajas...</p>;

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
      modalLeccionesAbierto,
      setModalLeccionesAbierto,
    }}>
      {children}
    </CajasContext.Provider>
  );
}

export const useCajas = () => useContext(CajasContext);