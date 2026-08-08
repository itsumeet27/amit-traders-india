#!/usr/bin/env bash
set -euo pipefail

DB_USER="${DB_USERNAME:-leather}"
DB_NAME="${DB_DB:-leather_db}"
DB_PASS="${DB_PASSWORD:-leather_dev_pass}"
PG_PORT="${PGPORT:-5432}"

start_postgres() {
  if pg_isready -h localhost -p "$PG_PORT" -q 2>/dev/null; then
    return 0
  fi

  if command -v pg_ctlcluster >/dev/null 2>&1; then
    sudo pg_ctlcluster 16 main start
  else
    sudo service postgresql start
  fi
}

wait_for_postgres() {
  for _ in $(seq 1 30); do
    if pg_isready -h localhost -p "$PG_PORT" -q 2>/dev/null; then
      return 0
    fi
    sleep 1
  done

  echo "PostgreSQL did not become ready in time" >&2
  return 1
}

ensure_database() {
  sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
SQL
}

start_postgres
wait_for_postgres
ensure_database

echo "PostgreSQL ready (database: ${DB_NAME}, user: ${DB_USER})"
