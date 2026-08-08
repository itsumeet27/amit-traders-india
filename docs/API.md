# API Reference (summary)

Base URL: `http://localhost:8080`

## Public

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | `{ email, password }` → JWT |
| POST | `/api/auth/logout` | Client-side token clear |
| GET | `/api/products` | Query: `page`, `size`, `category`, `featured`, `search` |
| GET | `/api/products/{slugOrId}` | Product detail |
| GET | `/api/categories` | Active categories |
| GET | `/api/categories/{slug}` | Category detail |
| GET | `/api/clients` | Active clients |
| GET | `/api/company-profile` | Editable website content |
| POST | `/api/enquiries` | JSON or multipart (`enquiry` + `attachment`); quantity ≥ 50 |

## Admin (`Authorization: Bearer <token>`)

| Method | Path |
| --- | --- |
| GET | `/api/admin/dashboard/stats` |
| CRUD | `/api/admin/products` (+ `PUT .../images`) |
| CRUD | `/api/admin/categories` (+ `PUT .../reorder`) |
| CRUD | `/api/admin/clients` (+ reorder) |
| GET/PUT | `/api/admin/company-profile` |
| GET/PATCH/DELETE | `/api/admin/enquiries` (`PATCH .../status`) |
| GET/POST/DELETE | `/api/admin/media` (`POST .../upload`) |
| POST | `/api/admin/upload` |

Enquiry statuses: `NEW`, `CONTACTED`, `IN_PROGRESS`, `QUOTED`, `CONVERTED`, `CLOSED`, `REJECTED`
