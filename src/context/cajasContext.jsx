import { createContext, useState, useContext, useEffect } from "react";
import { crearLeccionRequest, deleteLecciones, getLecciones } from "../services/lecciones.service";

const CajasContext = createContext();

export default function CajasProvider({ children }) {

  const [cajas, setCajas] = useState([]);
  const [tarjetasDeHoy, setTarjetasDeHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manejo de lecciones
  const [lecciones, setLecciones] = useState([]); // [{ id, nombre, cajas }]
  const [leccionActiva, setLeccionActiva] = useState(null); // { id, nombre }

  // Modal de lecciones
  const [modalLeccionesAbierto, setModalLeccionesAbierto] = useState(false);

  //Trae todas las lecciones de la base de datos al inicio.
  useEffect(() => {
    const traerLeccionesDB = async () => {
      try {
        const leccionesEncontradas = await getLecciones()

        if (leccionesEncontradas) setLecciones(leccionesEncontradas)
        if (!leccionActiva) setLeccionActiva(leccionesEncontradas[0] || "null")
          
        } catch (error) {
          console.error("Error al traer las lecciones", error)
          
        } finally {
          setLoading(false);
          
        }
      }
      
      traerLeccionesDB()

  }, [])

  // Cargar cajas
  useEffect(()=>{
    if(leccionActiva?.cajas) setCajas(leccionActiva.cajas)
  }, [leccionActiva])

  // Sincronizar cajas con la lección activa cuando cambian
  useEffect(() => {
    if (leccionActiva && cajas.length === 5) {
      setLecciones(prev => {
        const actualizadas = prev.map(l =>
          l.id === leccionActiva.id ? { ...l, cajas } : l
        );
        
        return actualizadas;
      });

    }

  }, [cajas]);

  //Carga las tarjetas del día.
  useEffect(() => {

    if (cajas.length === 5) {

      const hoy = new Date().toISOString().slice(0, 10)
      const todasLasTarjetas = cajas.flatMap(caja => caja.tarjetas || [])

      const tarjetasHoy = todasLasTarjetas.filter((tarjeta) => {
        if (!tarjeta.proxima_revision) return false
        const fechaRevision = new Date(tarjeta.proxima_revision).toISOString().slice(0, 10)
        return fechaRevision === hoy
      })

      setTarjetasDeHoy(tarjetasHoy)

    }

  }, [cajas]);

  // Crear nueva lección
  const crearLeccion = async (nombre) => {

    try {
      const nombreNuevaLeccion = nombre.trim()
      const nuevaLeccion = await crearLeccionRequest(nombreNuevaLeccion)

      setLecciones(prev => [...prev, nuevaLeccion])
      setLeccionActiva(nuevaLeccion)

      setModalLeccionesAbierto(false);

    } catch (error) {
      console.error("Error al crear una nueva lección", error)

    }

  }

  // Cambiar a una lección existente
  const cambiarLeccion = (leccion) => {

    setLeccionActiva({ id: leccion._id, nombre: leccion.nombre });
    setCajas(leccion.cajas);

    setModalLeccionesAbierto(false);

  }

  // Eliminar lección
  const eliminarLeccion = async (id) => {

    try {
      const res = await deleteLecciones(id)

      setLecciones(prev => prev.filter(l => l._id !== id))

      if (leccionActiva?._id === id) setLeccionActiva(null)

      setModalLeccionesAbierto(false)


    } catch (error) {
      console.error("Error eliminando: ", error)
    }

  }

  if (loading) return <p>Cargando cajas...</p>;

  return (
    <CajasContext.Provider value={{
      cajas, setCajas,
      tarjetasDeHoy,
      lecciones,
      leccionActiva,
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