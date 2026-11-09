import { useEffect, useRef } from "react"
import { EditorContent, Extension, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "@tiptap/markdown"
import { Placeholder } from "@tiptap/extensions"
import type { QuestionAnswerProps } from "../../types/components.types"
import BarraFormato from "./BarraFormato"
import styles from "./css/questionAnswer.module.css"

// Ctrl/Cmd+Enter es el atajo del formulario para crear la tarjeta: el editor no
// debe usarlo para insertar un salto de línea (lo trae StarterKit).
const AtajoFormulario = Extension.create({
    name: 'atajoFormulario',
    priority: 1000,
    addKeyboardShortcuts() {
        return { 'Mod-Enter': () => true }
    },
})

// Editor de texto con formato (TipTap). Se ve el resultado final, sin símbolos;
// hacia afuera el valor es Markdown, que es lo que se guarda en la tarjeta.
export default function QuestionAnswer({ textAreaId, textLabel, value, placeholder, error, autoFocus = false, setOnChange }: QuestionAnswerProps) {
    const idError = `${textAreaId}-error`
    const idLabel = `${textAreaId}-label`
    // Último valor que salió del editor, para no reescribirlo cuando vuelve
    // por props (solo se reescribe si cambió desde afuera, p. ej. al vaciarlo).
    const ultimo = useRef(value || '')
    const onChange = useRef(setOnChange)
    useEffect(() => { onChange.current = setOnChange })

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2] },
                // Solo negrita, itálica, listas y tamaños: lo que se puede mostrar
                // en la tarjeta. Lo demás queda afuera (también al pegar).
                blockquote: false,
                code: false,
                codeBlock: false,
                horizontalRule: false,
                strike: false,
                underline: false,
                link: false,
                trailingNode: false,
            }),
            Markdown.configure({ markedOptions: { breaks: true } }),
            Placeholder.configure({ placeholder: placeholder ?? '' }),
            AtajoFormulario,
        ],
        content: value || '',
        contentType: 'markdown',
        // Cursor al final del texto (al abrir el modal de edición)
        autofocus: autoFocus ? 'end' : false,
        onUpdate: ({ editor: e }) => {
            const md = e.isEmpty ? '' : e.getMarkdown()
            ultimo.current = md
            onChange.current(md)
        },
    })

    // Valor cambiado desde afuera (el formulario lo vacía al crear la tarjeta).
    useEffect(() => {
        const nuevo = value || ''
        if (nuevo === ultimo.current) return
        ultimo.current = nuevo
        editor.commands.setContent(nuevo, { contentType: 'markdown', emitUpdate: false })
    }, [editor, value])

    // Atributos del área editable: el id permite enfocarla desde afuera
    // (getElementById(...).focus()) y el resto la describe para lectores de pantalla.
    useEffect(() => {
        editor.setOptions({
            editorProps: {
                attributes: {
                    id: textAreaId,
                    class: styles.contenido,
                    role: 'textbox',
                    'aria-multiline': 'true',
                    'aria-labelledby': idLabel,
                    'aria-invalid': error ? 'true' : 'false',
                    ...(error ? { 'aria-describedby': idError } : {}),
                },
            },
        })
    }, [editor, textAreaId, idLabel, idError, error])

    return (
        <div className={styles.campo}>
            {/* No es un <label for>: el área editable no es un campo de formulario */}
            <span id={idLabel} className={styles.label} onClick={() => editor.commands.focus()}>{textLabel}</span>
            <div className={`${styles.editor} ${error ? styles.conError : ''}`}>
                <BarraFormato editor={editor} etiqueta={`Formato de la ${textLabel.toLowerCase()}`} />
                <EditorContent editor={editor} className={styles.area} />
            </div>
            {error && <p id={idError} className={styles.error}>{error}</p>}
        </div>
    )
}
