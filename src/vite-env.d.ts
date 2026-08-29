/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MALHA_URL?: string
  readonly VITE_MIND_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
