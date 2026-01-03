## Summary

API contract definitions for ClerkMate backend. All endpoints expect and return JSON unless noted. API is JWT-protected for routes requiring authentication. JWT `issuer` = `clerkmate-api`; `audience` = `clerkmate-cli` or `clerkmate-web` depending on client.

---

### Common

**Auth header**: `Authorization: Bearer <JWT>`

**JWT claims (required)**

```json
{
	"iss": "clerkmate-api",
	"aud": "clerkmate-cli", // or clerkmate-web
	"sub": "<userId>",
	"email": "user@example.com",
	"exp": 1712345678
}
```

**Error format**

```json
{
	"error": "Short message",
	"details": {
		/* optional */
	}
}
```

---

# Authentication

## POST /auth/login

Request: initiate email magic-link login.

```json
POST /auth/login
Content-Type: application/json
Body: { "email": "user@example.com" }
```

Response:

-  `202 Accepted` — { "message": "verification_sent" }
-  `400` — invalid email

## GET /auth/verify-link?token=<token>

Request: click from email → backend verifies token, issues JWT.
Response:

-  `200` — Redirect/page or JSON `{ "token": "<jwt>" }` (web flow uses redirect; CLI flow uses poll)
-  `401` — invalid/expired token

## POST /auth/verify

Request (one-time): verify magic link token in API form

```json
POST /auth/verify
Body: { "token": "<emailToken>" }
```

Response:

-  `200` — { "token": "<jwt>", "user": { "id": "..", "email":".." } }

---

# CLI session (Google OAuth bridge)

## POST /auth/cli/session

Create a short-lived CLI session that returns `{ id, url }`.
Request:

```json
POST /auth/cli/session
Body: { "audience": "clerkmate-cli", "email_hint": "optional" }
```

Response:

-  `201` — `{ "id": "<uuid>", "url": "https://.../auth/cli/login?session=<id>" }`

## GET /auth/cli/session/:id

Polling endpoint used by CLI.
Responses:

-  `202` — `{ "status": "PENDING" }`
-  `200` — `{ "status": "READY", "token": "<jwt>" }`
-  `410` — `{ "status": "EXPIRED" }`

---

# Standups

## POST /standups/sync

Used by CLI to push a batch of local standups to backend. Backend will upsert by `id` (if provided) or create new.
Request:

```json
POST /standups/sync
Headers: Authorization
Body: {
  "standups": [
    {
      "id": "local-uuid-or-null",
      "date": "2025-01-30",
      "yesterday": "...",
      "today": "...",
      "blockers": "...",
      "status": "PENDING" // PENDING | MODIFIED | SYNCED (client state)
    }
  ]
}
```

Response:

-  `200` — `{ "synced": [ { "local_id": "...", "remote_id": "<mongoId>", "status": "SYNCED" } ], "errors": [] }`
-  `400` — invalid payload

## GET /standups?from=YYYY-MM-DD&to=YYYY-MM-DD

Fetch standups for a date range (web dashboard uses this).
Response:

-  `200` — `{ "standups": [ { "id": "<id>", "date":"...", "yesterday":"...","today":"...","blockers":"...","createdAt":"...","updatedAt":"..." } ] }`

---

# Summaries

## POST /summaries/generate

Request the backend to generate a summary for a given date range. Backend will validate range (min 2 standups) and use cached summary if fingerprint matches.

```json
POST /summaries/generate
Body: { "from": "2025-01-20", "to": "2025-01-26" }
```

Response:

-  `202` — `{ "message": "generation_started", "summaryId": "<id>" }`
-  `400` — range invalid / insufficient data
-  `500` — AI generation error
  
---

# Admin/Debug

## GET /health

`200` `{ "status":"ok","db":"connected" }`

---

# Rate-limiting & quotas

-  Auth endpoints: strict rate limit by IP and email (to prevent spam).
-  Summaries: moderate rate-limit; heavy usage queued and rate-limited per-account.

# Security notes

-  All protected endpoints require `Authorization` header with Bearer JWT.
-  CLI sessions must be single-use, TTL-limited (e.g., 10 minutes).
-  Do not accept tokens via URL in production (except short-lived email links which are single-use).

---
