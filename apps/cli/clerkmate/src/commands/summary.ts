import {Command} from '@oclif/core'
import {fetchLatestSummary, fetchWeeklySummary} from '../services/api.js'

export default class Summary extends Command {
  static override description = 'Display weekly summary'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {} = await this.parse(Summary)

    try {
      const latest = await fetchLatestSummary()

      if (latest.summary) {
        this.log(latest.summary.summaryText)
        return
      }

      this.log('Generating weekly summary...\n')
      const {summary} = await fetchWeeklySummary()
      this.log(summary.summaryText)
    } catch (err: any) {
      this.error(err.message)
    }
  }
}
