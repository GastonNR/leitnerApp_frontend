import { replace, useNavigate } from 'react-router-dom'
import { useLecciones } from '../../context/LeccionesContext'
import LeccionesModal from './LeccionesModal'
//import { guardarLeccionService } from '../services/lecciones.service'
import { useAuth } from '../../../auth/context/AuthContext'
import ActiveLectionHeader from '../molecules/ActiveLectionHeader'
import Heading from '../atoms/Heading'
import Button from '../atoms/Button'
import CustomButton from '../molecules/CustomButton'
import "./css/header.css"
import { useState } from 'react'
import Study_mode from './Study_mode'

export default function Header() {
  const navigate = useNavigate()
  const [modalStudyCard, setModalStudyCard] = useState<boolean>(false)
  const { leccionActivaId, leccionActiva, setLecciones, setModalLeccionesAbierto, modalLeccionesAbierto } = useLecciones()
  const { logout } = useAuth()

  const cerrarSesion = (): void => {
    logout()
    navigate('/login', { replace: true })
  }

  //async function guardar(): Promise<void> {
  //  
  //  if(!leccionActiva) return
  //  const leccion = leccionActiva
  //  const leccionActualizada = await guardarLeccionService(leccion)
  //
  //  if(leccionActualizada) alert("Lección guardada.")
  //  
  //  setLecciones(prev => 
  //    prev.map(leccion => {
  //      if(leccion._id !== leccionActivaId) return leccion
  //      return leccionActualizada
  //    })
  //  )
  //  
  //}

  return (
    <>
      <header className="header">
        <div className="container-header">

          <div className="header-izquierda">
            <Heading variante={'h1'} className={'titulo-header'} texto={'LeitnerApp'} />
            {leccionActiva && (
              <ActiveLectionHeader nombreLeccionActiva={leccionActiva.nombre} />
            )}
          </div>

          <div className="header-derecha">
            <span id="user-name" className="span md:inline">Usuario</span>

            <CustomButton
              variante={'btn_leccion'}
              className={'header-btn header-btn--leccion'}
              texto={'Lecciones'}
              onclick={() => setModalLeccionesAbierto(true)}
            />

            <CustomButton
              variante={'btn-iniciar-leccion'}
              className={'header-btn header-btn--leccion'}
              texto={'Empezar'}
              onclick={() => setModalStudyCard(true)}
            />

            <Button
              className={'logout-btn'}
              texto={'Cerrar sesión'}
              onclick={cerrarSesion}
            />
            
          </div>
        </div>
      </header>
      {modalLeccionesAbierto && <LeccionesModal />}
      {modalStudyCard && <Study_mode setModalStudyCard={setModalStudyCard} />}
    </>
  )
}
