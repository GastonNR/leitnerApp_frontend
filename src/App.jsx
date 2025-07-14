import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Home from "./pages/Home.jsx"
import "./css/index.css"

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
