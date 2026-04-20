# Loan Discovery Backend

The canonical project documentation now lives in [../README.md](../README.md). This file keeps the backend-specific run notes in one place.

## Local MySQL Run

This backend is configured to use MySQL only. It does not include an H2 fallback.

Before starting the app, set these environment variables in the same PowerShell session:

- `DB_URL` - example: `jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- `DB_USERNAME` - your MySQL user, for example `root`
- `DB_PASSWORD` - your MySQL password
- `JWT_SECRET` - a long random secret used to sign tokens
- `JWT_EXPIRATION_MS` - optional, defaults to `86400000`
- `ADMIN_EMAIL` - optional, defaults to `admin@loandiscovery.local`

Example PowerShell session:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = 'your-mysql-password'
$env:JWT_SECRET = 'replace-with-a-long-random-secret'
$env:ADMIN_EMAIL = 'admin@loandiscovery.local'
Set-Location 'C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application\backend'
\.\mvnw.cmd spring-boot:run
```

If you want to keep the values outside the terminal, create a PowerShell profile or a private `.env` loading step in your editor/terminal setup. Do not commit real credentials.

## Build Check

```powershell
Set-Location 'C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application\backend'
\.\mvnw.cmd -q -DskipTests compile
```

## Render Deployment

Render can run this backend as a Java web service using [../render.yaml](../render.yaml).

Use these environment variables in Render:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `ADMIN_EMAIL`
- `APP_CORS_ALLOWED_ORIGINS`

The backend listens on Render’s `PORT` automatically through `backend/src/main/resources/application.properties`.