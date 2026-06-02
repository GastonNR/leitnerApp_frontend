import Header from '../layouts/Header.jsx'
import Sidebar from '../layouts/Sidebar.jsx'
import Study_mode from '../layouts/Study_mode.jsx'
import Boxes from '../layouts/Boxes.jsx'
//import BoxModal from '../layouts/BoxModal.jsx'
//import LeccionesProvider from '../context/LeccionesContext.tsx'
import "../css/leitnerApp.css"

export default function LeitnerApp () {
  return (

    <div id="main-app" className="main-app">
        <Header />
        <main className="main">
            <div className="div-1">
                <Sidebar/>
            </div>
            <div className="div-2">
                <Study_mode />
            </div>
            <div className='div-3'>
                <Boxes />              
            </div>
        </main>
    </div>

  )
}
