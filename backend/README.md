# Loan Discovery Backend

The canonical project documentation now lives in [../README.md](../README.md). This file keeps the backend-specific run notes in one place.

## Local MySQL Run

This backend is configured to use MySQL only. It does not include an H2 fallback.

Before starting the app, either fill in `backend/.env` or set these environment variables in the same PowerShell session:

- `SPRING_DATASOURCE_URL` - example: `jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- `SPRING_DATASOURCE_USERNAME` - your MySQL user, for example `root`
- `SPRING_DATASOURCE_PASSWORD` - your MySQL password
- `JWT_SECRET` - a long random secret used to sign tokens
- `JWT_EXPIRATION_MS` - optional, defaults to `86400000`
- `ADMIN_EMAIL` - optional, defaults to `admin@loandiscovery.local`

Note: The app also accepts legacy `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` names for local backward compatibility.

Example PowerShell session:

```powershell
$env:SPRING_DATASOURCE_URL = 'jdbc:mysql://localhost:3306/loan_discovery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
$env:SPRING_DATASOURCE_USERNAME = 'root'
$env:SPRING_DATASOURCE_PASSWORD = 'your-mysql-password'
$env:JWT_SECRET = 'replace-with-a-long-random-secret'
$env:ADMIN_EMAIL = 'admin@loandiscovery.local'
Set-Location 'C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application\backend'
.\mvnw.cmd spring-boot:run
```

If port `8080` is already in use, either stop the existing backend instance or run this one on another port:

```powershell
$env:PORT = '8081'
.\mvnw.cmd spring-boot:run
```

Quick checks:

```powershell
# Find process currently listening on 8080
Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess

# Stop a process by PID (replace 12345)
Stop-Process -Id 12345 -Force
```

This project now supports a local `backend/.env` file automatically through Spring config import. Keep real credentials only in that private file and out of git.

## Build Check

```powershell
Set-Location 'C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application\backend'
\.\mvnw.cmd -q -DskipTests compile
```

## Render Deployment

Render can run this backend as a Java web service using [../render.yaml](../render.yaml).

Production backend URL: `https://loan-discovery-app.onrender.com`
Production frontend URL: `https://loan-discovery-app.vercel.app/`

Use these environment variables in Render:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `ADMIN_EMAIL`
- `APP_CORS_ALLOWED_ORIGINS`

The backend listens on Render’s `PORT` automatically through `backend/src/main/resources/application.properties`.
Render does not read `backend/.env`, so copy the real values into the Render service environment settings.
For the current production setup, include `https://loan-discovery-app.vercel.app` in `APP_CORS_ALLOWED_ORIGINS`.
