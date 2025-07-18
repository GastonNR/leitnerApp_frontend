import { createContext, useState, useContext, useEffect } from "react"

const CajasContext = createContext()

export default function CajasProvider({ children }) {

  const [cajas, setCajas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCajas = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${import.meta.env.VITE_HOME_URL}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()
        setCajas(data)

      } catch (error) {
        console.error('Error al cargar las cajas: ', error)

      } finally {
        setLoading(false)
      }
    }

    fetchCajas()
  }, [])

  //console.log(cajas)
  useEffect(()=>{
    console.log(cajas)
  }, [cajas])

  if(loading) return <p>Cargando cajas...</p>
    
  return (
    <CajasContext.Provider value={{ cajas, setCajas }}>
      { children }
    </CajasContext.Provider>
  )

}

export const useCajas = () => useContext(CajasContext)