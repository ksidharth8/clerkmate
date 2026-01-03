# ClerkMate

Developer CLI + Dashboard for structured standup logging and AI-powered weekly summaries.

## What it is

-  Terminal-first logging (`clerkmate log`) with offline-first local storage.
-  Sync to backend (`clerkmate sync`), view history and summaries in the Web dashboard.
-  AI-generated weekly summaries (backend-controlled, cached).

## Project Structure (High Level)

```
clerkmate/
├── apps/
│   ├── backend/         # Backend API service
│   ├── cli/             # ClerkMate CLI application
│   └── web/             # Web Dashboard application
├── docs/                # Documentation (API contracts, architecture, decisions)
└── README.md            # Readme
```

````

## Quickstart (local development)

Prereqs: Node 18+, npm, MongoDB Atlas account (or local Mongo for dev).

1. Clone

```bash
git clone https://github.com/<org>/clerkmate.git
cd clerkmate
````

2. Install

```bash
npm install
```

for backend, web, and cli folders.

3. Environment
   Copy `.env.example` to `.env` and set values for each of backend and frontend.

4. Run backend (development)

```bash
cd backend
npm run dev
# backend runs on :4000 by default
```

5. Run frontend

```bash
cd web
npm run dev
# frontend :3000
```

6. Use CLI locally

```bash
cd cli
npm link # or npm run build && node bin/run.js
clerkmate login --web
clerkmate log
clerkmate sync
clerkmate summary --from=YYYY-MM-DD --to=YYYY-MM-DD
```

## Useful scripts

-  `npm run dev` — run service locally with hot reload
-  `npm run test` — run unit tests
-  `npm run migrate` — run DB migrations

## Deploy

-  Backend → Render (or any Node host). Set env vars listed above.
-  Frontend → Vercel. `NEXT_PUBLIC_API_URL` = backend URL.
-  Use MongoDB Atlas for production DB and enable backups.

## Contributing

-  Follow repo code style (TypeScript, linting rules configured)
-  Tests required for any backend route change
-  Open a PR, assign reviewers, and ensure CI passes

---
