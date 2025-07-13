import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Home from "./pages/Home"
import "./css/index.css"
import "./css/style.css"

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
