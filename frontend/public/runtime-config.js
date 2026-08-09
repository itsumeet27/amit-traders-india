// Default runtime config for local / static hosts.
// On Railway, docker-entrypoint.sh overwrites this file from environment variables.
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {
  apiBaseUrl: '',
  siteUrl: '',
  demoMode: false,
}
