# clerkmate

Developer-first CLI for daily standups

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/clerkmate.svg)](https://npmjs.org/package/clerkmate)
[![Downloads/week](https://img.shields.io/npm/dw/clerkmate.svg)](https://npmjs.org/package/clerkmate)

### About

ClerkMate is a developer-first CLI tool that replaces messy daily standups with structured logs and AI-powered summaries — like Git commits for daily work.

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)

<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g clerkmate
$ clerkmate COMMAND
  running command...
$ clerkmate --version
  clerkmate/1.0.0 darwin-arm64 node-v22.13.1
$ clerkmate --help [COMMAND]
USAGE
  $ clerkmate COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`clerkmate --help`](#clerkmate-help)
- [`clerkmate log`](#clerkmate-log)
- [`clerkmate login`](#clerkmate-login)
- [`clerkmate logout`](#clerkmate-logout)
- [`clerkmate logs`](#clerkmate-logs)
- [`clerkmate summary`](#clerkmate-summary)
- [`clerkmate sync`](#clerkmate-sync)
- [`clerkmate whoami`](#clerkmate-whoami)

## `clerkmate --help`

Developer-first CLI for daily standups

```
VERSION
  clerkmate/1.0.0 darwin-arm64 node-v22.13.1

USAGE
  $ clerkmate [COMMAND]

COMMANDS
  log      Log a daily standup entry
  login    Login to ClerkMate
  logout   Logout from ClerkMate
  logs     View recent standup logs
  summary  Display weekly summary
  sync     Sync local standups to backend
  whoami   Display the currently logged in user
```

## `clerkmate log`

Log a daily standup entry

```
USAGE
  $ clerkmate log [-D <value>] [-y <value>] [-t <value>] [-b <value>] [-q] [-s]

FLAGS
  -D, --date=<value>
  -b, --blockers=<value>
  -q, --quick
  -s, --sync
  -t, --today=<value>
  -y, --yesterday=<value>

DESCRIPTION
  Log a daily standup entry

EXAMPLES
  $ clerkmate log

  $ clerkmate log --date 2023-09-15 --yesterday "Worked on X" --today "Working on Y" --blockers "None" --sync

  $ clerkmate log --quick --today "Working on Y"
```

_See code: [src/commands/log.ts](https://github.com/ksidharth8/clerkmate/tree/main/apps/cli/clerkmate/src/commands/log.ts)_

## `clerkmate login`

Login to ClerkMate

```USAGE
  $ clerkmate login [-w]

FLAGS
  -w, --web  Login via browser instead of CLI token

DESCRIPTION
  Login to ClerkMate

EXAMPLES
  $ clerkmate login

  $ clerkmate login --web
```

_See code: [src/commands/login.ts](https://github.com/ksidharth8/clerkmate/tree/main/apps/cli/clerkmate/src/commands/login.ts)_

## `clerkmate logout`

Logout from ClerkMate

```
USAGE
  $ clerkmate logout

DESCRIPTION
  Logout from ClerkMate

EXAMPLES
  $ clerkmate logout
```

_See code: [src/commands/logout.ts](https://github.com/ksidharth8/clerkmate/tree/main/apps/cli/clerkmate/src/commands/logout.ts)_

## `clerkmate logs`

View recent standup logs

```
USAGE
  $ clerkmate logs [-d <value>] [-u]

FLAGS
  -d, --days=<value>  [default: 7] Number of past days to show
  -u, --unsynced      Show only unsynced standups

DESCRIPTION
  View recent standup logs

EXAMPLES
  $ clerkmate logs

  $ clerkmate logs --days 3 --unsynced
```

_See code: [src/commands/logs.ts](https://github.com/ksidharth8/clerkmate/tree/main/apps/cli/clerkmate/src/commands/logs.ts)_

## `clerkmate summary`

Display weekly summary

```
USAGE
  $ clerkmate summary

DESCRIPTION
  Display weekly summary

EXAMPLES
  $ clerkmate summary
```

_See code: [src/commands/summary.ts](https://github.com/ksidharth8/clerkmate/tree/main/apps/cli/clerkmate/src/commands/summary.ts)_

## `clerkmate sync`

Sync local standups to backend

```
USAGE
  $ clerkmate sync

DESCRIPTION
  Sync local standups to backend

EXAMPLES
  $ clerkmate sync
```

_See code: [src/commands/sync.ts](https://github.com/ksidharth8/clerkmate/tree/main/apps/cli/clerkmate/src/commands/sync.ts)_

## `clerkmate whoami`

Display the currently logged in user

```
USAGE
  $ clerkmate whoami

DESCRIPTION
  Display the currently logged in user

EXAMPLES
  $ clerkmate whoami
```

<!-- commandsstop -->
