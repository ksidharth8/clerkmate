## Key decisions (what & why)

### 1. Offline-first CLI with SQLite + Backend as source of truth

**Why**: Developers need local, fast logging even when offline. SQLite is lightweight, easy to bundle, and simple to sync.
**Trade-offs**: Sync complexity (conflicts) — resolved by trusting backend and using `status` flags plus `updatedAt` when needed.

### 2. JWT auth with email magic-link + Google OAuth

**Why**: Simple UX (no passwords), easy to implement, secure enough for MVP. Google OAuth provides convenience for orgs.
**Trade-offs**: Email sending reliability (SMTP issues on Render); considered third-party transactional email provider as backup.

### 3. AI only on backend (no client-side AI calls)

**Why**: Centralized control of prompts, date ranges, and fingerprints removed hallucination and ensured reproducibility.
**Trade-offs**: Backend needs to handle latency and costs; mitigated with caching and background jobs.

### 4. Summary caching with fingerprinting

**Why**: Avoid regenerate duplicates and control costs for the AI model.

### 5. No cookies / no refresh tokens in MVP

**Why**: Simpler security model; short-lived JWTs minimize attack surface. CLI stores JWT locally for convenience.

## Rejected alternatives

-  Full OAuth-only approach (rejected due to complexity for CLI-only users).
-  Password-based auth (rejected for UX and security overhead).
-  Client-side AI calls (rejected due to prompt leakage & inconsistent metadata control).

## Security & privacy considerations

-  Tokens: JWT_SECRET must be strongly random and rotated per policy.
-  Emails: magic links single-use and time-limited.
-  Sensitive data: do not log full AI responses to public logs; redact PII in stored summaries if necessary.

---

## Notion Page

[🚀 ClerkMate Planning](https://www.notion.so/ClerkMate-Planning-2d604fe4edd480ac9681f7b38ee42f72?source=copy_link)
