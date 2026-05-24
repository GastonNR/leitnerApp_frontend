import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginForm from "./features/auth/pages/LoginForm.jsx"
import Registro from "./features/auth/pages/Registro.jsx"
import Home from "./features/app/pages/Home.jsx"
import RutaProtegida from "./routes/RutaProtegida.jsx"
import CajasProvider from "./features/app/context/cajasContext.jsx"
import AuthProvider from "./features/auth/context/AuthContext.jsx"
import "./index.css"

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
