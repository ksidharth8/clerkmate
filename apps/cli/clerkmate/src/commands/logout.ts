import {Command} from '@oclif/core'
import db from '../utils/db.js'

export default class Logout extends Command {
  static override description = 'Logout from ClerkMate'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {} = await this.parse(Logout)

    const auth = db.getAuth()
    if (!auth) {
      this.log('You are not logged in')
      return
    }

    db.clearAuth()
    this.log('Logged out successfully')
  }
}
