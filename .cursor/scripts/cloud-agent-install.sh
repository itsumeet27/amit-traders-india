#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f backend/.env ]]; then
  cp backend/.env.example backend/.env
  sed -i 's/your_secure_password/leather_dev_pass/' backend/.env
  sed -i 's/replace-with-a-long-random-secret-at-least-32-characters/dev-jwt-secret-at-least-32-characters-long/' backend/.env
fi

if [[ ! -f frontend/.env ]]; then
  cp frontend/.env.example frontend/.env
fi

mkdir -p backend/uploads

cd "$ROOT/frontend"
npm ci

cd "$ROOT/backend"
./mvnw -q -DskipTests dependency:resolve dependency:resolve-plugins

echo "Install complete."
