import { Link } from 'react-router-dom'
import LeitnerIcon from '../../../assets/icons/leitnerAppIcon.png'
import './css/headerHome.css'

export default function HeaderHome() {
  return (
    <header className="header-home">
      <div className="header-home-izq">
        <Link to={'/'}>
          <img className='leitnerIconImg' src={LeitnerIcon} alt="LeitnerApp logo" />
        </Link>
        <h1>LeitnerApp</h1>
      </div>
      <div className="header-home-der">
        <button className='btn-home-header'>Empezar</button>
        <button className='btn-home-header'>Registrarse</button>
      </div>
    </header>
  )
}
