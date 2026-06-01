/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGIN_URL: string
  readonly VITE_REGISTRO_URL: string
  readonly VITE_HOME_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}