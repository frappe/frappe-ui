// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { quote, runCommand } from './packageManager.js'

/** @typedef {import('./packageManager.js').PackageManager} PackageManager */

/**
 * @typedef {object} FrappeApp
 * @property {string} root The app folder, `apps/<app>`.
 * @property {string} name The Python package, which holds `hooks.py`.
 * @property {string} title `app_title` from `hooks.py`.
 * @property {string | null} bench The bench folder, when the app sits in `<bench>/apps`.
 */

/**
 * @typedef {object} AppChange
 * @property {string} file Absolute path.
 * @property {'create' | 'update' | 'keep' | 'manual'} action
 *   `keep` leaves the file as it is. `manual` means the edit is not safe to
 *   make, so `snippet` has the lines to paste in.
 * @property {string} summary What the change does, or for `manual`, what to
 *   do with the snippet.
 * @property {string} [content] The new file content, for `create` and `update`.
 * @property {string} [snippet]
 */

/** Routes that Frappe serves itself, so the app can't take them. */
const RESERVED_ROUTES = [
  'api',
  'app',
  'assets',
  'desk',
  'files',
  'login',
  'private',
]

/**
 * Finds the Frappe app that holds `dir`: either `dir` is the app folder
 * (`apps/<app>`), or it is somewhere inside it.
 *
 * @param {string} dir
 * @returns {FrappeApp | null}
 */
export function findApp(dir) {
  let current = path.resolve(dir)
  while (true) {
    const app = readApp(current)
    if (app) return app
    const parent = path.dirname(current)
    if (parent === current) return null
    current = parent
  }
}

/**
 * @param {string} root
 * @returns {FrappeApp | null}
 */
function readApp(root) {
  let entries
  try {
    entries = fs.readdirSync(root, { withFileTypes: true })
  } catch {
    return null
  }
  const packages = entries.filter(
    (entry) =>
      entry.isDirectory() &&
      fs.existsSync(path.join(root, entry.name, 'hooks.py')),
  )
  if (packages.length !== 1) return null

  const name = packages[0].name
  const hooks = fs.readFileSync(path.join(root, name, 'hooks.py'), 'utf8')
  const title = /^app_title\s*=\s*["'](.+?)["']/m.exec(hooks)?.[1] ?? name

  const apps = path.dirname(root)
  const bench =
    path.basename(apps) === 'apps' &&
    fs.existsSync(path.join(apps, '..', 'sites'))
      ? path.dirname(apps)
      : null

  return { root, name, title, bench }
}

/**
 * Normalizes a route typed by the user to `/name`, and returns an error message
 * when it can't be used.
 *
 * @param {string} input
 * @returns {{ route: string } | { error: string }}
 */
export function parseRoute(input) {
  const route = '/' + input.trim().replace(/^\/+|\/+$/g, '')
  if (!/^\/[a-z0-9_-]+(\/[a-z0-9_-]+)*$/i.test(route)) {
    return {
      error: 'Use letters, numbers, - and _, like /todo or /my-app',
    }
  }
  const first = route.split('/')[1]
  if (RESERVED_ROUTES.includes(first.toLowerCase())) {
    return { error: `Frappe already serves /${first}. Pick another route.` }
  }
  return { route }
}

/**
 * The web server details the "next steps" need: the dev server port and a
 * site name, when the bench has only one site.
 *
 * @param {FrappeApp} app
 */
export function readBench(app) {
  let webserverPort = 8000
  let site = null
  if (app.bench) {
    const sites = path.join(app.bench, 'sites')
    try {
      const config = JSON.parse(
        fs.readFileSync(path.join(sites, 'common_site_config.json'), 'utf8'),
      )
      if (Number.isInteger(config.webserver_port)) {
        webserverPort = config.webserver_port
      }
    } catch {
      // No readable config: the bench uses the default port.
    }
    // The frappe-ui Vite plugin reads the port from the environment first.
    const envPort = Number(process.env.FRAPPE_WEB_SERVER_PORT)
    if (Number.isInteger(envPort) && envPort > 0) webserverPort = envPort
    const siteNames = fs
      .readdirSync(sites)
      .filter((name) =>
        fs.existsSync(path.join(sites, name, 'site_config.json')),
      )
    if (siteNames.length === 1) site = siteNames[0]
  }
  // The plugin runs the dev server on the bench port plus 80.
  return { devPort: webserverPort + 80, site }
}

/**
 * Plans the changes to the app around the frontend: the page that serves it,
 * the route rule that sends every path under the route to that page, the
 * scripts that let bench install and build it, and the ignore rules for the
 * build output. Nothing is written until `applyAppChanges`.
 *
 * @param {FrappeApp} app
 * @param {{ route: string, frontend: string, pm: PackageManager }} options
 *   `frontend` is the folder name, such as `frontend`.
 * @returns {AppChange[]}
 */
export function planAppChanges(app, { route, frontend, pm }) {
  const pkg = path.join(app.root, app.name)
  const page = path.join(pkg, 'www', `${route.slice(1)}.py`)
  const hooks = path.join(pkg, 'hooks.py')

  /** @type {AppChange[]} */
  const changes = []
  changes.push(
    fs.existsSync(page)
      ? { file: page, action: 'keep', summary: KEPT }
      : {
          file: page,
          action: 'create',
          summary: 'new page that serves the frontend',
          content: PAGE,
        },
  )

  const rule = addRouteRule(fs.readFileSync(hooks, 'utf8'), route)
  if (rule.status === 'present') {
    changes.push({ file: hooks, action: 'keep', summary: KEPT })
  } else if (rule.status === 'added') {
    changes.push({
      file: hooks,
      action: 'update',
      summary: 'add a route rule',
      content: rule.source,
    })
  } else {
    changes.push({
      file: hooks,
      action: 'manual',
      summary: "can't be edited safely. Add this rule to website_route_rules:",
      snippet: rule.snippet,
    })
  }

  changes.push(planRootPackage(app, frontend, pm), planGitignore(app, route))
  return changes
}

const KEPT = 'already set up, not changed'

/**
 * bench installs an app's node packages and runs its `build` script from the
 * `package.json` in the app folder, so a deploy only builds the frontend when
 * that file points to it.
 *
 * @param {FrappeApp} app
 * @param {string} frontend
 * @param {PackageManager} pm
 * @returns {AppChange}
 */
function planRootPackage(app, frontend, pm) {
  const file = path.join(app.root, 'package.json')
  const cd = `cd ${quote(frontend)} && `
  const scripts = {
    postinstall: `${cd}${pm} install`,
    dev: `${cd}${runCommand(pm, 'dev')}`,
    build: `${cd}${runCommand(pm, 'build')}`,
  }
  if (!fs.existsSync(file)) {
    return {
      file,
      action: 'create',
      // bench always has npm and yarn, but the servers that build the app may
      // not have the others.
      summary:
        pm === 'npm' || pm === 'yarn'
          ? 'lets bench install and build the frontend'
          : `lets bench install and build the frontend, with ${pm}. Servers that build this app need ${pm} too.`,
      content: JSON.stringify({ private: true, scripts }, null, 2) + '\n',
    }
  }

  // The rest of this file is the app's own, so it is only ever read here.
  let build
  try {
    build = JSON.parse(fs.readFileSync(file, 'utf8')).scripts?.build
  } catch {
    build = undefined
  }
  if (typeof build === 'string' && mentionsFolder(build, frontend)) {
    return { file, action: 'keep', summary: KEPT }
  }
  return {
    file,
    action: 'manual',
    summary:
      typeof build === 'string'
        ? `has a build script that doesn't build ${frontend}/. Merge these scripts into it, so bench builds the frontend:`
        : 'has no build script. Add these scripts, so bench builds the frontend:',
    snippet: JSON.stringify(scripts, null, 2)
      .slice(2, -2)
      .replace(/^ {2}/gm, ''),
  }
}

/**
 * Whether a script runs something in `folder`, such as `cd frontend && yarn
 * build` or `npm --prefix frontend run build`.
 *
 * @param {string} script
 * @param {string} folder
 */
function mentionsFolder(script, folder) {
  return script
    .split(/[\s"'=]+/)
    .some((word) => word.replace(/^\.\/|\/$/g, '') === folder)
}

/**
 * The build writes into the app, so git should skip what it writes.
 *
 * @param {FrappeApp} app
 * @param {string} route
 * @returns {AppChange}
 */
function planGitignore(app, route) {
  const file = path.join(app.root, '.gitignore')
  const source = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  const present = new Set(source.split('\n').map((line) => line.trim()))
  const missing = [
    `${app.name}/public/frontend`,
    `${app.name}/www${route}.html`,
  ].filter((line) => !present.has(line))
  if (missing.length === 0) return { file, action: 'keep', summary: KEPT }

  const block = ['# Built by the frontend', ...missing].join('\n')
  return {
    file,
    action: source ? 'update' : 'create',
    summary: 'ignore the build output',
    content: source.trim() ? `${source.trimEnd()}\n\n${block}\n` : `${block}\n`,
  }
}

/** @param {AppChange[]} changes */
export function applyAppChanges(changes) {
  for (const change of changes) {
    if (change.content === undefined) continue
    fs.mkdirSync(path.dirname(change.file), { recursive: true })
    fs.writeFileSync(change.file, change.content)
  }
}

const PAGE = `import frappe

no_cache = 1


def get_context(context):
	# The frontend reads these as globals on \`window\`. frappe-ui sends
	# csrf_token with every request.
	context.boot = {
		"csrf_token": frappe.sessions.get_csrf_token(),
		"user": frappe.session.user,
	}
`

/**
 * Adds the route rule for `route` to the `website_route_rules` in a `hooks.py`
 * source. Running it again on its own output changes nothing.
 *
 * @param {string} source
 * @param {string} route
 * @returns {{ status: 'present' } | { status: 'added', source: string } | { status: 'manual', snippet: string }}
 */
export function addRouteRule(source, route) {
  const fromRoute = `${route}/<path:app_path>`
  // A rule that is commented out doesn't count.
  const code = source
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'))
    .join('\n')
  if (code.includes(`"${fromRoute}"`) || code.includes(`'${fromRoute}'`)) {
    return { status: 'present' }
  }

  const rule = `{"from_route": "${fromRoute}", "to_route": "${route.slice(1)}"},`
  // Frappe indents Python with tabs. Follow the file only when its code is
  // indented with spaces.
  const indent = /^ +\S/m.test(source) && !/^\t/m.test(source) ? '    ' : '\t'
  const manual = { status: /** @type {const} */ ('manual'), snippet: rule }

  const assignments = source.match(/^website_route_rules\b/gm) ?? []
  if (assignments.length === 0) {
    const block = [
      `# Load the frontend on every path under ${route}`,
      'website_route_rules = [',
      `${indent}${rule}`,
      ']',
    ].join('\n')
    return { status: 'added', source: `${source.trimEnd()}\n\n${block}\n` }
  }

  // Anything other than one plain list assignment, such as a list built by a
  // function or extended with +=, is not ours to edit.
  const list = /^website_route_rules(\s*:[^=\n]+)?\s*=\s*\[/m.exec(source)
  if (assignments.length > 1 || !list) return manual
  const open = list.index + list[0].length - 1
  const close = findClosingBracket(source, open)
  if (close === -1) return manual

  const body = source.slice(open + 1, close)
  if (body.trim() === '') {
    const replacement = `[\n${indent}${rule}\n]`
    return {
      status: 'added',
      source: source.slice(0, open) + replacement + source.slice(close + 1),
    }
  }

  // Only a list whose `]` sits on its own line takes a new line safely.
  const closeLine = source.lastIndexOf('\n', close - 1) + 1
  if (source.slice(closeLine, close).trim() !== '') return manual

  const before = source.slice(0, closeLine).trimEnd()
  const lastLine = before.slice(before.lastIndexOf('\n') + 1)
  const needsComma = !before.endsWith(',') && !before.endsWith('[')
  // A trailing comment would swallow the comma.
  if (needsComma && lastLine.includes('#')) return manual

  const itemIndent = /\n([ \t]+)\S/.exec(body)?.[1] ?? indent
  return {
    status: 'added',
    source:
      before +
      (needsComma ? ',' : '') +
      `\n${itemIndent}${rule}\n` +
      source.slice(closeLine),
  }
}

/**
 * Returns the index of the bracket that closes the one at `open`, skipping
 * strings and comments, or -1 when there is none.
 *
 * @param {string} source
 * @param {number} open
 */
function findClosingBracket(source, open) {
  let depth = 0
  for (let i = open; i < source.length; i++) {
    const char = source[i]
    if (char === '#') {
      const end = source.indexOf('\n', i)
      if (end === -1) return -1
      i = end
    } else if (char === '"' || char === "'") {
      const quote = source.startsWith(char.repeat(3), i) ? char.repeat(3) : char
      let j = i + quote.length
      while (j < source.length && !source.startsWith(quote, j)) {
        j += source[j] === '\\' ? 2 : 1
      }
      if (j >= source.length) return -1
      i = j + quote.length - 1
    } else if ('([{'.includes(char)) {
      depth++
    } else if (')]}'.includes(char)) {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}
