import type { MouseEvent, ReactNode } from 'react'
import { useEditorState, type Editor } from '@tiptap/react'
import styles from './css/barraFormato.module.css'

type Tamano = 'normal' | 'titulo' | 'subtitulo'

interface BarraFormatoProps {
    editor: Editor
    etiqueta: string
}

const esMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const MOD = esMac ? '⌘' : 'Ctrl'

// Evita que el click saque el foco del editor (y pierda la selección).
const conservarFoco = (e: MouseEvent) => e.preventDefault()

function Boton({ titulo, activo, onClick, children }: {
    titulo: string, activo: boolean, onClick: () => void, children: ReactNode
}) {
    return (
        <button
            type="button"
            className={`${styles.boton} ${activo ? styles.activo : ''}`}
            title={titulo}
            aria-label={titulo}
            aria-pressed={activo}
            onMouseDown={conservarFoco}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

// Barra chica de formato de un editor de texto (TipTap). Los botones se ven
// presionados según el formato que hay donde está el cursor.
export default function BarraFormato({ editor, etiqueta }: BarraFormatoProps) {
    const estado = useEditorState({
        editor,
        selector: ({ editor: e }) => ({
            negrita: e.isActive('bold'),
            italica: e.isActive('italic'),
            vinetas: e.isActive('bulletList'),
            numeros: e.isActive('orderedList'),
            tamano: (e.isActive('heading', { level: 1 }) ? 'titulo'
                : e.isActive('heading', { level: 2 }) ? 'subtitulo'
                : 'normal') as Tamano,
        }),
    })

    const cambiarTamano = (tamano: Tamano) => {
        const cadena = editor.chain().focus()
        if (tamano === 'normal') cadena.setParagraph().run()
        else cadena.setHeading({ level: tamano === 'titulo' ? 1 : 2 }).run()
    }

    return (
        <div role="toolbar" aria-label={etiqueta} className={styles.barra}>
            <select
                className={styles.tamano}
                aria-label="Tamaño del texto"
                title="Tamaño del texto"
                value={estado.tamano}
                onChange={e => cambiarTamano(e.target.value as Tamano)}
            >
                <option value="normal">Normal</option>
                <option value="titulo">Título</option>
                <option value="subtitulo">Subtítulo</option>
            </select>

            <span className={styles.separador} aria-hidden="true" />

            <Boton titulo={`Negrita (${MOD}+B)`} activo={estado.negrita} onClick={() => editor.chain().focus().toggleBold().run()}>
                <strong className={styles.letra}>B</strong>
            </Boton>
            <Boton titulo={`Itálica (${MOD}+I)`} activo={estado.italica} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <em className={`${styles.letra} ${styles.italica}`}>I</em>
            </Boton>

            <span className={styles.separador} aria-hidden="true" />

            <Boton titulo="Lista con viñetas" activo={estado.vinetas} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M9 6h11M9 12h11M9 18h11" />
                    <circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
                    <circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
                    <circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
                </svg>
            </Boton>
            <Boton titulo="Lista numerada" activo={estado.numeros} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 6h10M10 12h10M10 18h10" />
                    <path d="M4 4.5h1.2v4M3.8 8.5h2.6" strokeWidth="1.5" />
                    <path d="M3.8 14.2c.3-.6.9-.9 1.5-.8.7.1 1.1.7.9 1.3-.2.6-1.2 1.2-2.4 2.3h2.6" strokeWidth="1.5" />
                </svg>
            </Boton>
        </div>
    )
}
