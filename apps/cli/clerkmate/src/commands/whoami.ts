import {Command} from '@oclif/core'
import db from '../utils/db.js'

export default class Whoami extends Command {
  static override description = 'Display the currently logged in user'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {} = await this.parse(Whoami)

    const auth = db.getAuth()

    if (!auth) {
      this.log('Not logged in')
      return
    }

    if (auth.expires_at < Date.now()) {
      this.log(`Session expired. Last logged in as ${auth.email}`)
      return
    }

    const expiresInMs = auth.expires_at - Date.now()
    const expiresIn = Math.max(0, Math.round(expiresInMs / (1000 * 60 * 60)))

    this.log(`Logged in as ${auth.email} (expires in ${expiresIn} hour(s))`)
  }
}
