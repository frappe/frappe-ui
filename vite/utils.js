import path from 'path'
import fs from 'fs'

export function getConfig() {
  let configPath = path.join(process.cwd(), 'frappeui.json')
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath))
  }
}

export function getCommonSiteConfig() {
  const benchPath = findBenchPath()
  if (!benchPath) {
    return null
  }

  let configPath = path.join(benchPath, 'sites', 'common_site_config.json')
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath))
  }

  return null
}

const warnedBenchPaths = new Set()

export function findBenchPath() {
  let currentDir = path.resolve('.')
  while (currentDir !== path.dirname(currentDir)) {
    if (isBench(currentDir)) {
      return currentDir
    }
    currentDir = path.dirname(currentDir)
  }

  // An app linked into apps/ from elsewhere has no bench above it. Tools that
  // link it, such as `pilot dev`, set FRAPPE_BENCH_PATH to the bench.
  if (process.env.FRAPPE_BENCH_PATH) {
    const benchPath = path.resolve(process.env.FRAPPE_BENCH_PATH)
    if (!isBench(benchPath) && !warnedBenchPaths.has(benchPath)) {
      warnedBenchPaths.add(benchPath)
      console.warn(
        `FRAPPE_BENCH_PATH is ${benchPath}, which has no apps/ and sites/ folders`,
      )
    }
    return benchPath
  }
  return null
}

export function findAppsFolder() {
  const benchPath = findBenchPath()
  if (!benchPath) {
    return null
  }

  return path.join(benchPath, 'apps')
}

export function findAppName() {
  const appsFolder = findAppsFolder()
  if (!appsFolder) {
    return null
  }

  // Walk up from cwd until we find a directory whose parent is the apps folder
  let currentDir = path.resolve('.')
  while (currentDir !== path.dirname(currentDir)) {
    const parent = path.dirname(currentDir)
    if (path.resolve(parent) === path.resolve(appsFolder)) {
      return path.basename(currentDir)
    }
    currentDir = parent
  }

  return findLinkedAppName(appsFolder)
}

// Matches apps by real path, so an app symlinked into apps/ from elsewhere is
// found too.
function findLinkedAppName(appsFolder) {
  let names
  try {
    names = fs.readdirSync(appsFolder)
  } catch {
    return null
  }

  const apps = new Map(
    names.map((name) => [realPath(path.join(appsFolder, name)), name]),
  )
  let currentDir = realPath(path.resolve('.'))
  while (currentDir !== path.dirname(currentDir)) {
    if (apps.has(currentDir)) {
      return apps.get(currentDir)
    }
    currentDir = path.dirname(currentDir)
  }

  return null
}

function isBench(dir) {
  return (
    fs.existsSync(path.join(dir, 'sites')) &&
    fs.existsSync(path.join(dir, 'apps'))
  )
}

function realPath(filePath) {
  try {
    return fs.realpathSync(filePath)
  } catch {
    return filePath
  }
}

export async function getInstalledAppSites(appName) {
  const { execFile } = await import('node:child_process')
  const { promisify } = await import('node:util')
  const execFileAsync = promisify(execFile)

  const benchPath = findBenchPath()
  if (!benchPath) {
    return []
  }

  let stdout
  try {
    const result = await execFileAsync('bench', ['list-app-sites', appName], {
      cwd: benchPath,
    })
    stdout = result.stdout
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`Could not run 'bench list-app-sites': ${message}`)
    return []
  }

  const sitePattern = /^[a-z0-9.-]+$/i

  return Array.from(
    new Set(
      stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(
          (line) =>
            Boolean(line) && sitePattern.test(line) && line.includes('.'),
        ),
    ),
  )
}
