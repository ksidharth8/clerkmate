import {Command} from '@oclif/core'
import db from '../utils/db.js'
import {syncStandup} from '../services/api.js'

export default class Sync extends Command {
  static override description = 'Sync local standups to backend'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {} = await this.parse(Sync)

    const auth = db.getAuth()
    if (!auth || auth.expires_at < Date.now()) {
      this.error('You are not logged in or your session expired. Run `clerkmate login`.')
    }

    const pending = db.getPendingStandups()

    if (pending.length === 0) {
      this.log('No pending standups to sync')
      return
    }

    let synced = 0
    let failed = 0

    this.log(`Syncing ${pending.length} standup(s)...`)

    for (const s of pending) {
      try {
        await syncStandup(s)
        db.markStandupSynced(s.id)
        synced++
        this.log(`Synced ${s.date} ${s.status === 'MODIFIED' ? '(overwrite)' : ''}`)
      } catch (err) {
        failed++
        this.log(`Failed to sync ${s.date}`)
        const message = err instanceof Error ? err.message : String(err)
        this.log(`   Reason: ${message}`)
      }
    }

    this.log(`Sync complete:\nSynced : ${synced}\nFailed : ${failed}`)
  }
}
