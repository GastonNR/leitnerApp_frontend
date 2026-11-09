import Markdown, { type Components } from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import styles from './css/textoMarkdown.module.css'

// Solo estos elementos se muestran; el resto se reduce a su texto (enlaces,
// citas, código...) o se descarta (imágenes). El HTML escrito a mano nunca se
// interpreta (skipHtml), así que una tarjeta no puede inyectar código.
const PERMITIDOS = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

// Los títulos se muestran como párrafos grandes, no como encabezados del
// documento: una tarjeta no debería alterar la estructura de la página.
const titulo: Components['h1'] = ({ children }) => <p className={styles.titulo}>{children}</p>
const subtitulo: Components['h2'] = ({ children }) => <p className={styles.subtitulo}>{children}</p>

const COMPONENTES: Components = {
    h1: titulo,
    h2: subtitulo,
    h3: subtitulo,
    h4: subtitulo,
    h5: subtitulo,
    h6: subtitulo,
}

interface TextoMarkdownProps {
    texto: string
    id?: string
    className?: string
}

export default function TextoMarkdown({ texto, id, className = '' }: TextoMarkdownProps) {
    return (
        <div id={id} className={`${styles.md} ${className}`}>
            <Markdown
                remarkPlugins={[remarkBreaks]}
                allowedElements={PERMITIDOS}
                unwrapDisallowed
                skipHtml
                components={COMPONENTES}
            >
                {texto}
            </Markdown>
        </div>
    )
}
