export type AppRuntimeConfig = {
  apiBaseUrl?: string
  siteUrl?: string
  demoMode?: boolean | string
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppRuntimeConfig
  }
}

function trimSlash(value: string): string {
  return value.replace(/\/$/, '')
}

function readRuntime(): AppRuntimeConfig {
  if (typeof window === 'undefined') return {}
  return window.__APP_CONFIG__ || {}
}

/** API origin used by axios (empty = same-origin / Vite proxy). */
export function getApiBaseUrl(): string {
  const runtime = readRuntime().apiBaseUrl
  if (runtime != null && runtime !== '') return trimSlash(runtime)
  const env = import.meta.env.VITE_API_BASE_URL
  if (env != null && env !== '') return trimSlash(env)
  return ''
}

/**
 * Canonical public website origin for SEO / absolute links.
 * Prefer runtime SITE_URL, then VITE_SITE_URL, then current browser origin.
 */
export function getSiteUrl(): string {
  const runtime = readRuntime().siteUrl
  if (runtime) return trimSlash(runtime)
  const env = import.meta.env.VITE_SITE_URL
  if (env) return trimSlash(env)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimSlash(window.location.origin)
  }
  return ''
}

export function isDemoMode(): boolean {
  const runtime = readRuntime().demoMode
  if (runtime === true || runtime === 'true' || runtime === '1') return true
  if (runtime === false || runtime === 'false' || runtime === '0') return false
  const env = import.meta.env.VITE_DEMO_MODE
  return env === 'true' || env === '1'
}

export function getEnvironmentLabel(): 'local' | 'demo' | 'production' {
  if (isDemoMode()) return 'demo'
  const api = getApiBaseUrl()
  if (!api || api.includes('localhost') || api.includes('127.0.0.1')) return 'local'
  return 'production'
}
