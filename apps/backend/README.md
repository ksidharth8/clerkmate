# ClerkMate Backend

Backend API for **ClerkMate**, powering both the **CLI** and the **Web Dashboard**.

This service is the **single source of truth** for authentication, standup data, and AI-powered weekly summaries.  
All AI logic, prompt control, and security decisions live **strictly on the backend**.

---

## ✨ Features

- Email magic-link authentication
- Google OAuth (Web + CLI bridge)
- Stateless JWT authentication
- Standup sync from CLI
- Standup retrieval for Web Dashboard
- AI-powered weekly summaries
- Summary caching via fingerprinting
- Shared backend for **CLI + Web**

---

## 🧠 Core Principles

- **Backend-first** architecture
- **No AI calls** from CLI or frontend
- **No cookies, no sessions, no passwords**
- **JWT-only auth** with strict validation
- **Correctness over convenience**

---

## 🏗️ Architecture Overview

- A **single backend** serves both:
  - ClerkMate CLI
  - ClerkMate Web Dashboard
- Backend controls:
  - Authentication
  - Authorization
  - AI prompting & output
  - Data validation
- CLI and frontend are treated as **untrusted clients**

---

## 🔐 Authentication Model

- Email magic links
- Google OAuth (shared flow for Web & CLI)
- JWT-based auth (stateless)

**JWT Claims**
- `issuer`: `clerkmate-api`
- `audience`:
  - `clerkmate-cli`
  - `clerkmate-web`

No:
- Cookies
- Refresh tokens
- Passwords
- Server sessions

All login tokens and CLI sessions are **TTL-based**.

---

## ⚙️ Tech Stack

| Layer        | Technology |
|-------------|------------|
| Runtime     | Node.js 18+ |
| Framework   | Express |
| Language    | TypeScript |
| Database    | MongoDB Atlas + Mongoose |
| Auth        | JWT |
| AI          | `gpt-oss-20b` via Pawan API |
| Email       | SMTP (magic links) |

---

## 📦 Responsibilities

- Email magic-link authentication
- Google OAuth (Web + CLI bridge)
- JWT issuance & verification
- Standup sync (CLI → Backend)
- Standup retrieval (Web)
- Weekly summary generation
- Summary caching via fingerprinting

---

## 🧠 AI Summary Generation

- Requires **minimum 2 standups**
- Date range is **backend-controlled**
- Prompt is **strictly grounded**
- Fingerprint cache prevents duplicate generations
- Returns `202 Accepted` if generation is queued
- AI calls are **never made from CLI or frontend**

---

## 📁 Project Structure (High Level)

```

backend/
├─ src/
│  ├─ config/
│  ├─ db/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  ├─ services/
│  ├─ utils/
│  ├─ app.ts
│  └─ server.ts
├─ .env.example
└─ README.md

````

---

## 🚀 Local Development

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas URI (or local MongoDB)

---

### Setup

```bash
cd backend
npm install
cp .env.example .env
````

---

### Run Locally

```bash
npm run dev
```

Backend will be available at:

```
http://localhost:4000
```

---

## 🔌 API Endpoints

### Authentication

* `POST /auth/login` – Request email magic link / token
* `POST /auth/verify-link` – Send email magic link
* `POST /auth/verify` – Verify email token
* `POST /auth/cli/session` – Create CLI login session
* `GET /auth/cli/session/:id` – Poll CLI login session
* `GET /auth/google` – Google OAuth (Web / CLI bridge)

---

### Standups

* `POST /standups/sync` – Sync standups from CLI
* `GET /standups` – Fetch standups (Web)

---

### Summaries

* `POST /summaries/generate` – Generate weekly summary
* `GET /summaries/latest` – Fetch recent summaries

📄 **Full API contract:**
See [`/api-contracts.md`](./../../docs/api-contracts.md)

---

## 🚢 Deployment

**Recommended host:** Render

### Production Checklist

* MongoDB Atlas backups enabled
* JWT secrets rotated per environment
* Production-grade SMTP provider
* Secure environment variable management

---

## 🛡️ Security Notes

* No cookies
* No refresh tokens
* No passwords
* Short-lived JWTs
* TTL-based magic links and CLI sessions
* Backend is the sole authority

---

## 📜 License

MIT

---

## 👋 Contributing

Contributions are welcome.
Please open an issue before submitting major changes.

---

Built with care to keep your standups **simple, private, and useful**.

---
