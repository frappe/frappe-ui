#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import process from 'process'
import readline from 'readline/promises'
import { fileURLToPath } from 'url'

const USAGE = `Usage:
  npm create frappe-ui@latest [directory] [options]
  npx create-frappe-ui@latest [directory] [options]

Options:
  --frappe        Configure the project for a Frappe backend.
  --no-frappe     Create a plain Vite + Vue project.
  --route <path>  Base route for the Frappe frontend. Defaults to /frontend.
  --force, -f     Overwrite matching files in a non-empty directory.
  --help, -h      Show this help message.`

const TEMPLATE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'template',
)
const BASE_TEMPLATE_DIR = path.join(TEMPLATE_ROOT, 'base')
const FRAPPE_TEMPLATE_DIR = path.join(TEMPLATE_ROOT, 'frappe')
const PLAIN_TEMPLATE_DIR = path.join(TEMPLATE_ROOT, 'plain')

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    console.log(USAGE)
    return
  }

  await promptForMissingOptions(options)

  const targetDir = path.resolve(process.cwd(), options.directory || 'frontend')
  if (options.frappe) {
    ensureFrappeTargetDir(targetDir)
  }

  ensureTargetDir(targetDir, options.force)
  const context = {
    baseRoute: options.route,
    baseRouteCode: JSON.stringify(options.route),
    projectName: toPackageName(path.basename(targetDir)),
    routerBase: toRouterBase(options.route),
    routerBaseCode: JSON.stringify(toRouterBase(options.route)),
  }
  copyTemplate(BASE_TEMPLATE_DIR, targetDir, context)
  copyTemplate(
    options.frappe ? FRAPPE_TEMPLATE_DIR : PLAIN_TEMPLATE_DIR,
    targetDir,
    context,
  )

  const relativeTarget = formatTargetDir(targetDir)
  const packageManager = detectPackageManager()

  console.log(`\nCreated a Frappe UI app in ${relativeTarget}\n`)
  console.log('Next steps:')
  if (relativeTarget !== '.') {
    console.log(`  cd ${quotePath(relativeTarget)}`)
  }
  console.log(`  ${packageManager} install`)
  console.log(`  ${packageManager} run dev`)
}

function parseArgs(args) {
  const options = {
    directory: '',
    frappe: null,
    force: false,
    help: false,
    route: '',
  }

  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }
    if (arg === '--frappe') {
      options.frappe = true
      continue
    }
    if (arg === '--no-frappe') {
      options.frappe = false
      continue
    }
    if (arg === '--route') {
      const route = args[index + 1]
      if (!route || route.startsWith('-')) {
        fail('--route requires a route path.')
      }
      options.route = normalizeRoute(route)
      index++
      continue
    }
    if (arg === '--force' || arg === '-f') {
      options.force = true
      continue
    }
    if (arg.startsWith('-')) {
      fail(`Unknown option: ${arg}`)
    }
    if (options.directory) {
      fail(`Unexpected argument: ${arg}`)
    }
    options.directory = arg
  }

  return options
}

async function promptForMissingOptions(options) {
  if (options.frappe !== null && (!options.frappe || options.route)) {
    return
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    if (options.frappe === null) {
      options.frappe = false
    }
    if (options.frappe && !options.route) {
      options.route = '/frontend'
    }
    return
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    if (options.frappe === null) {
      options.frappe = await confirm(
        rl,
        'Configure this project with a Frappe backend?',
        false,
      )
    }
    if (options.frappe && !options.route) {
      options.route = normalizeRoute(
        await ask(rl, 'Base route for the frontend', '/frontend'),
      )
    }
  } finally {
    rl.close()
  }

  if (options.frappe && !options.route) {
    options.route = '/frontend'
  }
}

function ensureTargetDir(targetDir, force) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
    return
  }

  const files = fs.readdirSync(targetDir)
  if (files.length > 0 && !force) {
    fail(
      `${targetDir} is not empty. Choose another directory or rerun with --force.`,
    )
  }
}

function ensureFrappeTargetDir(targetDir) {
  const parts = path.resolve(targetDir).split(path.sep)
  const appsIndex = parts.lastIndexOf('apps')
  const appName = appsIndex >= 0 ? parts[appsIndex + 1] : ''
  const frontendFolder = appsIndex >= 0 ? parts.slice(appsIndex + 2) : []

  if (!appName || frontendFolder.length !== 1) {
    fail(
      'Frappe backend projects must be created inside apps/<appname>/<folder>.',
    )
  }
}

function copyTemplate(sourceDir, targetDir, context) {
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name)
    const targetName = entry.name === '_gitignore' ? '.gitignore' : entry.name
    const targetPath = path.join(targetDir, targetName)

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true })
      copyTemplate(sourcePath, targetPath, context)
      continue
    }

    const contents = fs
      .readFileSync(sourcePath, 'utf8')
      .replaceAll('__PROJECT_NAME__', context.projectName)
      .replaceAll('__BASE_ROUTE__', context.baseRoute)
      .replaceAll('__BASE_ROUTE_CODE__', context.baseRouteCode)
      .replaceAll('__ROUTER_BASE__', context.routerBase)
      .replaceAll('__ROUTER_BASE_CODE__', context.routerBaseCode)
    fs.writeFileSync(targetPath, contents)
  }
}

function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || ''
  if (userAgent.startsWith('yarn')) return 'yarn'
  if (userAgent.startsWith('pnpm')) return 'pnpm'
  if (userAgent.startsWith('bun')) return 'bun'
  return 'npm'
}

function toPackageName(name) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/^[._]+/, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return normalized || 'frappe-ui-app'
}

async function confirm(rl, message, defaultValue) {
  const suffix = defaultValue ? 'Y/n' : 'y/N'
  const answer = (await rl.question(`${message} (${suffix}) `))
    .trim()
    .toLowerCase()
  if (!answer) return defaultValue
  return answer === 'y' || answer === 'yes'
}

async function ask(rl, message, defaultValue) {
  const answer = (await rl.question(`${message} (${defaultValue}) `)).trim()
  return answer || defaultValue
}

function normalizeRoute(route) {
  let normalized = route.trim()
  if (!normalized) return '/frontend'
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }
  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, '')
  }
  return normalized
}

function toRouterBase(route) {
  return route === '/' ? '/' : `${route}/`
}

function formatTargetDir(targetDir) {
  const relativePath = path.relative(process.cwd(), targetDir) || '.'
  if (relativePath === '.' || !relativePath.startsWith('..')) {
    return relativePath
  }
  return targetDir
}

function quotePath(value) {
  if (/^[A-Za-z0-9._/-]+$/.test(value)) {
    return value
  }
  return JSON.stringify(value)
}

function fail(message) {
  console.error(`create-frappe-ui: ${message}\n`)
  console.error(USAGE)
  process.exit(1)
}
