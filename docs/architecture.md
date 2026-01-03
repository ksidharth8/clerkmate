## Overview

Single backend architecture serving both CLI and Web UI. Offline-first CLI stores local SQLite and syncs to backend (MongoDB Atlas). Backend generates AI summaries using `gpt-oss-20b` via `https://api.pawan.krd/v1/chat/completions`.

Components:

* CLI (Node + oclif)
* Local SQLite (~ `~/.clerkmate/clerkmate.db`)
* Backend API (Express, Node)
* MongoDB Atlas (primary store)
* AI service (external model endpoint)
* Frontend (Next.js, React)
* Hosting: Backend → Render; Frontend → Vercel

### Data flow (simplified)

1. User `clerkmate log` → local SQLite insert (`PENDING`).
2. `clerkmate sync` → CLI calls `POST /standups/sync` with pending/modified entries.
3. Backend upserts standups into MongoDB, responds with remote IDs; marks client entries `SYNCED`.
4. User requests summary (CLI or web) → Backend checks fingerprint cache → if missing, collates facts and calls AI endpoint → stores AISummary and returns text.

### Login flows

* **Email magic link** (web & CLI via polling)

  1. User requests `POST /auth/login` with email.
  2. Backend emails single-use token link (`/auth/verify-link?token=...`).
  3. Web user clicks link → backend issues JWT and redirects to dashboard.
  4. CLI `login --web` opens the same link; CLI polls `/auth/cli/session/:id` for token.

* **Google OAuth (web + CLI bridge)**

  * Web-side redirect to Google; on callback backend issues JWT and sets LoginSession for CLI bridge.

### Data models (summary)

* **User**: `id, email, displayName?, createdAt, lastSeen`
* **Standup**: `id, userId, date, yesterday, today, blockers, createdAt, updatedAt`
* **AISummary**: `id, userId, from, to, text, standupFingerprint, createdAt`
* **LoginToken**: `token, email, expiresAt, used`
* **LoginSession**: `id, status(PENDING|READY|EXPIRED), token?, expiresAt`

### Deployment & environment

* Envs required (non-exhaustive):

  * `NODE_ENV`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_ISSUER=clerkmate-api`, `AI_API_URL`, `AI_API_KEY` (if needed), `SMTP_URL` or SMTP provider creds, `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `CLI_CALLBACK_URL`.
* Ports: Backend default `4000`, Frontend `3000` (local development).

### Reliability & scaling notes

* AI calls are external — queue long-running jobs (generate summary as background job) and return 202 if queued.
* Use fingerprint cache for summaries to avoid repeated AI calls.
* Use TTL / TTL-indexed LoginSessions and LoginTokens to reduce stale entries.
* Rate-limit endpoints; monitor SMTP failures.

### Backups & migrations

* Regular MongoDB snapshots (Atlas).
* Provide migration scripts via `migrate` npm script.

---

