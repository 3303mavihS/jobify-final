# Environment Variables

All server configuration is read from a `.env` file located in `server/`.
**Never commit this file to git** — add `.env` to `.gitignore` and share only this documentation (or a placeholder `.env.example`).

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the Express server listens on | `8080` |
| `MYSQL_HOST` | MySQL server hostname | `localhost` |
| `MYSQL_PORT` | MySQL server port | `3306` |
| `MYSQL_USER` | MySQL username | `root` |
| `MYSQL_PASSWORD` | MySQL password | `your_db_password` |
| `MYSQL_DATABASE` | Database name (tables are auto-created on boot) | `jobify` |
| `JWT_SECRET` | Secret used to sign JWT auth tokens | *(see below)* |

## Example `.env`

Copy `server/.env.example` to `server/.env` and fill in your values:

```env
PORT=8080
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=jobify
JWT_SECRET=replace_with_a_long_random_string
```

## Generating a strong JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Use a unique secret per environment (dev / staging / prod) and rotate it immediately if it is ever exposed.

## Notes

- The server currently **fails silently or misbehaves** if any variable is missing — startup validation for required env vars is a planned fix.
- The client has no env configuration yet; the API base URL (`http://localhost:8080`) is hardcoded in the components. Introducing a `VITE_API_URL` variable is a planned improvement.

## Secret Rotation Log

| Date | Secret | Status | Details |
|------|--------|--------|---------|
| 2026-11-09 | Old `JWT_SECRET` ending in `…c0ddb` (previously committed in `README.md`, commit `9a275b8`) | 🔴 **COMPROMISED — ROTATED** | Was publicly exposed on GitHub. Replaced with a new 96-char hex secret in `server/.env`. Do **not** reuse anywhere. Any tokens signed with the old secret are now invalid — all users must log in again. |
| 2026-11-09 | New `JWT_SECRET` | 🟢 Active | Stored only in local `server/.env`, now covered by root `.gitignore`. |
