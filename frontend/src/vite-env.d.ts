/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_DEMO_MODE?: string
  readonly VITE_BASE_PATH?: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface AppRuntimeConfig {
  apiBaseUrl?: string
  siteUrl?: string
  demoMode?: boolean | string
}

interface Window {
  __APP_CONFIG__?: AppRuntimeConfig
}
