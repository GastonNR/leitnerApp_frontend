import { createContext, useState, useContext, useEffect } from "react";
import { crearLeccionRequest } from "../services/lecciones.service";

const CajasContext = createContext();

//const CAJAS_VACIAS = () => [
//  { numero: 1, tarjetas: [] },
//  { numero: 2, tarjetas: [] },
//  { numero: 3, tarjetas: [] },
//  { numero: 4, tarjetas: [] },
//  { numero: 5, tarjetas: [] },
//];

export default function CajasProvider({ children }) {

  const [cajas, setCajas] = useState([]);
  const [tarjetasDeHoy, setTarjetasDeHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manejo de lecciones
  const [lecciones, setLecciones] = useState([]); // [{ id, nombre, cajas }]
  const [leccionActiva, setLeccionActiva] = useState(null); // { id, nombre }

  // Modal de lecciones
  const [modalLeccionesAbierto, setModalLeccionesAbierto] = useState(false);

  useEffect(() => {
    const fetchCajas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_HOME_URL}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // Cargar lecciones guardadas en localStorage
        const leccionesGuardadas = JSON.parse(localStorage.getItem("lecciones") || "[]");
        const leccionActivaGuardada = JSON.parse(localStorage.getItem("leccionActiva") || "null");

        if (leccionesGuardadas.length > 0 && leccionActivaGuardada) {
          // Hay lecciones guardadas: cargar la lección activa
          setLecciones(leccionesGuardadas);
          setLeccionActiva(leccionActivaGuardada);
          const leccion = leccionesGuardadas.find(l => l.id === leccionActivaGuardada.id);
          setCajas(leccion ? leccion.cajas : data);
        } else {
          // Primera vez: usar datos del backend como lección por defecto
          setCajas(data);
        }

        console.log("Cajas: ", data);
      } catch (error) {
        console.error("Error al cargar las cajas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCajas();
  }, []);

  // Sincronizar cajas con la lección activa cuando cambian
  useEffect(() => {
    if (leccionActiva && cajas.length === 5) {
      setLecciones(prev => {
        const actualizadas = prev.map(l =>
          l.id === leccionActiva.id ? { ...l, cajas } : l
        );
        localStorage.setItem("lecciones", JSON.stringify(actualizadas));
        return actualizadas;
      });
    }
  }, [cajas]);

  useEffect(() => {
    if (cajas.length === 5) {
      const hoy = new Date().toISOString().slice(0, 10);
      const todasLasTarjetas = cajas.flatMap(caja => caja.tarjetas || []);
      const tarjetasHoy = todasLasTarjetas.filter((tarjeta) => {
        if (!tarjeta.proxima_revision) return false;
        const fechaRevision = new Date(tarjeta.proxima_revision).toISOString().slice(0, 10);
        return fechaRevision === hoy;
      });
      setTarjetasDeHoy(tarjetasHoy);
    }
  }, [cajas]);

  // Crear nueva lección
  const crearLeccion = (nombre) => {
    //const nuevaLeccion = {
    //  id: Date.now().toString(),
    //  nombre: nombre.trim(),
    //  cajas: CAJAS_VACIAS(),
    //};
    const nombreNuevaLeccion = nombre.trim()
    crearLeccionRequest(nombreNuevaLeccion)

    const nuevasLecciones = [...lecciones, nuevaLeccion];
    setLecciones(nuevasLecciones);
    setLeccionActiva({ id: nuevaLeccion.id, nombre: nuevaLeccion.nombre });
    setCajas(nuevaLeccion.cajas);
    localStorage.setItem("lecciones", JSON.stringify(nuevasLecciones));
    localStorage.setItem("leccionActiva", JSON.stringify({ id: nuevaLeccion.id, nombre: nuevaLeccion.nombre }));
    setModalLeccionesAbierto(false);
    
  };

  // Cambiar a una lección existente
  const cambiarLeccion = (leccion) => {
    setLeccionActiva({ id: leccion.id, nombre: leccion.nombre });
    setCajas(leccion.cajas);
    localStorage.setItem("leccionActiva", JSON.stringify({ id: leccion.id, nombre: leccion.nombre }));
    setModalLeccionesAbierto(false);
  };

  // Eliminar lección
  const eliminarLeccion = (id) => {
    const nuevasLecciones = lecciones.filter(l => l.id !== id);
    setLecciones(nuevasLecciones);
    localStorage.setItem("lecciones", JSON.stringify(nuevasLecciones));
    if (leccionActiva?.id === id) {
      if (nuevasLecciones.length > 0) {
        cambiarLeccion(nuevasLecciones[0]);
      } else {
        setLeccionActiva(null);
        localStorage.removeItem("leccionActiva");
      }
    }
  };

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