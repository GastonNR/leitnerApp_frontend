import { createContext, useState, useContext, useEffect } from "react";

const CajasContext = createContext();

export default function CajasProvider({ children }) {

  //Declaramos usestate para manejar la carga de las cajas del usuario, y separar las tarjetas que el usuario debe usar hoy.
  const [cajas, setCajas] = useState([]);
  const [tarjetasDeHoy, setTarjetasDeHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  //El effect contiene el fetch que pide a la base de datos la carga de las cajas del usuario para poder renderizar los componentes.
  useEffect(() => {
    const fetchCajas = async () => {
      try {
        //usamos el token de la sesión del usuario para validar el acceso a la ruta que nos poporciona los datos del usuario.
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_HOME_URL}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //Guardamos un la constante data la respuesta de la base de datos y luego seteamos la constante de las cajas con esa información.
        const data = await res.json();
        setCajas(data)
        
      } catch (error) {
        console.error("Error al cargar las cajas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCajas();
  }, []);

  useEffect(() => {
    if (cajas.length === 5) {
      const hoy = new Date().toISOString().slice(0, 10);

      const todasLasTarjetas = cajas.flatMap(caja => caja.tarjetas || []);

      const tarjetasHoy = todasLasTarjetas.filter((tarjeta) => {
        if(!tarjeta.proxima_revision) return false
        const fechaRevision = new Date(tarjeta.proxima_revision).toISOString().slice(0, 10)

        return fechaRevision === hoy;
      });

      setTarjetasDeHoy(tarjetasHoy);
    }
  }, [cajas]);

  if (loading) return <p>Cargando cajas...</p>;

  return (
    <CajasContext.Provider value={{ cajas, setCajas, tarjetasDeHoy }}>
      {children}
    </CajasContext.Provider>
  );
}

export const useCajas = () => useContext(CajasContext);
