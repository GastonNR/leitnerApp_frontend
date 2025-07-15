import Header from '../layouts/Header'
import Sidebar from '../layouts/Sidebar'
import Study_mode from '../layouts/Study_mode'
import Boxes from '../layouts/Boxes'
import BoxModal from '../layouts/BoxModal'
import "../css/home.css"

export default function Home() {
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
        
        <BoxModal />
    </div>
    
  )
}
