# Jobify

A full-stack job board application where admins manage job postings and users browse and apply for jobs.

## Features

**Admin**
- Login
- Create, update, and delete job posts
- View all job posts and search by company
- View applicants per job post

**User**
- Sign up / sign in
- Browse available jobs
- Apply to jobs and track applied jobs

## Tech Stack

| Layer   | Technology |
|---------|------------|
| Client  | React 18, Vite 5, React Router v6, Tailwind CSS |
| Server  | Node.js, Express 4 |
| Database| MySQL (mysql2/promise) |
| Auth    | JWT (jsonwebtoken) |

## Project Structure

```
jobify-final/
├── client/          # React + Vite frontend
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── components/
└── server/          # Express REST API
    ├── app.js       # Routes + schema bootstrap + server start
    ├── authmiddleware.js
    └── db/
        ├── index.js # MySQL connection pool
        └── utils.js # Query helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### 1. Configure environment variables

Create a `.env` file inside `server/`. See [env.md](./env.md) for the full list of variables.

```env
PORT=8080
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_db_user
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=jobify
JWT_SECRET=generate_a_long_random_secret
```

> **Never commit your `.env` file or real secrets to git.** Generate a strong JWT secret, e.g.:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### 2. Run the server

```bash
cd server
npm install
node app.js
```

The API starts on `http://localhost:8080` and auto-creates the required tables on boot.

### 3. Run the client

```bash
cd client
npm install
npm run dev
```

The app starts on `http://localhost:5173` (default Vite port).

## API Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/admin/login` | Public | Admin login |
| POST | `/user/signup` | Public | User registration |
| POST | `/user/login` | Public | User login |
| POST | `/job` | Admin | Create a job post |
| GET | `/jobs` | Public | List all job posts |
| GET | `/job/:jobId` | Public | Get a single job post |
| PUT | `/job/:jobId` | Admin | Update a job post |
| DELETE | `/job/:jobId` | Admin | Delete a job post |
| GET | `/jobs/company/:companyName` | Public | Search jobs by company |
| POST | `/user/apply-for-job` | User | Apply to a job |
| GET | `/user/jobs/applied` | User | List jobs the user applied to |
| GET | `/job/:jobId/applicants` | Admin | List applicants for a job |

## Known Issues & Roadmap

This project is under active cleanup. Tracked improvements include:

- Role-based authorization enforcement in JWT middleware
- Password hashing (bcrypt)
- Security hardening (helmet, rate limiting, strict CORS)
- Input validation, central error handling, and consistent API responses
- Pagination, duplicate-application prevention, and application status tracking

## License

ISC
