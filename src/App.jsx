import { BrowserRouter, Routes, Route } from "react-router-dom"
import Registro from "./pages/Registro"
import Home from "./pages/Home.jsx"
import "./css/index.css"
import RutaProtegida from "./pages/RutaProtegida.jsx"
import CajasProvider from "./context/cajasContext.jsx"
import AuthProvider from "./context/AuthContext.jsx"
import LoginForm from "./pages/LoginForm.jsx"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/registro" element={<Registro />} />

          <Route element={<RutaProtegida />} >
            <Route path="/Home" element={
              <CajasProvider>
                <Home />
              </CajasProvider>
            } />
          </Route>

          <Route path="*" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
