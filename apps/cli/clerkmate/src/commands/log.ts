import {Command, Flags} from '@oclif/core'
import inquirer from 'inquirer'
import dayjs from 'dayjs'
import {v4 as uuid} from 'uuid'
import db, {LocalStandup} from '../utils/db.js'

export default class Log extends Command {
  static override description = 'Log a daily standup entry'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --date 2023-09-15 --yesterday "Worked on X" --today "Working on Y" --blockers "None" --sync',
    '<%= config.bin %> <%= command.id %> --quick --today "Working on Y"',
  ]

  static override flags = {
    date: Flags.string({char: 'D'}),
    yesterday: Flags.string({char: 'y'}),
    today: Flags.string({char: 't'}),
    blockers: Flags.string({char: 'b'}),
    quick: Flags.boolean({char: 'q', default: false}),
    sync: Flags.boolean({char: 's', default: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Log)

    let answers = {
      date: flags.date ?? dayjs().format('YYYY-MM-DD'),
      yesterday: flags.yesterday ?? '',
      today: flags.today ?? '',
      blockers: flags.blockers ?? 'None',
    }

    const prompts: any[] = []

    // quick mode
    if (flags.quick) {
      answers.date = dayjs().format('YYYY-MM-DD')
      answers.blockers = 'None'

      if (!answers.yesterday) {
        prompts.push({
          type: 'editor',
          name: 'yesterday',
          message: 'What did you work on yesterday?',
        })
      }

      if (!answers.today) {
        prompts.push({
          type: 'editor',
          name: 'today',
          message: 'What are you working on today?',
        })
      }
    }

    // normal mode
    else {
      if (!flags.date) {
        prompts.push({
          type: 'input',
          name: 'date',
          message: 'Date (YYYY-MM-DD):',
          default: answers.date,
          validate: (input: string) => {
            const d = dayjs(input, 'YYYY-MM-DD', true)
            if (!d.isValid()) return 'Invalid date format'
            if (d.isAfter(dayjs(), 'day')) return 'Date cannot be in the future'
            return true
          },
        })
      }

      if (!answers.yesterday) {
        prompts.push({
          type: 'editor',
          name: 'yesterday',
          message: 'What did you work on yesterday?',
        })
      }

      if (!answers.today) {
        prompts.push({
          type: 'editor',
          name: 'today',
          message: 'What are you working on today?',
        })
      }

      if (!flags.blockers) {
        prompts.push({
          type: 'editor',
          name: 'blockers',
          message: 'Any blockers?',
          default: answers.blockers,
        })
      }
    }

    if (prompts.length > 0) {
      const res = await inquirer.prompt(prompts)
      answers = {...answers, ...res}
    }

    // -------- FINAL VALIDATION --------
    if (!answers.yesterday) {
      this.error('Yesterday is required')
    }
    if (!answers.today) {
      this.error('Today is required')
    }

    // handle existing standup for the date
    const existing = db.getStandupByDate(answers.date)

    if (existing) {
      const {action} = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: `Standup already exists for ${answers.date}. What do you want to do?`,
          choices: ['Edit existing standup', 'Cancel'],
        },
      ])

      if (action === 'Cancel') {
        this.log('Cancelled.')
        return
      }

      db.updateStandupByDate(answers.date, {
        yesterday: answers.yesterday.trim(),
        today: answers.today.trim(),
        blockers: answers.blockers.trim(),
      })

      this.log('Standup updated successfully.')
      return
    }

    // no existing standup, create new
    const standup: LocalStandup = {
      id: uuid(),
      date: answers.date,
      yesterday: answers.yesterday.trim(),
      today: answers.today.trim(),
      blockers: answers.blockers.trim(),
      status: 'PENDING',
      created_at: Date.now(),
      updated_at: Date.now(),
    }

    db.createStandup(standup)

    this.log(`Standup for ${answers.date} logged successfully (PENDING sync).`)

    if (flags.sync) {
      const auth = db.getAuth()

      if (!auth || auth.expires_at < Date.now()) {
        this.log('Not logged in or session expired. Standup saved locally (PENDING).')
        return
      }

      this.log('Syncing standup...')

      // defer import to reduce initial load time
      const {syncStandup} = await import('../services/api.js')

      try {
        await syncStandup(standup)
        db.markStandupSynced(standup.id)
        this.log('Standup synced successfully.')
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        this.log(`Failed to sync standup. Saved locally (PENDING). Reason: ${message}`)
      }
    }
  }
}
