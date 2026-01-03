import {Command, Flags} from '@oclif/core'
import dayjs from 'dayjs'
import db, {LocalStandup} from '../utils/db.js'

export default class Logs extends Command {
  static override description = 'View recent standup logs'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --days 3 --unsynced',
  ]

  static flags = {
    days: Flags.integer({
      char: 'd',
      description: 'Number of past days to show',
      default: 7,
    }),
    unsynced: Flags.boolean({
      char: 'u',
      description: 'Show only unsynced standups',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Logs)
    const days = flags.days

    const fromDate = dayjs()
      .subtract(days - 1, 'day')
      .format('YYYY-MM-DD')

    const standups = flags.unsynced
      ? db.getPendingStandups().filter((s) => s.date >= fromDate)
      : db.listStandups().filter((s) => s.date >= fromDate)

    if (standups.length === 0) {
      this.log('No standups found.')
      return
    }

    this.log(`\n📋 Showing last ${days} day(s):\n`)

    for (const s of standups) {
      this.log(`🗓  ${s.date}  [${s.status}]`)
      this.log(`• Yesterday: ${truncate(s.yesterday)}`)
      this.log(`• Today    : ${truncate(s.today)}`)
      this.log(`• Blockers : ${truncate(s.blockers)}`)
      this.log('—'.repeat(40))
    }
  }
}

function truncate(text: string, limit = 80): string {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > limit ? t.slice(0, limit) + '…' : t
}
