import {Command} from '@oclif/core'
import {marked} from 'marked'
import chalk from 'chalk'
import {createRequire} from 'node:module'
import {fetchLatestSummary, fetchWeeklySummary} from '../services/api.js'

const require = createRequire(import.meta.url)
const TerminalRenderer = require('marked-terminal').default ?? require('marked-terminal')
const options = {
  heading: (text: string) => `\n${chalk.bold.green(text.toUpperCase())}`,
  strong: chalk.magenta.underline.bold,
  showSectionPrefix: false,
  tab: 0,
}

marked.setOptions({
  mangle: false,
  headerIds: false,
  renderer: new TerminalRenderer(options),
})

export default class Summary extends Command {
  static override description = 'Display weekly summary'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {} = await this.parse(Summary)

    try {
      const latest = await fetchLatestSummary()

      if (latest.summary) {
        this.log(marked.parse(latest.summary.summaryText))
        return
      }

      this.log('Generating weekly summary...\n')
      const {summary} = await fetchWeeklySummary()
      this.log(marked.parse(summary.summaryText))
    } catch (err: any) {
      this.error(err.message)
    }
  }
}
