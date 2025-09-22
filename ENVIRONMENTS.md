# Environment Usage Guide (Local and Development)

This project uses environment files for two active modes:
- Local: run on your laptop, API and apps on `localhost`
- Development (server): run on your server, API/apps via your server IP `62.72.12.199`

Vite (frontend/admin) and Node (backend) read env files by mode with a clear precedence.

## Precedence and Files

### Backend (Node/Express)
Loaded in this order (later wins):
1) `.env`
2) `.env.<NODE_ENV>`
3) `.env.local` (only when `NODE_ENV !== 'production'`)

Important vars:
- `FRONTEND_URL` and `ADMIN_URL`: primary CORS origins (exact)
- `ALLOWED_ORIGINS`: optional, comma-separated list of additional allowed origins

Active files:
- `backend/.env.local` (Local)
  - `FRONTEND_URL=http://localhost:5173`
  - `ADMIN_URL=http://localhost:5174`
  - `ALLOWED_ORIGINS=http://62.72.12.199:5173,http://62.72.12.199:5174`
- `backend/.env.development` (Server Development)
  - `FRONTEND_URL=http://62.72.12.199:5173`
  - `ADMIN_URL=http://62.72.12.199:5174`
  - `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174`

### Frontend/Admin (Vite)
Loaded in this order per mode (later wins):
- Base: `.env`
- Mode-specific: `.env.development` or `.env.production`
- Local overrides: `.env.development.local` (development-only; not committed)

Important var:
- `VITE_API_BASE_URL`

Active files:
- Frontend:
  - `frontend/.env.development.local` (Local): `VITE_API_BASE_URL=http://localhost:3001/api`
  - `frontend/.env.development` (Server Dev): `VITE_API_BASE_URL=http://62.72.12.199:3001/api`
  - `frontend/.env.production` (Prod): `VITE_API_BASE_URL=http://62.72.12.199:3001/api`
- Admin Portal:
  - `admin-portal/.env.development.local` (Local): `VITE_API_BASE_URL=http://localhost:3001/api`
  - `admin-portal/.env.development` (Server Dev): `VITE_API_BASE_URL=http://62.72.12.199:3001/api`
  - `admin-portal/.env.production` (Prod): `VITE_API_BASE_URL=http://62.72.12.199:3001/api`

Note: `.env.local` files were intentionally removed from Vite apps to avoid accidental overrides in production builds.

## How to Run

### Local (Laptop)
- Backend (development; allows localhost origins)
```powershell
cd backend
pm2 start pm2.config.cjs --env development
```
- Frontend (dev server; localhost API)
```powershell
cd frontend
npm run dev
```
- Admin (dev server; localhost API)
```powershell
cd admin-portal
npm run dev
```

### Development (Server at 62.72.12.199)
- Backend (development; IP-based CORS)
```bash
cd backend
pm2 start pm2.config.cjs --env development
```
- Frontend (build with development mode; embeds IP API)
```bash
cd frontend
npm ci
npm run build:dev
npm run pm2:start
```
- Admin (build with development mode; embeds IP API)
```bash
cd admin-portal
npm ci
npm run build:dev
npm run pm2:start
```

Re-applying env changes:
```bash
# Backend: after changing backend .env files
cd backend && npm run pm2:restart

# Clients: after changing API URL envs
cd frontend && npm run build:dev && npm run pm2:restart
cd admin-portal && npm run build:dev && npm run pm2:restart
```

## Verification
- Backend health: `http://62.72.12.199:3001/health`
- Frontend: `http://62.72.12.199:5173`
- Admin: `http://62.72.12.199:5174`
- Browser DevTools → Network → confirm requests go to `http://62.72.12.199:3001/api/...`

## Tips
- Do not create `.env.development.local` on the server (that file sets localhost API and is for local development only).
- To switch the backend between environments via PM2:
```bash
pm2 restart pm2.config.cjs --env development
pm2 restart pm2.config.cjs --env production
```
- If ports are busy (EADDRINUSE), stop old processes: `pm2 delete all` and start again.
