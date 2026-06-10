import Header from '../components/organisms/Header'
import Sidebar from '../components/organisms/Sidebar'
//import Study_mode from '../organisms/Study_mode.js'
import Boxes from '../components/organisms/Boxes'
import LeitnerAppLayout from '../components/template/LeitnerAppLayout'
import Calendar from '../components/organisms/Calendar'
import CreateNewCardComponent from '../components/organisms/CreateNewCardComponent'
//import "../css/leitnerApp.css"

export default function LeitnerApp () {
  return (

    <div id="main-app" className="main-app">
        <LeitnerAppLayout
            header={<Header/>}
            sidebar={<Sidebar/>}
            calendar={<Calendar/>}
            createNewCardComponent={<CreateNewCardComponent/>}
        />
    </div>

  )
}
