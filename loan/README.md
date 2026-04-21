# Loan Discovery Web Application

The canonical project documentation now lives in [../README.md](../README.md). This file keeps the frontend-specific notes that are useful when working inside the React app directly.

Loan Discovery is a full-stack loan discovery and comparison app. The frontend is a React/Vite experience with a premium fintech UI, while the backend is a Spring Boot 3.2.5 API with MySQL, Spring Security, JWT, and JPA persistence.

## What This App Does

- Lets users register and log in with JWT authentication.
- Saves and reloads personal and loan profile data.
- Persists and deletes saved loan comparisons.
- Calculates EMI and loan eligibility.
- Recommends banks based on profile and loan fit.
- Looks up IFSC and bank branch data.
- Shows live global market hotspots and admin analytics.

## Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS, Framer Motion, Lucide, Recharts, Three.js.
- Backend: Spring Boot 3.2.5, Java 21, Spring Web, Spring Data JPA, Spring Security, Validation, JWT, MySQL Connector.
- Tooling: PowerShell on Windows, Maven wrapper, ESLint, Vite build pipeline.

## Repository Layout

- [loan/](loan/) - React frontend.
- [backend/](backend/) - Spring Boot API and persistence layer.
- [tools/](tools/) - helper scripts.

## Frontend Routes

- `/` - landing page.
- `/login` - login screen.
- `/signup` - registration screen.
- `/dashboard` - protected app dashboard.

## Frontend Features

- Premium landing page with animated hero and interactive rates sections.
- Protected dashboard with tabs for profile, loan profile, eligibility, EMI, comparison, recommendations, IFSC lookup, and admin stats.
- Client-side auth session handling with browser storage.
- Light and dark theme support.
- Reusable UI primitives for cards, alerts, tables, buttons, forms, loaders, and empty states.

## Backend Features

- JWT register/login flow.
- Profile save/load APIs.
- Saved comparison persistence.
- Admin analytics endpoint.
- IFSC and bank lookup endpoints.
- Global market hotspot endpoint.

## API Surface

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Profile

- `GET /api/profile/me`
- `PUT /api/profile/personal`
- `PUT /api/profile/loan`

### Comparisons

- `GET /api/comparisons`
- `POST /api/comparisons`
- `DELETE /api/comparisons/{id}`

### Admin

- `GET /api/admin/stats`

### Bank and IFSC

- `GET /api/ifsc/{code}`
- `GET /api/banks/search?q=...`
- `GET /api/banks/by-city?city=...`
- `GET /api/banks/names`

### Market Data

- `GET /api/global-market/hotspots`

## Environment Variables

### Backend

- `SPRING_DATASOURCE_URL` - MySQL JDBC URL. Default: `jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`.
- `SPRING_DATASOURCE_USERNAME` - MySQL username.
- `SPRING_DATASOURCE_PASSWORD` - MySQL password.
- `JWT_SECRET` - JWT signing secret.
- `JWT_EXPIRATION_MS` - token lifetime in milliseconds. Default: `86400000`.
- `ADMIN_EMAIL` - backend admin email. Default: `admin@loandiscovery.local`.

Legacy `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` are still accepted for local backward compatibility.

### Frontend

- `VITE_API_BASE_URL` - backend API base URL. Default: `http://localhost:8080/api`.
- `VITE_ADMIN_EMAIL` - admin email used to reveal the admin tab in the UI. Default: `admin@loandiscovery.local`.

## Local Setup

### Backend

Open a PowerShell terminal in [backend/](backend/) and set the environment variables before starting Spring Boot.

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME="<your-mysql-user>"
$env:SPRING_DATASOURCE_PASSWORD="<your-mysql-password>"
$env:JWT_SECRET="<long-random-secret>"
$env:ADMIN_EMAIL="hardik.bhalekar10@gmail.com"
.\mvnw.cmd spring-boot:run
```

If port `8080` is already in use, set `PORT` before running:

```powershell
$env:PORT="8081"
.\mvnw.cmd spring-boot:run
```

### Frontend

From [loan/](loan/):

```bash
npm install
npm run dev
```

To verify the production bundle:

```bash
npm run build
```

## Important Notes

- The backend is MySQL-only. Do not switch it to H2.
- The dashboard is protected client-side and redirects to `/login` when the session is missing.
- Admin UI visibility is controlled by the admin email in the frontend environment.
- Auth tokens and user info are persisted in browser storage.

## Verified Locally

- Backend compile: `backend/.\mvnw.cmd -q -DskipTests compile`
- Frontend build: `npm run build`

## Development Tips

- Keep `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` aligned with the local MySQL instance.
- Keep `VITE_API_BASE_URL` pointed at the backend API when running the frontend locally.
- If protected routes bounce back to login, clear browser storage and sign in again.
- If the admin tab does not appear, confirm the authenticated user email matches `VITE_ADMIN_EMAIL`.
