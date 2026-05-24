import HeaderHome from "../components/HeaderHome.jsx"
import LandingContent from "../components/LandingContent.jsx"
import Footer from "../components/Footer.jsx"
import './home.css'

export default function Home() {
  return (
    <div className="home">
        <HeaderHome />
        <LandingContent />
        <Footer />
    </div>
  )
}
