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

export function findBenchPath() {
  // Set by a bench manager when the app lives outside the bench and is linked
  // into apps/, so no bench folder sits above it (for example `pilot dev`).
  if (process.env.FRAPPE_BENCH_PATH) {
    return path.resolve(process.env.FRAPPE_BENCH_PATH)
  }

  let currentDir = path.resolve('.')
  while (currentDir !== '/') {
    if (
      fs.existsSync(path.join(currentDir, 'sites')) &&
      fs.existsSync(path.join(currentDir, 'apps'))
    ) {
      return currentDir
    }
    currentDir = path.resolve(currentDir, '..')
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

  // Walk up from cwd until we reach an app in the apps folder. Apps are matched
  // by real path, so an app symlinked into apps/ from elsewhere is found too.
  const apps = new Map(
    fs
      .readdirSync(appsFolder)
      .map((name) => [realPath(path.join(appsFolder, name)), name]),
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
