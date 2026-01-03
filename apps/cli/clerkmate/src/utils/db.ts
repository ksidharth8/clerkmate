import BetterSqlite3 from 'better-sqlite3'
import {existsSync, mkdirSync} from 'node:fs'
import path from 'path'
import os from 'os'

export interface LocalStandup {
  id: string
  date: string
  yesterday: string
  today: string
  blockers: string
  status: 'PENDING' | 'SYNCED' | 'MODIFIED'
  created_at: number
  updated_at: number
}

const BASE_DIR = path.join(os.homedir(), '.clerkmate')
const DB_PATH = path.join(BASE_DIR, 'clerkmate.db')

class DB {
  private client: BetterSqlite3.Database

  constructor() {
    if (!existsSync(BASE_DIR)) {
      mkdirSync(BASE_DIR, {recursive: true})
    }

    this.client = new BetterSqlite3(DB_PATH)
    this.setup()
  }

  private setup(): void {
    this.client.exec(`
      CREATE TABLE IF NOT EXISTS standups_local (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL UNIQUE,
        yesterday TEXT NOT NULL,
        today TEXT NOT NULL,
        blockers TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_standups_status
      ON standups_local(status);

      CREATE TABLE IF NOT EXISTS auth (
        access_token TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        email TEXT
      );
    `)
  }

  createStandup(standup: LocalStandup): void {
    const stmt = this.client.prepare(`
      INSERT INTO standups_local
      (id, date, yesterday, today, blockers, status, created_at, updated_at)
      VALUES (@id, @date, @yesterday, @today, @blockers, @status, @created_at, @updated_at)
    `)

    stmt.run(standup)
  }

  listStandups(): LocalStandup[] {
    const stmt = this.client.prepare(`
      SELECT *
      FROM standups_local
      ORDER BY date DESC
    `)

    return stmt.all() as LocalStandup[]
  }

  getStandupByDate(date: string) {
    const stmt = this.client.prepare(`SELECT * FROM standups_local WHERE date = ?`)
    return stmt.get(date)
  }

  updateStandupByDate(
    date: string,
    updates: {
      yesterday: string
      today: string
      blockers: string
    },
  ) {
    const stmt = this.client.prepare(`
    UPDATE standups_local
    SET yesterday = ?,today = ?,blockers = ?,status = 'MODIFIED',updated_at = ?
    WHERE date = ?
  `)

    stmt.run(updates.yesterday, updates.today, updates.blockers, Date.now(), date)
  }

  getPendingStandups(): LocalStandup[] {
    const stmt = this.client.prepare(`
    SELECT * FROM standups_local
    WHERE status IN ('PENDING', 'MODIFIED')
    ORDER BY date ASC
  `)
    return stmt.all() as LocalStandup[]
  }

  markStandupSynced(id: string) {
    const stmt = this.client.prepare(`
    UPDATE standups_local
    SET status = 'SYNCED'
    WHERE id = ?
  `)
    stmt.run(id)
  }

  saveAuthToken(token: string, expiresAt: number, email: string) {
    this.client.exec('DELETE FROM auth')
    this.client
      .prepare('INSERT INTO auth (access_token, expires_at, email) VALUES (?, ?, ?)')
      .run(token, expiresAt, email)
  }

  getAuth() {
    const stmt = this.client.prepare('SELECT access_token, expires_at, email FROM auth LIMIT 1')
    return stmt.get() as {access_token: string; expires_at: number; email: string} | undefined
  }

  clearAuth() {
    this.client.exec('DELETE FROM auth')
  }
}

/** Singleton instance */
const db = new DB()
export default db
