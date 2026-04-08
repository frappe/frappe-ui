import fs from 'fs'
import path from 'path'

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

  // Walk up from cwd until we find a directory whose parent is the apps folder
  let currentDir = path.resolve('.')
  while (currentDir !== '/') {
    const parent = path.dirname(currentDir)
    if (path.resolve(parent) === path.resolve(appsFolder)) {
      return path.basename(currentDir)
    }
    currentDir = parent
  }

  return null
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
        .filter((line) => Boolean(line) && sitePattern.test(line) && line.includes('.')),
    ),
  )
}
