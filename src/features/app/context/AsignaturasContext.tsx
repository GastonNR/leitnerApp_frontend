import { createContext, useState, useContext, useEffect, useRef } from "react";
import {
  getAsignaturasService,
  crearAsignaturaService,
  renombrarAsignaturaService,
  eliminarAsignaturaService,
  crearTemaService,
  renombrarTemaService,
  moverTemaService,
  eliminarTemaService,
  guardarSesionService,
  crearNuevaTarjetaService,
  eliminarTarjetaService,
  editarTarjetaService
} from "../services/estudio.service";
import type {
  AsignaturasContextType,
  AsignaturasProviderProps,
  Asignatura,
  Tema,
  Tarjeta,
  NuevaTarjeta,
  EdicionTarjeta
} from '../types/context.types'
import { useAuth } from '../../auth/context/AuthContext'
import { mensajeDeError } from "../../../shared/api/axios"
import { precargarImagen } from "../hooks/useImagen"

const CLAVE_TEMA_ACTIVO = "tema_activo"

const AsignaturasContext = createContext<AsignaturasContextType | null>(null)

function leerTemaGuardado(): string | null {
  try { return localStorage.getItem(CLAVE_TEMA_ACTIVO) } catch { return null }
}

function guardarTemaActivo(temaId: string | null) {
  try {
    if (temaId) localStorage.setItem(CLAVE_TEMA_ACTIVO, temaId)
    else localStorage.removeItem(CLAVE_TEMA_ACTIVO)
  } catch { /* sin almacenamiento */ }
}

// Cambia un tema (esté en la asignatura que esté) sin tocar el resto.
function mapearTema(asignaturas: Asignatura[], temaId: string, cambio: (tema: Tema) => Tema): Asignatura[] {
  return asignaturas.map(asignatura =>
    asignatura.temas.some(t => t._id === temaId)
      ? { ...asignatura, temas: asignatura.temas.map(t => t._id === temaId ? cambio(t) : t) }
      : asignatura
  )
}

// Cambia una tarjeta (esté en el tema y la caja que esté) sin tocar el resto.
function mapearTarjeta(asignaturas: Asignatura[], tarjetaId: string, cambio: (tarjeta: Tarjeta) => Tarjeta | null): Asignatura[] {
  return asignaturas.map(asignatura => ({
    ...asignatura,
    temas: asignatura.temas.map(tema =>
      tema.cajas.some(c => c.tarjetas.some(t => t._id === tarjetaId))
        ? {
            ...tema,
            cajas: tema.cajas.map(caja => ({
              ...caja,
              tarjetas: caja.tarjetas.flatMap(t => {
                if (t._id !== tarjetaId) return [t]
                const nueva = cambio(t)
                return nueva ? [nueva] : []
              })
            }))
          }
        : tema
    )
  }))
}

function buscarTema(asignaturas: Asignatura[], temaId: string | null): { asignatura: Asignatura, tema: Tema } | undefined {
  for (const asignatura of asignaturas) {
    const tema = asignatura.temas.find(t => t._id === temaId)
    if (tema) return { asignatura, tema }
  }
}

// Tema que queda activo cuando el actual desaparece: otro de la misma
// asignatura si hay, si no el primero que exista.
function temaDeReemplazo(asignaturas: Asignatura[], asignaturaPreferida?: string): string | null {
  const misma = asignaturas.find(a => a._id === asignaturaPreferida)?.temas[0]
  return misma?._id ?? asignaturas.flatMap(a => a.temas)[0]?._id ?? null
}

export default function AsignaturasProvider({ children }: AsignaturasProviderProps) {

  const { token } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [temaActivoId, setTemaActivoId] = useState<string | null>(leerTemaGuardado)
  const [tarjetasDeHoy, setTarjetasDeHoy] = useState<Tarjeta[]>([])
  const [modalTemasAbierto, setModalTemasAbierto] = useState<boolean>(false)
  const [versionRepasos, setVersionRepasos] = useState<number>(0)
  const historialCambio = () => setVersionRepasos(v => v + 1)

  const activo = buscarTema(asignaturas, temaActivoId)
  const temaActivo = activo?.tema
  const asignaturaActiva = activo?.asignatura

  // Último estado conocido, para las respuestas de una sesión de estudio
  // (se encadenan antes de que React vuelva a renderizar).
  const ultimas = useRef<Asignatura[]>(asignaturas)
  useEffect(() => { ultimas.current = asignaturas }, [asignaturas])

  const activar = (temaId: string | null) => {
    setTemaActivoId(temaId)
    guardarTemaActivo(temaId)
  }

  // Trae todas las asignaturas al inicio (y al cambiar de usuario).
  useEffect(() => {
    const traer = async (): Promise<void> => {
      try {
        const encontradas = await getAsignaturasService()
        setAsignaturas(encontradas)

        const guardado = leerTemaGuardado()
        const inicial = buscarTema(encontradas, guardado) ? guardado : temaDeReemplazo(encontradas)
        setTemaActivoId(inicial)
        guardarTemaActivo(inicial)

      } catch (error) {
        console.error("Error al traer las asignaturas", error)
      } finally {
        setLoading(false)
      }
    }

    traer()
  }, [token])

  // Tarjetas del día del tema activo. Si no toca ninguna, se ofrece practicar la caja 1.
  useEffect(() => {

    if (temaActivo?.cajas?.length !== 5) {
      setTarjetasDeHoy([])
      return
    }

    const hoy = new Date().toLocaleDateString('sv-SE')

    const tarjetasHoy = temaActivo.cajas
      .flatMap(caja => caja.tarjetas || [])
      .filter(tarjeta =>
        !!tarjeta.proxima_revision &&
        new Date(tarjeta.proxima_revision).toLocaleDateString('sv-SE') <= hoy
      )

    setTarjetasDeHoy(tarjetasHoy.length > 0 ? tarjetasHoy : temaActivo.cajas[0]?.tarjetas || [])

  }, [temaActivo])

  //=============//
  // ASIGNATURAS //
  //=============//
  const crearAsignatura = async (nombre: string): Promise<Asignatura> => {
    try {
      const nueva = await crearAsignaturaService(nombre.trim())
      setAsignaturas(prev => [...prev, nueva])
      return nueva
    } catch (error) {
      console.error("Error al crear la asignatura", error)
      throw new Error(mensajeDeError(error, "No se pudo crear la asignatura."))
    }
  }

  // Solo cambia el nombre: sus temas quedan como están en el navegador.
  const renombrarAsignatura = async (asignaturaId: string, nombre: string): Promise<void> => {
    try {
      const renombrada = await renombrarAsignaturaService(asignaturaId, nombre.trim())
      setAsignaturas(prev => prev.map(a => a._id === asignaturaId ? { ...a, nombre: renombrada.nombre } : a))
    } catch (error) {
      console.error("Error al renombrar la asignatura", error)
      throw new Error(mensajeDeError(error, "No se pudo renombrar la asignatura."))
    }
  }

  const eliminarAsignatura = async (asignaturaId: string): Promise<void> => {
    try {
      await eliminarAsignaturaService(asignaturaId)
    } catch (error) {
      console.error("Error al eliminar la asignatura", error)
      throw new Error(mensajeDeError(error, "No se pudo eliminar la asignatura."))
    }

    const restantes = ultimas.current.filter(a => a._id !== asignaturaId)
    setAsignaturas(restantes)
    historialCambio()
    if (asignaturaActiva?._id === asignaturaId) activar(temaDeReemplazo(restantes))
  }

  //=======//
  // TEMAS //
  //=======//
  const crearTema = async (asignaturaId: string, nombre: string): Promise<Tema> => {
    try {
      const nuevo = await crearTemaService(asignaturaId, nombre.trim())
      setAsignaturas(prev => prev.map(a => a._id === asignaturaId ? { ...a, temas: [...a.temas, nuevo] } : a))
      activar(nuevo._id)
      return nuevo
    } catch (error) {
      console.error("Error al crear el tema", error)
      throw new Error(mensajeDeError(error, "No se pudo crear el tema."))
    }
  }

  // Solo cambia el nombre: no pisa las respuestas de una sesión en curso.
  const renombrarTema = async (temaId: string, nombre: string): Promise<void> => {
    try {
      const renombrado = await renombrarTemaService(temaId, nombre.trim())
      setAsignaturas(prev => mapearTema(prev, temaId, t => ({ ...t, nombre: renombrado.nombre })))
    } catch (error) {
      console.error("Error al renombrar el tema", error)
      throw new Error(mensajeDeError(error, "No se pudo renombrar el tema."))
    }
  }

  // Pasa el tema al final de otra asignatura. Si es el activo, sigue activo.
  const moverTema = async (temaId: string, asignaturaId: string): Promise<void> => {
    try {
      await moverTemaService(temaId, asignaturaId)
    } catch (error) {
      console.error("Error al mover el tema", error)
      throw new Error(mensajeDeError(error, "No se pudo mover el tema."))
    }

    setAsignaturas(prev => {
      const tema = buscarTema(prev, temaId)?.tema
      if (!tema) return prev
      return prev.map(a => {
        const sinTema = a.temas.filter(t => t._id !== temaId)
        return a._id === asignaturaId ? { ...a, temas: [...sinTema, tema] } : { ...a, temas: sinTema }
      })
    })
  }

  const eliminarTema = async (temaId: string): Promise<void> => {
    try {
      await eliminarTemaService(temaId)
    } catch (error) {
      console.error("Error al eliminar el tema", error)
      throw new Error(mensajeDeError(error, "No se pudo eliminar el tema."))
    }

    const asignaturaDelTema = buscarTema(ultimas.current, temaId)?.asignatura._id
    const restantes = ultimas.current.map(a => ({ ...a, temas: a.temas.filter(t => t._id !== temaId) }))
    setAsignaturas(restantes)
    historialCambio()
    if (temaActivoId === temaId) activar(temaDeReemplazo(restantes, asignaturaDelTema))
  }

  const cambiarTema = (temaId: string) => activar(temaId)

  //==========//
  // TARJETAS //
  //==========//
  const crearNuevaTarjeta = async (temaId: string, tarjeta: NuevaTarjeta): Promise<true | string> => {
    try {
      const nueva = await crearNuevaTarjetaService(temaId, tarjeta)
      if (nueva.imagen && tarjeta.imagen) precargarImagen(nueva.imagen, tarjeta.imagen)

      // Se actualiza el tema de la tarjeta partiendo del estado más reciente,
      // aunque el usuario haya cambiado de tema mientras se esperaba la respuesta.
      setAsignaturas(prev => mapearTema(prev, temaId, tema => ({
        ...tema,
        cajas: tema.cajas.map((caja, i) => i === 0 ? { ...caja, tarjetas: [...(caja.tarjetas || []), nueva] } : caja)
      })))
      return true

    } catch (error) {
      console.error("Error al crear la tarjeta", error)
      return mensajeDeError(error, 'No se pudo crear la tarjeta. Inténtalo de nuevo.')
    }
  }

  // Marca la respuesta de una tarjeta en la sesión de estudio. Solo cambia el
  // estado local; guardar() lo envía al terminar. Devuelve el tema actualizado.
  const actualizarTarjeta = (esCorrecta: boolean, tarjeta: Tarjeta): Tema | undefined => {
    const actualizadas = mapearTarjeta(ultimas.current, tarjeta._id, t => ({ ...t, es_correcta: esCorrecta }))
    ultimas.current = actualizadas
    setAsignaturas(actualizadas)
    return buscarTema(actualizadas, temaActivoId)?.tema
  }

  // Guarda la sesión del tema: el backend reparte las tarjetas en sus nuevas cajas.
  const guardar = async (tema: Tema): Promise<boolean> => {
    try {
      const respuestas = tema.cajas
        .flatMap(caja => caja.tarjetas)
        .flatMap(t => typeof t.es_correcta === 'boolean' ? [{ _id: t._id, es_correcta: t.es_correcta }] : [])
      const guardado = await guardarSesionService(tema._id, respuestas)
      setAsignaturas(prev => mapearTema(prev, tema._id, () => guardado))
      historialCambio()
      return true
    } catch (error) {
      console.error("Error al guardar la sesión", error)
      return false
    }
  }

  const eliminarTarjeta = async (tarjetaId: string): Promise<boolean> => {
    try {
      await eliminarTarjetaService(tarjetaId)
    } catch (error) {
      console.error("Error al eliminar la tarjeta", error)
      return false
    }
    setAsignaturas(prev => mapearTarjeta(prev, tarjetaId, () => null))
    return true
  }

  // Edita una tarjeta sin moverla de caja: solo cambian texto e imagen.
  const editarTarjeta = async (tarjetaId: string, datos: EdicionTarjeta): Promise<true | string> => {
    try {
      const editada = await editarTarjetaService(tarjetaId, datos)
      if (editada.imagen && datos.imagen) precargarImagen(editada.imagen, datos.imagen)
      setAsignaturas(prev => mapearTarjeta(prev, tarjetaId, t => ({
        ...t,
        pregunta: editada.pregunta,
        respuesta: editada.respuesta,
        imagen: editada.imagen ?? null
      })))
      return true
    } catch (error) {
      console.error("Error al editar la tarjeta", error)
      return mensajeDeError(error, 'No se pudo actualizar la tarjeta. Inténtalo de nuevo.')
    }
  }

  if (loading) return <p>Cargando cajas...</p>;

  return (
    <AsignaturasContext.Provider value={{
      asignaturas,
      temaActivo,
      asignaturaActiva,
      tarjetasDeHoy,
      versionRepasos,
      modalTemasAbierto,
      setModalTemasAbierto,
      crearAsignatura,
      renombrarAsignatura,
      eliminarAsignatura,
      crearTema,
      renombrarTema,
      moverTema,
      eliminarTema,
      cambiarTema,
      crearNuevaTarjeta,
      actualizarTarjeta,
      guardar,
      eliminarTarjeta,
      editarTarjeta,
    }}>
      {children}
    </AsignaturasContext.Provider>
  );
}

export const useAsignaturas = () => {
  const context = useContext(AsignaturasContext)

  if (!context) throw new Error("useAsignaturas debe utilizarse dentro de AsignaturasProvider")

  return context
}
