import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const CLI_PATH = path.join(PACKAGE_ROOT, 'bin', 'create-frappe-ui.js')

test('creates a plain TypeScript starter with the full frappe-ui API', (t) => {
  const workspace = makeWorkspace(t)
  const targetDir = path.join(workspace, 'plain-app')

  const result = runCli([targetDir, '--no-frappe'])

  assert.equal(result.status, 0, result.stderr)
  assert.equal(
    fs.existsSync(path.join(targetDir, 'src', 'frappe-ui.d.ts')),
    false,
  )

  const packageJson = readJson(path.join(targetDir, 'package.json'))
  assert.equal(packageJson.scripts.build, 'vite build')
  assert.equal(packageJson.devDependencies['vue-tsc'], undefined)
  assert.equal(packageJson.engines.node, '^20.19.0 || >=22.12.0')

  const tsconfig = readJson(path.join(targetDir, 'tsconfig.json'))
  assert.equal(tsconfig.compilerOptions.paths, undefined)
})

test('escapes the Frappe route in generated TypeScript', (t) => {
  const workspace = makeWorkspace(t)
  const targetDir = path.join(workspace, 'apps', 'todo', 'frontend')
  const route = "/desk/foo'bar\\baz"

  const result = runCli([targetDir, '--frappe', '--route', route])

  assert.equal(result.status, 0, result.stderr)
  const routeCode = JSON.stringify(route)
  const routerBaseCode = JSON.stringify(`${route}/`)
  assert.match(
    readFile(path.join(targetDir, 'vite.config.ts')),
    new RegExp(`frontendRoute: ${escapeRegExp(routeCode)}`),
  )
  assert.match(
    readFile(path.join(targetDir, 'src', 'router.ts')),
    new RegExp(`createWebHistory\\(${escapeRegExp(routerBaseCode)}\\)`),
  )
})

test('rejects Frappe projects nested more than one level below the app', (t) => {
  const workspace = makeWorkspace(t)
  const targetDir = path.join(workspace, 'apps', 'todo', 'ui', 'frontend')

  const result = runCli([targetDir, '--frappe', '--route', '/frontend'])

  assert.equal(result.status, 1)
  assert.match(
    result.stderr,
    /must be created inside apps\/<appname>\/<folder>/,
  )
  assert.equal(fs.existsSync(targetDir), false)
})

test('--force overwrites matching template files and preserves other files', (t) => {
  const workspace = makeWorkspace(t)
  const targetDir = path.join(workspace, 'existing-app')
  const packageJsonPath = path.join(targetDir, 'package.json')
  const unrelatedPath = path.join(targetDir, 'notes.txt')
  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(packageJsonPath, '{"private":false}\n')
  fs.writeFileSync(unrelatedPath, 'keep me\n')

  const refused = runCli([targetDir, '--no-frappe'])
  assert.equal(refused.status, 1)
  assert.equal(readFile(packageJsonPath), '{"private":false}\n')

  const forced = runCli([targetDir, '--no-frappe', '--force'])
  assert.equal(forced.status, 0, forced.stderr)
  assert.equal(readJson(packageJsonPath).private, true)
  assert.equal(readFile(unrelatedPath), 'keep me\n')
})

function makeWorkspace(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'create-frappe-ui-'))
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }))
  return directory
}

function runCli(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
  })
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function readJson(filePath) {
  return JSON.parse(readFile(filePath))
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
