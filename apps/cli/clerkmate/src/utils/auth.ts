import db from './db.js'
import jwt from 'jsonwebtoken'

export function getAccessToken(): string | null {
  const row = db['client'].prepare('SELECT access_token FROM auth LIMIT 1').get() as {access_token: string} | undefined

  return row?.access_token || null
}

export function saveAccessToken(token: string) {
  const decoded = jwt.decode(token) as {email?: string}

  const email = decoded?.email ?? 'unknown'

  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

  db.saveAuthToken(token, expiresAt, email)

  return {email}
}
