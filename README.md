# Loan Discovery Web Application

Loan Discovery is a full-stack loan discovery, comparison, and financial planning platform. It combines a React/Vite frontend with a Spring Boot API and MySQL persistence to help users compare loans, estimate eligibility and EMI, save profiles, and review curated banking data.

## Overview

The application is organized as a small monorepo:

- [loan/](loan/) contains the React frontend.
- [backend/](backend/) contains the Spring Boot API and persistence layer.
- [tools/](tools/) contains project utilities and analysis scripts.
- [PROJECT_DEEP_ANALYSIS.txt](PROJECT_DEEP_ANALYSIS.txt) contains a deeper technical snapshot of the repository.

The product currently focuses on four areas:

1. A premium landing experience that introduces the app and drives sign up.
2. Authenticated loan tools such as eligibility, EMI, comparison, recommendations, and IFSC lookup.
3. Persistent user data for profiles and saved comparisons.
4. Admin visibility with analytics and operational status panels.

## Key Features

- JWT-based authentication with register and login flows.
- User profile save/load APIs for personal and loan details.
- Saved comparison management with create, list, and delete operations.
- EMI and affordability tools for loan planning.
- Bank, branch, and IFSC lookup utilities.
- Admin analytics for usage and platform insights.
- Premium, responsive UI with reusable component primitives.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide icons
- Recharts
- Three.js

### Backend

- Spring Boot 3.2.5
- Java 21
- Spring Web
- Spring Security
- Spring Data JPA
- Validation
- JWT
- MySQL Connector

### Tooling

- Maven wrapper for backend builds
- PowerShell on Windows
- ESLint for frontend linting
- Vite production builds

## Repository Structure

```text
Loan-Discovery-Web-Application/
├─ backend/              Spring Boot API, entities, services, repositories, config
├─ loan/                 React frontend, UI components, pages, assets, utilities
├─ tools/                Support scripts and analysis helpers
└─ PROJECT_DEEP_ANALYSIS.txt  Deep project inventory and architecture notes
```

## Frontend Application

The frontend lives in [loan/](loan/) and is built as a premium dashboard-style web app.

### Main Routes

- `/` - marketing and landing page
- `/login` - authentication screen
- `/signup` - registration screen
- `/dashboard` - protected app workspace

### Frontend Capabilities

- Animated landing hero and interactive rates sections.
- Shared UI primitives for cards, buttons, inputs, alerts, tables, and forms.
- Theme-aware layouts with reusable page containers and premium panels.
- Protected dashboard tabs for profile, loan profile, EMI, eligibility, comparisons, recommendations, IFSC lookup, and admin analytics.
- Browser-based session persistence for auth tokens and profile state.

## Backend Application

The backend lives in [backend/](backend/) and exposes the APIs consumed by the frontend.

### Backend Capabilities

- User registration and login with JWT issuance.
- BCrypt password hashing.
- Personal and loan profile persistence.
- Saved comparison storage.
- Admin statistics endpoint.
- Bank, branch, and IFSC lookup APIs.
- Global market hotspot endpoint.

### Backend Notes

- The backend is configured for MySQL only.
- There is no H2 fallback in the intended runtime setup.
- Database credentials and JWT settings are provided through environment variables.

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

## Prerequisites

- Node.js 18+ for the frontend
- Java 21 for the backend
- MySQL 8+ accessible from the backend
- A shell capable of running PowerShell commands on Windows

## Environment Variables

Tracked templates are included at [backend/.env.example](backend/.env.example) and [loan/.env.example](loan/.env.example).

For local development, private `.env` files are also supported at `backend/.env` and `loan/.env`. These files are git-ignored and should contain your real secrets and local URLs.

### Backend

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `SPRING_DATASOURCE_URL` | Yes | MySQL JDBC connection string | `jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | Yes | MySQL username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Yes | MySQL password | `your-password` |
| `JWT_SECRET` | Yes | Secret used to sign JWTs | `replace-with-a-long-random-secret` |
| `JWT_EXPIRATION_MS` | No | Token lifetime in milliseconds | `86400000` |
| `ADMIN_EMAIL` | No | Email used to identify admin access | `hardik.bhalekar10@gmail.com` |

Legacy `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` are still accepted for local backward compatibility.

### Frontend

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | Backend API base URL | `http://localhost:8080/api` |
| `VITE_ADMIN_EMAIL` | No | Email used to reveal admin UI | `hardik.bhalekar10@gmail.com` |

## Local Development

### 1. Start the backend

Open a PowerShell terminal in [backend/](backend/). You can either fill in [backend/.env](backend/.env) or set the variables manually in the terminal.

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your-mysql-password"
$env:JWT_SECRET="replace-with-a-long-random-secret"
$env:ADMIN_EMAIL="hardik.bhalekar10@gmail.com"
Set-Location 'C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application\backend'
.\mvnw.cmd spring-boot:run
```

If port `8080` is already in use, run the backend on another port in that same terminal:

```powershell
$env:PORT="8081"
.\mvnw.cmd spring-boot:run
```

To verify the backend compiles without running it:

```powershell
Set-Location 'C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application\backend'
.\mvnw.cmd -q -DskipTests compile
```

### 2. Start the frontend

Open a separate terminal in [loan/](loan/). Fill in [loan/.env](loan/.env) if you want to override the default local API URL or admin email, then run:

```bash
npm install
npm run dev
```

For a production build check:

```bash
npm run build
```

## Render Deployment

The backend can be deployed to [Render](https://render.com/) as a Java web service.

### What Render Needs

- A web service created from this repository.
- A reachable MySQL database. Render does not provide MySQL natively, so use an external MySQL host.
- The backend environment variables listed above.

### Render Blueprint

This repository includes [render.yaml](render.yaml) for the backend service.

### Render Environment Variables

Set these in the Render service:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS` if you want a custom token lifetime
- `ADMIN_EMAIL`
- `APP_CORS_ALLOWED_ORIGINS` with your frontend URL, for example `https://your-frontend.onrender.com`

Render does not load the repository `.env` files automatically. Copy the real values from your private local `.env` files into the Render dashboard or blueprint environment settings.

### Build And Start Commands

The Render blueprint uses:

- Build: `chmod +x mvnw && ./mvnw clean package -DskipTests`
- Start: `java -jar target/*.jar`

### Important Note

The app now listens on Render’s `PORT` automatically, so no extra port override is needed.

## Verification Status

The following checks have been validated locally during development:

- Backend compile using the Maven wrapper.
- Frontend production build using Vite.

## Development Notes

- Keep `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` aligned with your local MySQL instance.
- Keep `VITE_API_BASE_URL` pointed at the backend when running the frontend locally.
- The dashboard is protected in the UI and redirects to login when the session is missing.
- Auth tokens and user data are stored in browser storage.
- If the admin tab does not appear, confirm the signed-in email matches the admin email configured in the frontend.

## Roadmap

The current implementation roadmap for the app is:

1. JWT authentication.
2. Frontend JWT integration.
3. Profile save/load APIs.
4. Saved comparisons APIs and UI.
5. Admin analytics API and UI.
6. Production hardening.

## Troubleshooting

- If the backend fails to start with a MySQL access denied error, confirm the username and password in `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`.
- If startup fails with `Port 8080 was already in use`, stop the existing Java process on `8080` or run with `PORT=8081`.
- If the frontend cannot reach the API, confirm `VITE_API_BASE_URL` points to the running backend.
- If protected pages bounce back to login, clear browser storage and sign in again.
- If the admin experience is missing, verify the configured admin email in both backend and frontend environments.

## Further Documentation

- [loan/README.md](loan/README.md) for frontend-specific notes.
- [backend/README.md](backend/README.md) for backend-specific setup.
- [PROJECT_DEEP_ANALYSIS.txt](PROJECT_DEEP_ANALYSIS.txt) for the deep project inventory and architecture snapshot.
