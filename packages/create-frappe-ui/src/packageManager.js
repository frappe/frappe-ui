// @ts-check
import { spawn } from 'node:child_process'

/** @typedef {'npm' | 'yarn' | 'pnpm' | 'bun'} PackageManager */

/**
 * The package manager that ran this command, read from the user agent it sets,
 * such as `pnpm/9.12.0 npm/? node/v22.11.0 darwin arm64`.
 *
 * @param {string | undefined} userAgent
 * @returns {PackageManager}
 */
export function detectPackageManager(userAgent) {
  const name = userAgent?.split('/')[0]
  return name === 'yarn' || name === 'pnpm' || name === 'bun' ? name : 'npm'
}

/**
 * @param {PackageManager} pm
 * @param {string} script
 */
export function runCommand(pm, script) {
  return pm === 'npm' || pm === 'bun' ? `${pm} run ${script}` : `${pm} ${script}`
}

/**
 * Installs dependencies in `cwd`. Resolves with the combined output, so a
 * failure can show why.
 *
 * @param {PackageManager} pm
 * @param {string} cwd
 * @returns {Promise<{ ok: boolean, output: string }>}
 */
export function install(pm, cwd) {
  return new Promise((resolve) => {
    let output = ''
    const child = spawn(pm, ['install'], {
      cwd,
      shell: process.platform === 'win32',
      env: { ...process.env, npm_config_loglevel: 'error' },
    })
    child.stdout.on('data', (chunk) => (output += chunk))
    child.stderr.on('data', (chunk) => (output += chunk))
    child.on('error', (error) => resolve({ ok: false, output: error.message }))
    child.on('close', (code) => resolve({ ok: code === 0, output }))
  })
}
