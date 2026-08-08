# Free end-to-end deploy (GitHub Pages + Render + Neon)

```text
https://itsumeet27.github.io/amit-traders-india/
        │
        ▼
https://<your-api>.onrender.com   (Spring Boot Docker on Render free)
        │
        ▼
Neon Postgres (free)
```

---

## Fix for “go: go.mod file not found”

That error means Render is using the **Go** runtime instead of **Docker**.

This is a **Java/Spring Boot** app. Recreate or edit the service:

1. **Language / Runtime → `Docker`** (not Go, not Node)
2. **Dockerfile Path:** `./backend/Dockerfile`
3. **Docker Build Context Directory:** `./backend`
4. Clear any **Build Command** / **Start Command** (Docker uses the Dockerfile `ENTRYPOINT`)
5. Instance type: **Free**
6. Health check path: `/api/health`

Then click **Manual Deploy → Clear build cache & deploy**.

---

## 1. Neon (database)

1. [https://neon.tech](https://neon.tech) → create project  
2. Copy connection string (keep `?sslmode=require`):

```text
postgresql://USER:PASSWORD@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## 2. Render (API) — Docker

### Option A — Dashboard (recommended)

1. [https://render.com](https://render.com) → **New → Web Service** → this GitHub repo  
2. Settings:

| Field | Value |
| --- | --- |
| **Language** | **Docker** ← critical |
| **Dockerfile Path** | `./backend/Dockerfile` |
| **Docker Build Context Directory** | `./backend` |
| **Branch** | `cursor/free-deploy-render-neon-7f5b` or `main` after merge |
| **Instance type** | Free |
| **Health check path** | `/api/health` |

3. Environment:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Neon URI with `sslmode=require` |
| `JWT_SECRET` | long random string (recommended ≥ 32 chars, e.g. `openssl rand -base64 48`) |
| `CORS_ORIGINS` | `https://itsumeet27.github.io,http://localhost:5173` |
| `SEED_DATA` | `true` |
| `JPA_DDL_AUTO` | `update` |
| `FILE_STORAGE_PATH` | `/tmp/uploads` |
| `JAVA_TOOL_OPTIONS` | `-XX:MaxRAMPercentage=75.0 -Xms128m` |

4. Deploy → copy URL `https://….onrender.com`  
5. Test `/api/health` (first hit after sleep can take 30–60s)

### Option B — Blueprint

**New → Blueprint** → select repo → uses root `render.yaml` (`runtime: docker`).  
You still must paste `DATABASE_URL` when prompted.

---

## 3. Connect GitHub Pages

1. Repo → **Settings → Secrets and variables → Actions → Variables**  
2. `VITE_API_BASE_URL` = `https://YOUR-SERVICE.onrender.com` (no trailing slash)  
3. Actions → **Deploy frontend to GitHub Pages** → Run workflow  

Hybrid mode: live API when awake, SAMPLE demo fallback when Render sleeps.

---

## 4. Local

```bash
docker compose up -d db
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev
```

---

## Checklist

- [ ] Render **Language = Docker** (not Go)  
- [ ] Dockerfile path `./backend/Dockerfile`, context `./backend`  
- [ ] Neon `DATABASE_URL` set  
- [ ] `CORS_ORIGINS` includes `https://itsumeet27.github.io`  
- [ ] Pages variable `VITE_API_BASE_URL` set + workflow run  
