import Header from '../layouts/Header.tsx'
import Sidebar from '../components/organisms/Sidebar.js'
import Study_mode from '../layouts/Study_mode.tsx'
import Boxes from '../components/organisms/Boxes.js'
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
