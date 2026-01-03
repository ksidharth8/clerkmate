import {Command, Flags} from '@oclif/core'
import inquirer from 'inquirer'
import db from '../utils/db.js'
import {requestLogin, verifyToken, createCliSession, pollCliSession} from '../services/api.js'
import open from 'open'
import {saveAccessToken} from '../utils/auth.js'

export default class Login extends Command {
  static override description = 'Login to ClerkMate'

  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --web']

  static override flags = {
    web: Flags.boolean({
      char: 'w',
      description: 'Login via browser instead of CLI token',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Login)

    const existing = db.getAuth()
    if (existing && existing.expires_at > Date.now()) {
      this.log(`Already logged in as ${existing.email}`)
      return
    }

    if (flags.web) {
      const {sessionId} = await createCliSession()

      const loginUrl = `https://clerkmate.vercel.app/cli/login?session=${sessionId}`
      // const loginUrl = `http://localhost:3000/cli/login?session=${sessionId}`

      this.log('Opening browser to complete login...')
      await open(loginUrl)

      this.log('Waiting for login to complete...')

      for (;;) {
        const res = await pollCliSession(sessionId)

        if ('token' in res) {
          const {email} = saveAccessToken(res.token)
          this.log(`Logged in as ${email}`)
          break
        }

        await new Promise((r) => setTimeout(r, 2000))
      }

      return
    }

    const {email} = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email:',
        validate: (v: string) => (v.includes('@') ? true : 'Enter a valid email'),
      },
    ])

    this.log('Requesting login token...')
    await requestLogin(email)

    this.log('Login token sent to your email.\n')

    const {token} = await inquirer.prompt([
      {
        type: 'input',
        name: 'token',
        message: 'Enter login token:',
      },
    ])

    const result = await verifyToken(token)

    // JWT expiry = 7 days
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

    db.saveAuthToken(result.accessToken, expiresAt, result.user.email)

    this.log(`Logged in as ${result.user.email}`)
  }
}
