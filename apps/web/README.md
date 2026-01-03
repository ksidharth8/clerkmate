# ClerkMate Web Dashboard

Web dashboard for **ClerkMate**, used to view standups and AI-generated weekly summaries.

The frontend is intentionally **thin and orchestration-focused**.  
All business logic, authentication decisions, and AI generation happen **exclusively on the backend**.

---

## ✨ Features

-  Email magic-link login
-  Google OAuth login
-  View standups synced from CLI
-  View AI-generated weekly summaries
-  Trigger summary generation
-  Markdown rendering for summaries
-  Stateless JWT authentication

---

## 🧠 Core Principles

-  **Read-only + orchestration UI**
-  **No business logic duplication**
-  **No AI calls from the frontend**
-  **Backend is the single source of truth**
-  **Frontend remains replaceable**

---

## 🏗️ Architecture Overview

-  Built on **Next.js App Router**
-  Communicates exclusively with the ClerkMate Backend API
-  Uses JWT via `Authorization` headers
-  No persistent frontend state beyond auth token
-  CLI authentication flows are fully isolated

---

## 🔐 Authentication Model

-  Email magic links
-  Google OAuth
-  Stateless JWT authentication

**Key Rules**

-  No cookies
-  No sessions
-  No refresh tokens
-  JWT stored only as needed for API access
-  Token audience must be `clerkmate-web`

JWT is passed on every request as:

```
Authorization: Bearer <token>
```

---

## ⚙️ Tech Stack

| Layer     | Technology                   |
| --------- | ---------------------------- |
| Framework | Next.js (App Router)         |
| Language  | TypeScript                   |
| UI        | React                        |
| Markdown  | react-markdown               |
| Auth      | JWT via Authorization header |

---

## 📦 Responsibilities

-  Web login (Email magic link + Google OAuth)
-  Display standups synced from CLI
-  Display AI-generated weekly summaries
-  Trigger summary generation
-  Render summaries in Markdown

---

## 📁 Project Structure (High Level)

```
web/
├── src/
│   ├── app/
│   │   ├── cli/
│   │   │   ├── login/
│   │   │   └── success/
│   |   ├── components/
│   │   ├── dashboard/
│   │   │   ├── standups/
│   │   │   ├── summaries/
│   │   │   └── layout.tsx
|   |   ├── login/
|   |   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
├── .env.example
└── README.md
```

---

## 🚀 Local Development

### Prerequisites

-  Node.js ≥ 18
-  Running ClerkMate backend

---

### Setup

```bash
cd web
npm install
cp .env.example .env.local
```

---

## 🧭 Routes

### Public

-  `/login` – Email + Google login (web users)

---

### CLI-Only

-  `/cli/login` – Google OAuth bridge for CLI
-  `/cli/success` – Static success page for CLI login

> CLI login routes are isolated and **never redirect to the dashboard**.

---

### Protected (JWT Required)

-  `/dashboard` – Overview
-  `/dashboard/standups` – Standup history
-  `/dashboard/summaries` – Weekly summaries

---

## 🔁 Auth Behavior

-  JWT is passed via `Authorization: Bearer <token>`
-  Redirects happen **only** for web login
-  CLI OAuth never lands on dashboard
-  Token audience must be `clerkmate-web`

---

## 🚢 Deployment

**Recommended host:** Vercel

### Production Setup

```env
NEXT_PUBLIC_API_URL=https://<backend-domain>
```

Ensure:

-  Backend allows CORS from frontend domain
-  Environment variables are set per environment

---

## 🛡️ Security Notes

-  No cookies
-  No sessions
-  No business logic on frontend
-  No AI calls from frontend
-  Frontend trusts backend responses only

---

## 🧩 Design Notes

-  UI favors **clarity over complexity**
-  No state duplication
-  Easy to replace or redesign without backend changes
-  Designed to scale with minimal frontend logic

---

## 📜 License

MIT

---

Built to complement the ClerkMate CLI and Backend, providing a simple web interface for users to view and manage their standups and summaries.

---
