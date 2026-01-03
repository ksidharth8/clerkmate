import fetch from 'node-fetch'
import {getAccessToken} from '../utils/auth.js'

// const API_BASE = 'https://clerkmate.onrender.com'
const API_BASE = 'http://localhost:4000'

export async function syncStandup(standup: any) {
  const token = getAccessToken()
  if (!token) throw new Error('Not logged in')

  const res = await fetch(`${API_BASE}/standups/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date: standup.date,
      yesterday: standup.yesterday,
      today: standup.today,
      blockers: standup.blockers,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sync failed: ${res.status} ${text}`)
  }

  return res.json()
}

export async function requestLogin(email: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email}),
  })

  if (!res.ok) throw new Error('Login request failed')
}

export async function verifyToken(token: string) {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token}),
  })

  if (!res.ok) throw new Error('Token verification failed')

  return res.json() as Promise<{
    accessToken: string
    user: {id: string; email: string}
  }>
}
export async function fetchWeeklySummary() {
  const token = getAccessToken()
  if (!token) {
    throw new Error('Not logged in')
  }

  const res = await fetch(`${API_BASE}/summaries/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const err = (await res.json()) as {error?: string}
    throw new Error(err.error || 'Failed to generate summary')
  }

  return res.json() as Promise<{
    summary: {
      summaryText: string
      startDate: string
      endDate: string
    }
  }>
}

export async function fetchLatestSummary() {
  const token = getAccessToken()
  if (!token) throw new Error('Not logged in')

  const res = await fetch(`${API_BASE}/summaries/latest`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch latest summary')
  }

  return res.json() as Promise<{
    summary: {
      summaryText: string
      startDate: string
      endDate: string
    } | null
  }>
}

export async function createCliSession() {
	const res = await fetch(`${API_BASE}/auth/cli-session`, {
		method: "POST",
	});

	if (!res.ok) {
		throw new Error("Failed to create CLI session");
	}

	return res.json() as Promise<{ sessionId: string }>;
}

export async function pollCliSession(sessionId: string) {
	const res = await fetch(
		`${API_BASE}/auth/cli-session/${sessionId}`
	);

	if (res.status === 202) {
		return { status: "pending" as const };
	}

	if (!res.ok) {
		throw new Error("Failed to poll CLI session");
	}

	return res.json() as Promise<{ token: string }>;
}
