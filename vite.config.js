import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Content-Security-Policy del build de producción: el navegador solo ejecuta
// scripts propios y solo habla con la API. Si alguien lograra inyectar HTML,
// no podría cargar scripts de otro sitio ni mandar el token a otro servidor.
// (En desarrollo no se aplica: Vite necesita scripts inline para recargar.)
function politicaDeSeguridad(apiUrl) {
  let api = ''
  try {
    api = new URL(apiUrl).origin
  } catch {
    // URL relativa (ej. "/api"): la API está en el mismo origen, ya cubierto por 'self'.
  }

  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    // TipTap inserta sus estilos en un <style>; Google Fonts sirve el CSS de las fuentes.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Las imágenes de las tarjetas se muestran como blob: (se descargan con el token).
    "img-src 'self' data: blob:",
    `connect-src 'self' ${api}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'politica-de-seguridad',
    apply: 'build',
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: csp }, injectTo: 'head-prepend' }]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), politicaDeSeguridad(process.env.VITE_API_URL ?? env.VITE_API_URL)],
  }
})
