// Las tarjetas guardan pregunta y respuesta como Markdown (un string normal):
//   **negrita**   *itálica*   - viñetas   1. numeración   # Título   ## Subtítulo
// Se edita con TipTap (molecules/QuestionAnswer) y se muestra con
// atoms/TextoMarkdown.

// Texto sin formato, para aria-label, textos alternativos o para saber si un
// campo está vacío.
export function textoPlano(md: string): string {
    return md
        .replace(/&nbsp;/g, ' ')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^\s*([-*+]|\d+[.)])\s+/gm, '')
        .replace(/(\*\*\*|\*\*|\*|___|__|_)(\S(?:.*?\S)?)\1/g, '$2')
        .replace(/\s*\n+\s*/g, ' ')
        .trim()
}
