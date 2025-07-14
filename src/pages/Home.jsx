import Header from '../layouts/Header'
import Sidebar from '../layouts/Sidebar'
import Study_mode from '../layouts/Study_mode'
import Boxes from '../layouts/Boxes'
import BoxModal from '../layouts/BoxModal'
import "../css/home.css"

export default function Home() {
  return (
    
    <div id="main-app" className="main">
        
        <Header />
        
        
        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
                <Sidebar/>
                <div className="w-full md:w-3/4">
                    <Study_mode />
                    <Boxes />
                </div>
            </div>
        </main>
        
        
        

        <BoxModal />
    </div>
    
  )
}
