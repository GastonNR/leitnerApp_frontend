import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./features/landing/pages/LandingPage.jsx"
import LoginForm from "./features/auth/pages/LoginForm.tsx"
import Registro from "./features/auth/pages/Registro.tsx"
import LeitnerApp from "./features/app/pages/LeitnerApp.jsx"
import RutaProtegida from "./routes/RutaProtegida.jsx"
import CajasProvider from "./features/app/context/cajasContext.jsx"
import AuthProvider from "./features/auth/context/AuthContext.tsx"
import "./index.css"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
