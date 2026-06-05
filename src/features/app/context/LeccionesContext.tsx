import { createContext, useState, useContext, useEffect } from "react";
import {
  crearLeccionService,
  deleteLeccionService,
  eliminarTarjetaService,
  getLeccionesService,
  guardarLeccionService,
  crearNuevaTarjetaService
} from "../services/lecciones.service";
import type {
  LeccionesContextType,
  LeccionesProviderProps,
  Leccion,
  Tarjeta,
  NuevaTarjeta
} from '../types/context.types'
import { useAuth } from '../../auth/context/AuthContext'

const LeccionesContext = createContext<LeccionesContextType | null>(null)

export default function LeccionesProvider({ children }: LeccionesProviderProps) {

  const [tarjetasDeHoy, setTarjetasDeHoy] = useState<Tarjeta[]>([])
  const { token } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)

  // Manejo de lecciones
  const [lecciones, setLecciones] = useState<Leccion[]>([]); // [{ id, nombre, cajas }]
  const [leccionActivaId, setLeccionActivaId] = useState<string | null>(localStorage.getItem("leccion_activa") || null) // 'id'
  const leccionActiva = lecciones.find(l => l._id === leccionActivaId)

  // Modal de lecciones
  const [modalLeccionesAbierto, setModalLeccionesAbierto] = useState<boolean>(false);

  //Trae todas las lecciones de la base de datos al inicio.
  useEffect(() => {
    const traerLeccionesDB = async (): Promise<void> => {
      try {
        const leccionesEncontradas: Array<Leccion> = await getLeccionesService()

        if (leccionesEncontradas?.length > 0) {
          setLecciones(leccionesEncontradas)

          const idGuardado = localStorage.getItem("leccion_activa")
          const existeLeccion = leccionesEncontradas.some(l => l._id === idGuardado)
          const idInicial: string | null = existeLeccion ? idGuardado : leccionesEncontradas[0]._id
          if(idInicial) localStorage.setItem("leccion_activa", idInicial)
          setLeccionActivaId(idInicial)
          
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
  const crearLeccion = async (nombre: string): Promise<void> => {

    try {
      const nombreNuevaLeccion = nombre.trim()
      const nuevaLeccion: Leccion = await crearLeccionService(nombreNuevaLeccion)
      setLecciones(prev => [...prev, nuevaLeccion])
      setLeccionActivaId(nuevaLeccion._id)

      localStorage.setItem("leccion_activa", nuevaLeccion._id)

      setModalLeccionesAbierto(false);

    } catch (error) {
      console.error("Error al crear una nueva lección", error)

    }

  }

  // Cambiar a una lección existente
  const cambiarLeccion = (leccionId: string) => {

    setLeccionActivaId(leccionId)
    localStorage.setItem("leccion_activa", leccionId)

    setModalLeccionesAbierto(false);

  }

  // Eliminar lección
  const eliminarLeccion = async (id: string): Promise<void> => {

    try {
      await deleteLeccionService(id)

      const nuevasLecciones: Array<Leccion> = lecciones.filter(l => l._id !== id)
      setLecciones(nuevasLecciones)

      if (leccionActivaId === id) {
        const nuevaLeccionActiva: string | null = nuevasLecciones[0]?._id || null
        setLeccionActivaId(nuevaLeccionActiva)

        if (nuevaLeccionActiva) {
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
  const crearNuevaTarjeta = async (leccionId: string, tarjeta: NuevaTarjeta) => {

    if(!leccionActiva) return

    const nuevaTarjeta = await crearNuevaTarjetaService(leccionActiva._id, tarjeta)

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

  const actualizarTarjeta = async (esCorrecta: boolean, tarjeta: Tarjeta): Promise<Leccion[]> => {

    const leccionesActualizadas: Leccion[] = lecciones.map(leccion => {

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
// ACTUALIZA LAS TARJETAS DESPUÉS DE UNA REVISIÓN DE LA LECCIÓN ACTIVA
  const guardar = async (leccionesActualizadas: Leccion[]): Promise<{ok: true} | undefined> => {
    
    const leccionActualizada = leccionesActualizadas.find(
      l => l._id === leccionActivaId
    )
    
    if (!leccionActualizada) return

    const respuesta: Leccion = await guardarLeccionService(leccionActualizada)

    if (respuesta) {
      setLecciones(prev =>
        prev.map(leccion => {
          if (leccion._id !== leccionActivaId) return leccion
          return respuesta
        })
      )

      return {ok: true}
    }
  }

  const eliminarTarjetaContext = async (indexCaja: number, cajaElegida: Tarjeta[], indiceCajaNum: number) => {

    const tarjetaId = cajaElegida[indexCaja]._id
    const eliminarYActualizar = await eliminarTarjetaService(tarjetaId)

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
    <LeccionesContext.Provider value={{
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
    </LeccionesContext.Provider>
  );
}

export const useLecciones = () => {
  const context = useContext(LeccionesContext)

  if(!context) throw new Error("useLecciones debe utilizarse dentro de LeccionesProvider")
  
  return context

}