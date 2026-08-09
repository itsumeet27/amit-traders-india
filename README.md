# Amit Traders India — Premium Genuine Leather Website

Full-stack B2B website and CMS for a Mumbai-based genuine leather manufacturer.

**Positioning:** Product discovery → custom requirement → bulk enquiry → quotation  
(No shopping cart or online payments.)

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router |
| Backend | Java 21, Spring Boot 4, Spring Security, JWT, Spring Data JPA |
| Database | PostgreSQL 16 |
| Admin | Embedded CMS at `/admin` |

## Project structure

```text
├── frontend/          # Public website + admin panel
├── backend/           # Spring Boot REST API
├── docker-compose.yml # PostgreSQL + optional full stack
└── README.md
```

## Quick start (local)

### 1. Database

```bash
# Create DB user/database (example)
createuser leather
createdb -O leather leather_db
# password: set to match backend/.env.example
```

Or with Docker:

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # adjust DB_* and JWT_SECRET
./mvnw spring-boot:run
```

API: `http://localhost:8080`  
Health: `GET /api/health`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Website: `http://localhost:5173`  
Admin: `http://localhost:5173/admin/login`

Vite proxies `/api` and `/uploads` to the backend in development.

## Default admin (SAMPLE seed)

When `SEED_DATA=true` and the admin table is empty:

| Field | Value |
| --- | --- |
| Email | `admin@amittraders.com` |
| Password | `Admin@12345` |

Seed also loads sample categories, products, clients, company profile, and enquiries — all marked **[SAMPLE]** so they can be replaced with real content.

## Environment variables

### Backend (`backend/.env.example`)

- `DB_URL` — JDBC URL  
- `DB_USERNAME` / `DB_PASSWORD`  
- `JWT_SECRET` — long random secret (≥ 32 chars)  
- `JWT_EXPIRATION_MS` — token lifetime (default 86400000)  
- `FILE_STORAGE_PATH` — local upload directory  
- `FILE_STORAGE_URL` — public URL prefix (`/uploads`)  
- `CORS_ORIGINS` — comma-separated frontend origins  
- `SEED_DATA` — `true`/`false`

### Frontend (`frontend/.env.example`)

- `VITE_API_BASE_URL` — API origin (empty in Vite dev when using proxy; set for production builds)

## Key business rules

- Minimum enquiry / MOQ quantity: **50 units** (validated on frontend and backend)
- Public content (products, categories, clients, company profile) is API-driven — not hardcoded
- Admin APIs require JWT (`Authorization: Bearer <token>`)
- File uploads validated for type and size (max 10MB)

## Public routes

- `/` Home  
- `/about` Company profile  
- `/products` Catalogue  
- `/products/:slug` Product detail  
- `/custom-manufacturing` Custom manufacturing  
- `/clients` Client showcase  
- `/contact` Contact  
- `/quote` Request a quote  

## Admin routes

- `/admin/login`  
- `/admin` Dashboard  
- `/admin/products` Product management  
- `/admin/categories` Category management  
- `/admin/clients` Client management  
- `/admin/company-profile` Editable website content  
- `/admin/enquiries` Enquiry inbox  
- `/admin/media` Media library  
- `/admin/settings`  

## API overview

Public:

- `GET /api/products`, `GET /api/products/{slugOrId}`  
- `GET /api/categories`, `GET /api/clients`, `GET /api/company-profile`  
- `POST /api/enquiries` (JSON or multipart with attachment)  
- `POST /api/auth/login`  

Admin (`/api/admin/**`):

- Dashboard stats, CRUD for products/categories/clients  
- Company profile update  
- Enquiry list/filter/status/delete  
- Media upload/list/delete  

## Deploy free (recommended): GitHub Pages + Render + Neon

See **[docs/FREE_DEPLOY.md](docs/FREE_DEPLOY.md)**.

```text
GitHub Pages (frontend)  →  Render free API  →  Neon free Postgres
```

1. Create Neon DB → copy `DATABASE_URL`  
2. Deploy `backend` on Render (Docker, free) with CORS for `https://amittradersindia.com` (and www / github.io as needed)  
3. Set GitHub Actions variable `VITE_API_BASE_URL` to the Render URL  
4. Point GoDaddy DNS at GitHub Pages and set custom domain `amittradersindia.com` in Pages settings  
5. Re-run **Deploy frontend to GitHub Pages**  

The Pages build uses **hybrid mode**: live API when awake, SAMPLE demo fallback when Render is sleeping.

## Deploy to Railway (optional paid/credits)

See **[docs/RAILWAY.md](docs/RAILWAY.md)** if you later move off free tiers.

## Docker Compose

```bash
docker compose up --build
```

Services: PostgreSQL (`5432`), API (`8080`), frontend (`5173` or nginx on `80` depending on compose profile).

## Security notes

- Passwords are BCrypt-hashed  
- JWT auth for admin endpoints  
- CORS restricted via `CORS_ORIGINS`  
- Never commit real secrets — use `.env` (gitignored)  
- Replace the default admin password immediately in production  

## License / ownership

Built for **Amit Traders India** sample demonstration. Replace SAMPLE content with production company data before go-live.
