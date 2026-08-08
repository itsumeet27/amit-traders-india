#!/bin/sh
set -eu

CONFIG_FILE="/app/dist/runtime-config.js"
API_BASE_URL="${API_BASE_URL:-${VITE_API_BASE_URL:-}}"
SITE_URL="${SITE_URL:-${VITE_SITE_URL:-}}"
DEMO_MODE="${DEMO_MODE:-${VITE_DEMO_MODE:-false}}"

# Escape values for JS string literals
js_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat > "$CONFIG_FILE" <<EOF
window.__APP_CONFIG__ = {
  apiBaseUrl: "$(js_escape "$API_BASE_URL")",
  siteUrl: "$(js_escape "$SITE_URL")",
  demoMode: $( [ "$DEMO_MODE" = "true" ] || [ "$DEMO_MODE" = "1" ] && echo true || echo false )
};
EOF

echo "Wrote runtime-config.js (apiBaseUrl=${API_BASE_URL:-<empty>} siteUrl=${SITE_URL:-<empty>} demoMode=${DEMO_MODE})"
exec caddy run --config /app/Caddyfile --adapter caddyfile
