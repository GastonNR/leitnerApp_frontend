import Header from '../components/template/Header.js'
import Sidebar from '../organisms/Sidebar.js'
import Study_mode from '../organisms/Study_mode.js'
import Boxes from '../organisms/Boxes.js'
import "../css/leitnerApp.css"
import LeitnerAppLayout from '../components/template/LeitnerAppLayout.js'
import CreateNewCardComponent from '../components/organisms/CreateNewCardComponent.js'

export default function LeitnerApp () {
  return (

    <div id="main-app" className="main-app">
        <LeitnerAppLayout
            header={<Header/>}
            sidebar={<Sidebar/>}
            boxes={<Boxes/>}
            calendar={<Calendar/>}
            createNewCardComponent={<CreateNewCardComponent/>}
        />
    </div>

  )
}
