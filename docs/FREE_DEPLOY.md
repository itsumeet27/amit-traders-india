# Free end-to-end deploy (GitHub Pages + Render + Neon)

This is the recommended **$0** path for this project.

```text
https://itsumeet27.github.io/amit-traders-india/
        │
        │  VITE_API_BASE_URL / runtime-config
        ▼
https://<your-api>.onrender.com   (Spring Boot on Render free)
        │
        │  DATABASE_URL
        ▼
Neon Postgres (free)
```

**Seamless behaviour:** the GitHub Pages build points at your Render API and keeps **demo fallback** enabled. When Render is awake, live data/enquiries are used. When the free API is sleeping or unreachable, the public site still shows SAMPLE catalogue data instead of a blank error page. Admin CMS needs the API awake.

---

## 1. Neon (database) — free

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a project (region close to Render, e.g. US Oregon / AWS us-west)
3. Copy the connection string. It looks like:

```text
postgresql://USER:PASSWORD@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

4. Keep it handy for Render as `DATABASE_URL`

This app auto-converts that URL to JDBC. **Do not** strip `?sslmode=require`.

---

## 2. Render (backend API) — free

1. Sign up at [https://render.com](https://render.com) and connect GitHub
2. **New → Web Service** → select `amit-traders-india`
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Instance type:** Free
   - **Health check path:** `/api/health`
4. Environment variables:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Neon connection string (with `sslmode=require`) |
| `JWT_SECRET` | long random string (≥ 32 chars) |
| `CORS_ORIGINS` | `https://itsumeet27.github.io,http://localhost:5173` |
| `SEED_DATA` | `true` (first deploy) |
| `JPA_DDL_AUTO` | `update` |
| `FILE_STORAGE_PATH` | `/tmp/uploads` |
| `JAVA_TOOL_OPTIONS` | `-XX:MaxRAMPercentage=75.0 -Xms128m` |

5. Deploy → note the URL, e.g. `https://leather-api-xxxx.onrender.com`
6. Test: `https://leather-api-xxxx.onrender.com/api/health`  
   First hit after idle may take **30–60s** (free tier cold start).

Optional: Blueprint deploy via root `render.yaml` (still paste `DATABASE_URL` manually).

**Uploads on free Render:** disk is ephemeral. Seed product images use remote Unsplash URLs so the catalogue still looks fine. File uploads from enquiries/admin may disappear after restart — upgrade later or move files to object storage.

---

## 3. GitHub Pages (frontend) — already live

Site: **https://itsumeet27.github.io/amit-traders-india/**

### Connect Pages → Render (seamless)

1. GitHub repo → **Settings → Secrets and variables → Actions → Variables**
2. Create variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://leather-api-xxxx.onrender.com` *(no trailing slash)*
3. Run workflow **Deploy frontend to GitHub Pages** (Actions → Run workflow),  
   or push to a watched branch. The workflow:
   - Builds with `/amit-traders-india/` base path
   - Bakes API URL + site URL into the bundle / `runtime-config.js`
   - Enables demo **fallback** for Render sleep
   - Publishes to the `gh-pages` branch (matches your current Pages setting)

After deploy, open the site: products/enquiries should hit Render when it’s up.

### CORS must allow Pages

On Render, `CORS_ORIGINS` must include:

```text
https://itsumeet27.github.io
```

(Already the default in `render.yaml` / docs.)

---

## 4. Local development (unchanged)

```bash
docker compose up -d db
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev
```

Frontend uses Vite proxy locally; no Render required.

---

## 5. Admin on the free stack

1. Wake API: open `https://<api>.onrender.com/api/health` and wait until JSON returns
2. Visit `https://itsumeet27.github.io/amit-traders-india/admin/login`
3. Seed login: `admin@amittraders.com` / `Admin@12345` → change ASAP
4. Set `SEED_DATA=false` on Render after the first successful seed (optional)

---

## 6. Optional: keep Render awake

Free services sleep after ~15 minutes idle. To reduce cold starts, ping `/api/health` every 10–14 minutes with [UptimeRobot](https://uptimerobot.com) (free) or a GitHub scheduled workflow. This may consume free-hour quotas — use sparingly.

---

## Checklist

- [ ] Neon DB created; `DATABASE_URL` copied  
- [ ] Render web service deployed; `/api/health` works  
- [ ] `CORS_ORIGINS` includes `https://itsumeet27.github.io`  
- [ ] GitHub variable `VITE_API_BASE_URL` set to Render URL  
- [ ] Pages redeployed; browser Network tab shows calls to Render  
- [ ] Admin password changed  
