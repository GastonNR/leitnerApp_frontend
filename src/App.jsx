import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./features/landing/pages/Home.jsx"
import LoginForm from "./features/auth/pages/LoginForm.jsx"
import Registro from "./features/auth/pages/Registro.jsx"
import LeitnerApp from "./features/app/pages/LeitnerApp.jsx"
import RutaProtegida from "./routes/RutaProtegida.jsx"
import CajasProvider from "./features/app/context/cajasContext.jsx"
import AuthProvider from "./features/auth/context/AuthContext.jsx"
import "./index.css"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<Registro />} />

          <Route element={<RutaProtegida />} >
            <Route path="/leitnerApp" element={
              <CajasProvider>
                <LeitnerApp />
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
