// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs, styleText } from 'node:util'
import * as p from '@clack/prompts'
import {
  applyPythonChanges,
  findApp,
  parseRoute,
  planPythonChanges,
  readBench,
} from './frappe.js'
import { copyTemplate, templateFiles, toPackageName } from './scaffold.js'
import { detectPackageManager, install, runCommand } from './packageManager.js'

/** @typedef {import('./scaffold.js').Template} Template */
/** @typedef {import('./frappe.js').PythonChange} PythonChange */

const { version } = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)

const HELP = `Create a frappe-ui app.

Usage:
  npm create frappe-ui@latest [dir] -- [options]

Options:
  -t, --template <name>  frappe or standalone
      --route <path>     Where the site serves the app, like /todo (frappe only)
      --install          Install dependencies
      --no-install       Don't install dependencies
  -y, --yes              Use the default answers and don't ask anything
  -h, --help             Show this help

Templates:
  frappe      The frontend of a Frappe app. Run it from apps/<app>.
  standalone  A Vite app with no Frappe server.

Docs: https://ui.frappe.io/docs/getting-started`

/** An expected failure. Its message is all the user needs to see. */
class CliError extends Error {}

/** @param {string[]} argv */
export async function run(argv) {
  try {
    await create(argv)
  } catch (error) {
    if (error instanceof CliError) {
      p.cancel(error.message)
    } else {
      const message = error instanceof Error ? error.message : String(error)
      p.cancel(
        `${message}\n${styleText('dim', 'This is a bug. Please report it at https://github.com/frappe/frappe-ui/issues')}`,
      )
    }
    process.exit(1)
  }
}

/** @param {string[]} argv */
async function create(argv) {
  const args = readArgs(argv)
  if (args.help) {
    console.log(HELP)
    return
  }

  const interactive = !args.yes && process.stdin.isTTY && process.stdout.isTTY
  const cwd = process.cwd()
  const app = findApp(cwd)
  const pm = detectPackageManager(process.env.npm_config_user_agent)

  p.intro(`${styleText(['bgCyan', 'black'], ' frappe-ui ')} ${styleText('dim', `v${version}`)}`)

  // Where
  const frontendDir = app && path.relative(cwd, path.join(app.root, 'frontend'))
  const defaultDir =
    args.template === 'standalone' || !frontendDir ? 'my-app' : frontendDir
  const dir =
    args.dir ??
    (interactive
      ? await ask(
          p.text({
            message: 'Where should we create your project?',
            placeholder: `./${defaultDir}`,
            defaultValue: defaultDir,
          }),
        )
      : defaultDir)
  const target = path.resolve(cwd, dir)

  // What for
  /** @type {Template} */
  const template =
    args.template ??
    (interactive
      ? await ask(
          p.select({
            message: 'What is it for?',
            initialValue: app ? 'frappe' : 'standalone',
            options: [
              {
                value: /** @type {const} */ ('frappe'),
                label: 'Frappe app',
                hint: 'frontend for a Frappe app (run inside apps/<app>)',
              },
              {
                value: /** @type {const} */ ('standalone'),
                label: 'Standalone',
                hint: 'a Vite app with no Frappe server',
              },
            ],
          }),
        )
      : app
        ? 'frappe'
        : 'standalone')

  /** @type {{ route: string, changes: PythonChange[] } | null} */
  let frappe = null
  if (template === 'frappe') {
    if (!app) {
      throw new CliError(
        `No Frappe app found in ${cwd}.\nRun this from your app's folder, for example: cd apps/todo`,
      )
    }
    if (path.dirname(target) !== app.root) {
      throw new CliError(
        `The frontend must be a folder directly inside the app, such as ${display(cwd, path.join(app.root, 'frontend'))}.`,
      )
    }
    const route = await askRoute(args.route, `/${app.name}`, interactive)
    frappe = { route, changes: planPythonChanges(app, route) }
  }

  await checkTarget(target, template, cwd, interactive)

  if (frappe) {
    p.note(describeChanges(frappe.changes, cwd), 'Python files')
    const writes = frappe.changes.some((change) => change.content !== undefined)
    if (
      writes &&
      interactive &&
      !(await ask(p.confirm({ message: 'Make these changes?', initialValue: true })))
    ) {
      throw new CliError('Nothing was changed.')
    }
  }

  const shouldInstall =
    args.install ??
    (interactive
      ? await ask(
          p.confirm({ message: `Install dependencies with ${pm}?`, initialValue: true }),
        )
      : true)

  // Write
  const title = app && template === 'frappe' ? app.title : path.basename(target)
  copyTemplate(template, target, {
    PACKAGE_NAME: toPackageName(
      app && template === 'frappe' ? `${app.name}-frontend` : path.basename(target),
    ),
    TITLE: escapeHtml(title),
    FRAPPE_UI_VERSION: version,
    ROUTE: frappe?.route ?? '/',
    ROUTE_NAME: frappe?.route.slice(1) ?? '',
  })
  if (frappe) {
    applyPythonChanges(frappe.changes)
    for (const change of frappe.changes) {
      if (change.action !== 'manual') continue
      p.log.warn(
        `Add this rule to website_route_rules in ${path.relative(cwd, change.file)}:\n${change.snippet}`,
      )
    }
  }

  let installed = false
  if (shouldInstall) {
    // An animated spinner fills a log file with frames, so only use it in a
    // terminal.
    const spinner = process.stdout.isTTY
      ? p.spinner()
      : { start: p.log.step, stop: p.log.success, error: p.log.error }
    spinner.start(`Installing dependencies with ${pm}`)
    const result = await install(pm, target)
    if (result.ok) {
      spinner.stop('Installed dependencies')
      installed = true
    } else {
      spinner.error(`Couldn't install dependencies`)
      const tail = result.output.trim().split('\n').slice(-8).join('\n')
      if (tail) p.log.message(styleText('dim', tail))
    }
  }

  p.log.step('Project ready')

  // Next steps
  /** @type {string[]} */
  const steps = []
  const relativeTarget = path.relative(cwd, target)
  if (relativeTarget) steps.push(command(`cd ${quote(relativeTarget)}`))
  if (!installed) steps.push(command(`${pm} install`))
  if (frappe && app) {
    const { devPort, site } = readBench(app)
    const siteName = site ?? '<site>'
    steps.push(
      command(`bench --site ${siteName} set-config ignore_csrf 1`) +
        styleText('dim', '  # development only'),
      command(runCommand(pm, 'dev')),
      '',
      `Then, with bench start running, open ${styleText('cyan', `http://${siteName}:${devPort}${frappe.route}`)}`,
    )
  } else {
    steps.push(command(runCommand(pm, 'dev')))
  }
  p.outro(`Next steps:\n${steps.map((line) => `     ${line}`).join('\n')}`)
}

/**
 * @param {string[]} argv
 */
function readArgs(argv) {
  let parsed
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      allowNegative: true,
      options: {
        template: { type: 'string', short: 't' },
        route: { type: 'string' },
        install: { type: 'boolean' },
        yes: { type: 'boolean', short: 'y' },
        help: { type: 'boolean', short: 'h' },
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message.split('.')[0] : ''
    throw new CliError(`${message}. Run with --help to see the options.`)
  }
  const { values, positionals } = parsed
  if (positionals.length > 1) {
    throw new CliError(
      `Expected one folder, got ${positionals.length}: ${positionals.join(' ')}`,
    )
  }
  const template = values.template
  if (template !== undefined && template !== 'frappe' && template !== 'standalone') {
    throw new CliError(`Unknown template "${template}". Use frappe or standalone.`)
  }
  return {
    dir: positionals[0],
    /** @type {Template | undefined} */
    template,
    route: values.route,
    install: values.install,
    yes: values.yes ?? false,
    help: values.help ?? false,
  }
}

/**
 * @param {string | undefined} flag
 * @param {string} defaultRoute
 * @param {boolean} interactive
 */
async function askRoute(flag, defaultRoute, interactive) {
  const input =
    flag ??
    (interactive
      ? await ask(
          p.text({
            message: 'Which route should the site serve it on?',
            placeholder: defaultRoute,
            defaultValue: defaultRoute,
            validate: (value) => {
              const result = parseRoute(value || defaultRoute)
              return 'error' in result ? result.error : undefined
            },
          }),
        )
      : defaultRoute)
  const result = parseRoute(input)
  if ('error' in result) throw new CliError(`Invalid route "${input}". ${result.error}`)
  return result.route
}

/**
 * Stops before anything in a non-empty folder is replaced without a yes.
 *
 * @param {string} target
 * @param {Template} template
 * @param {string} cwd
 * @param {boolean} interactive
 */
async function checkTarget(target, template, cwd, interactive) {
  if (!fs.existsSync(target)) return
  if (!fs.statSync(target).isDirectory()) {
    throw new CliError(`${display(cwd, target)} is a file. Choose a folder name.`)
  }
  const existing = fs
    .readdirSync(target)
    .filter((name) => name !== '.git' && name !== '.DS_Store')
  if (existing.length === 0) return

  const name = display(cwd, target)
  if (!interactive) {
    throw new CliError(
      `${name} is not empty. Choose an empty folder, or run without --yes in a terminal to confirm.`,
    )
  }
  const replaced = templateFiles(template).filter((file) =>
    fs.existsSync(path.join(target, file)),
  )
  if (replaced.length > 0) {
    p.note(replaced.join('\n'), `These files in ${name} will be replaced`)
  }
  const proceed = await ask(
    p.confirm({
      message: `${name} is not empty. Add the project to it anyway?`,
      initialValue: false,
    }),
  )
  if (!proceed) throw new CliError('Nothing was changed.')
}

/**
 * @param {PythonChange[]} changes
 * @param {string} cwd
 */
function describeChanges(changes, cwd) {
  return changes
    .map((change) => {
      const file = path.relative(cwd, change.file)
      switch (change.action) {
        case 'create':
          return `${styleText('green', '+')} ${file}  ${styleText('dim', 'new page that serves the frontend')}`
        case 'update':
          return `${styleText('yellow', '~')} ${file}  ${styleText('dim', 'add a route rule')}`
        case 'keep':
          return `${styleText('dim', `= ${file}  already set up, not changed`)}`
        case 'manual':
          return [
            `${styleText('red', '!')} ${file}  ${styleText('dim', "can't be edited safely. Add this rule to website_route_rules:")}`,
            `  ${change.snippet}`,
          ].join('\n')
      }
    })
    .join('\n')
}

/**
 * Exits cleanly when the user cancels a prompt with Ctrl-C or Escape.
 *
 * @template T
 * @param {Promise<T | symbol>} prompt
 * @returns {Promise<T>}
 */
async function ask(prompt) {
  const value = await prompt
  if (p.isCancel(value)) {
    p.cancel('Cancelled. Nothing was changed.')
    process.exit(0)
  }
  return /** @type {T} */ (value)
}

/** @param {string} text */
function command(text) {
  return styleText('cyan', text)
}

/**
 * A path as the user would type it from `cwd`.
 *
 * @param {string} cwd
 * @param {string} file
 */
function display(cwd, file) {
  const relative = path.relative(cwd, file)
  return relative.startsWith('..') || path.isAbsolute(relative) ? file : `./${relative}`
}

/** @param {string} value */
function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** @param {string} value */
function quote(value) {
  return /^[\w./-]+$/.test(value) ? value : `"${value}"`
}
