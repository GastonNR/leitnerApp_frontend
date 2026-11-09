import { lazy, Suspense, useEffect } from 'react'
import Header from '../components/organisms/Header'
import StudyHero from '../components/organisms/StudyHero'
import Boxes from '../components/organisms/Boxes'
import LeitnerAppLayout from '../components/template/LeitnerAppLayout'
import Calendar from '../components/organisms/Calendar'

// El formulario de nueva tarjeta trae el editor de texto (TipTap), que pesa
// bastante: va en un archivo aparte para no demorar la primera carga, y se
// descarga apenas el navegador queda libre.
const cargarFormulario = () => import('../components/organisms/CreateNewCardComponent')
const CreateNewCardComponent = lazy(cargarFormulario)

export default function LeitnerApp () {
  useEffect(() => {
    const precargar = () => { cargarFormulario().catch(() => {}) }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(precargar, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(precargar, 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <LeitnerAppLayout
      header={<Header/>}
      hero={<StudyHero/>}
      boxes={<Boxes/>}
      calendar={<Calendar/>}
      createNewCardComponent={<Suspense fallback={null}><CreateNewCardComponent/></Suspense>}
    />
  )
}
