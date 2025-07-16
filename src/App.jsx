import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Home from "./pages/Home.jsx"
import "./css/index.css"
import RutaProtegida from "./pages/RutaProtegida.jsx"

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={ <RutaProtegida /> } >
          <Route path="/Home" element={<Home />} />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
