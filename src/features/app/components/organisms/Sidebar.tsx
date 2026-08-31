import Heading from '../atoms/Heading'
import Paragraph from '../atoms/Paragraph'
import "./css/sidebar.css"
import Boxes from './Boxes'


export default function Sidebar() {

    return (
        <div className="sidebar">
            <div className="sidebar_superior">
                <Heading variante={'h2'} className={'sidebar_titulo'} texto={'Sistema Leitner'} />
                <Paragraph className={'sidebar_parr'} texto={'Organiza tus tarjetas en 5 cajas según tu nivel de conocimiento. Las tarjetas se mueven entre cajas según tu desempeño.'} />
            </div>

            <Boxes />

        </div>
    )
}
