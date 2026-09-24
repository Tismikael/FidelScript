<br />
<div align="center">
  <h1 align="center">Fidel Learn</h1>
  <p align="center">
    A web app for learning the Fidel (Ethiopic) script, aimed at young Ethiopians in the diaspora
    who want to read and write in their native script.
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api-overview">API Overview</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

## About The Project

Fidel Learn is not meant to replace traditional language learning — it's meant to lower the
barrier to entry for people who never had the chance to learn the Fidel script growing up.
Users work through the script one letter family at a time (34 families in total), learning each
family's seven forms before passing a short series of assessments to unlock the next.

## Built With

**Frontend**
* React + Vite (TypeScript)
* React Router
* CSS Modules

**Backend**
* Express
* Drizzle ORM
* PostgreSQL
* JSON Web Tokens (access + refresh)

**Tooling**
* Docker Compose (local dev)
* Yarn (Berry)

## Getting Started

### Prerequisites

* Docker and Docker Compose
* A domain-appropriate `.env` at the project root (see below) — the repo includes `.env.example`

### Installation

1. Clone the repo
   ```sh
   git clone <repo-url>
   cd Fidel
   ```
2. Create a root `.env` (see `.env.example`) with:
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=<your-password>
   POSTGRES_DB=postgres
   ```
3. Create `backend/.env` with:
   ```
   DATABASE_URL=postgres://<user>:<password>@localhost:5432/<db>
   JWT_SECRET=<random-secret>
   JWT_ACCESS_TOKEN_EXPIRATION=15m
   JWT_REFRESH_TOKEN_EXPIRATION=3d
   ```
4. Build and start everything
   ```sh
   docker compose up -d --build
   ```
5. Push the schema to the database
   ```sh
   docker compose exec backend yarn db:push
   ```
6. Visit the app at `http://localhost:5173` (API at `http://localhost:3000`)

## Usage

1. Sign up with an email and password (Google sign-in is in the UI but not wired up yet).
2. The dashboard shows all 34 letter families, with the current one unlocked and the rest locked
   in order.
3. Each lesson shows the family's seven letter forms, each playable as audio, followed by four
   assessments: **Matching**, **Recognition** (character→label, then label→character), and
   **Guess the Sound**.
4. Passing all four unlocks the next family; progress is tracked per account and picks back up
   wherever you left off, including mid-way through a partially completed Recognition stage.

## API Overview

All routes are versioned under `/v1`. Everything except signup/login/refresh requires
`Authorization: Bearer <token>`.

| Method | Path | Purpose |
|---|---|---|
| POST | `/v1/auth/signup` | Create an account (email + password), returns an access token |
| POST | `/v1/auth/login` | Log in, returns an access token |
| POST | `/v1/auth/refresh` | Exchange the refresh cookie for a new access token |
| POST | `/v1/auth/logout` | Clear the refresh cookie |
| GET | `/v1/progress/me` | Get the signed-in user's `{ familyId, partCompletion }` |
| PATCH | `/v1/progress/me/complete-part` | Mark one assessment part complete; atomically rolls over to the next family once all 4 parts are done |

## Roadmap

- [x] Email/password auth (JWT access + refresh tokens)
- [x] Dashboard with per-family progress
- [x] Lesson pages with per-letter audio
- [x] Matching, Recognition (2-part), and Guess the Sound assessments
- [x] Atomic, resumable progress tracking (34 families × 4 parts)
- [ ] Google OAuth sign-in
- [ ] Recap assessment every 5 families
- [ ] "Word of the Day"
- [ ] Numbers 1–100
- [ ] Simple vocabulary words per family
- [ ] Production deployment
