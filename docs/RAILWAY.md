# Deploying Amit Traders India (Local + Railway)

Yes — **Railway can host the full stack**: PostgreSQL + Spring Boot API + React frontend as three services in one project.

```text
Browser  →  web (Caddy / Vite build)  →  api (Spring Boot)  →  Postgres (Railway DB)
                 SITE_URL                     CORS_ORIGINS
                 API_BASE_URL ───────────────► public URL
```

---

## How the database is configured on Railway

1. In your Railway project click **New → Database → PostgreSQL**.
2. Railway creates a Postgres service and injects variables such as:
   - `DATABASE_URL` = `postgresql://user:pass@host:port/railway`
   - (also `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`)
3. **Reference those variables from the API service** (Railway variable references / shared variables):
   - Easiest: set `DATABASE_URL=${{Postgres.DATABASE_URL}}` on the **api** service  
     (name may be `Postgres` / `PostgreSQL` depending on your project).
4. This app **auto-converts** `postgres://` / `postgresql://` → JDBC  
   `jdbc:postgresql://host:port/db` via `DatabaseUrlEnvironmentPostProcessor`.
5. Schema is created/updated on boot with `JPA_DDL_AUTO=update` (default).  
   First boot with `SEED_DATA=true` loads SAMPLE catalogue + admin user.

**Where does data live?** On Railway’s managed Postgres volume for that database service — not in the Git repo, not on GitHub Pages.

**Uploads:** mount a Railway **Volume** on the API service at `/data/uploads` (see env below). Without a volume, uploaded files are lost on redeploy.

---

## Recommended Railway project layout

| Service | Root Directory | What it runs |
| --- | --- | --- |
| `Postgres` | — | Managed PostgreSQL |
| `api` | `backend` | Spring Boot JAR (Dockerfile) |
| `web` | `frontend` | Caddy serving Vite `dist` (Dockerfile) |

Generate public domains for `api` and `web` (Railway → Settings → Networking → Generate Domain).

---

## Environment variables

### `api` service

| Variable | Value / notes |
| --- | --- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | Long random string (≥ 32 chars) |
| `CORS_ORIGINS` | `https://YOUR-WEB.up.railway.app` (comma-separate if multiple) |
| `SEED_DATA` | `true` on first deploy, then ideally `false` |
| `JPA_DDL_AUTO` | `update` |
| `FILE_STORAGE_PATH` | `/data/uploads` |
| `PORT` | Set automatically by Railway |

Optional explicit JDBC (if you prefer not to use `DATABASE_URL`):

- `DB_URL=jdbc:postgresql://...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`

### `web` service (runtime — preferred)

| Variable | Value / notes |
| --- | --- |
| `API_BASE_URL` | `https://YOUR-API.up.railway.app` |
| `SITE_URL` | `https://YOUR-WEB.up.railway.app` |
| `DEMO_MODE` | `false` |
| `PORT` | Automatic |

`docker-entrypoint.sh` writes `runtime-config.js` on container start, so you can change API/site URLs **without rebuilding** the frontend image.

---

## Step-by-step: publish on Railway

1. Push this branch / merge to GitHub.
2. Create a project at [railway.app](https://railway.app) → **Deploy from GitHub repo**.
3. Add **PostgreSQL**.
4. Add service **api**
   - Root Directory: `backend`
   - Builder: Dockerfile
   - Add env vars above + volume `/data/uploads`
   - Generate domain
5. Add service **web**
   - Root Directory: `frontend`
   - Builder: Dockerfile
   - Set `API_BASE_URL` / `SITE_URL` to the public domains
   - Generate domain
6. Open the **web** URL — public site + admin at `/admin/login`.
7. Default seed admin: `admin@amittraders.com` / `Admin@12345` → **change immediately**.

Custom domains: Railway → service → Settings → Domains → add `www.yourbrand.com`, then update `SITE_URL` + `CORS_ORIGINS` + `API_BASE_URL` accordingly.

---

## Local development (environment-aware)

### 1. Database
```bash
# Docker
docker compose up -d db

# Or local Postgres with DB leather_db / user leather
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # edit secrets if needed
./mvnw spring-boot:run
# → http://localhost:8080/api/health
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
# → http://localhost:5173
```

`frontend/.env.development` leaves `VITE_API_BASE_URL` empty so Vite **proxies** `/api` and `/uploads` to `localhost:8080`.

SEO / canonical URLs use:
1. Runtime `SITE_URL` (Railway)
2. Else `VITE_SITE_URL`
3. Else `window.location.origin` (works on localhost and custom domains)

---

## Environment matrix

| Where | Frontend URL | API URL | DB |
| --- | --- | --- | --- |
| Local | `http://localhost:5173` | Vite proxy → `:8080` | Local / Compose Postgres |
| GitHub Pages | `https://itsumeet27.github.io/amit-traders-india/` | none (demo JSON) | none |
| Railway | `https://*.up.railway.app` or custom | Railway API domain | Railway Postgres |

---

## After go-live checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Change admin password
- [ ] Set `SEED_DATA=false` after first successful seed (or keep true only while empty)
- [ ] Attach volume for uploads
- [ ] Point `CORS_ORIGINS` / `SITE_URL` / `API_BASE_URL` at production domains
- [ ] Replace SAMPLE company content in Admin → Company Profile
