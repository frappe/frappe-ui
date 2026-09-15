import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { migrateData } from './migrate-data-v1.js'

const SCRIPT = fileURLToPath(new URL('./migrate-data-v1.js', import.meta.url))
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0))
    fs.rmSync(dir, { recursive: true, force: true })
})

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'data-v1-'))
  tempDirs.push(dir)
  for (const [name, content] of Object.entries(files))
    fs.writeFileSync(path.join(dir, name), content)
  return dir
}

describe('data migration', () => {
  it('narrows an object resources option to true', () => {
    const source = `import { FrappeUI } from 'frappe-ui'\nconst app = createApp(App)\napp.use(FrappeUI, { resources: { todos } })\n`
    const result = migrateData(source, 'main.ts')

    expect(result.migrated).toBe(
      `import { FrappeUI } from 'frappe-ui'\nconst app = createApp(App)\napp.use(FrappeUI, { resources: true })\n`,
    )
    expect(result.changes).toHaveLength(1)
    expect(result.refusals).toHaveLength(0)
  })

  it('narrows an empty object, which the plugin also read as on', () => {
    const source = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources: {} })\n`
    expect(migrateData(source, 'main.js').migrated).toContain(
      'resources: true',
    )
  })

  it('keeps other options and multiline objects intact', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `app.use(FrappeUI, {`,
      `  resources: {`,
      `    todos: { url: '/api' },`,
      `  },`,
      `  other: 1,`,
      `})`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(
      [
        `import { FrappeUI } from 'frappe-ui'`,
        `app.use(FrappeUI, {`,
        `  resources: true,`,
        `  other: 1,`,
        `})`,
        ``,
      ].join('\n'),
    )
  })

  it('follows an import alias and a namespace import', () => {
    const aliased = `import { FrappeUI as Plugin } from 'frappe-ui'\napp.use(Plugin, { resources: { a } })\n`
    expect(migrateData(aliased, 'main.ts').migrated).toContain(
      'resources: true',
    )

    const namespaced = `import * as ui from 'frappe-ui'\napp.use(ui.FrappeUI, { resources: { a } })\n`
    expect(migrateData(namespaced, 'main.ts').migrated).toContain(
      'resources: true',
    )
  })

  it('ignores a plugin of the same name from another package', () => {
    const source = `import { FrappeUI } from './my-plugin'\napp.use(FrappeUI, { resources: { a } })\n`
    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a locally shadowed binding alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `function setup() {`,
      `  const FrappeUI = otherPlugin`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a catch parameter that shadows the import alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `try {`,
      `  boot()`,
      `} catch (FrappeUI) {`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a binding declared in a bare block alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `{`,
      `  const FrappeUI = otherPlugin`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a for…of loop variable that shadows the import alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `for (const FrappeUI of plugins) {`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a for…in loop variable that shadows the import alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `for (const FrappeUI in plugins) {`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a binding declared in a braceless case clause alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `switch (mode) {`,
      `  case 'custom':`,
      `    const FrappeUI = otherPlugin`,
      `    app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a named function expression that shadows the import alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `const install = function FrappeUI() {`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('leaves a binding declared in a namespace body alone', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `namespace setup {`,
      `  const FrappeUI = otherPlugin`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      ``,
    ].join('\n')

    expect(migrateData(source, 'main.ts').migrated).toBe(source)
  })

  it('still migrates a sibling scope that does not shadow the import', () => {
    const source = [
      `import { FrappeUI } from 'frappe-ui'`,
      `function shadowed() {`,
      `  const FrappeUI = otherPlugin`,
      `  app.use(FrappeUI, { resources: { a } })`,
      `}`,
      `function plain() {`,
      `  app.use(FrappeUI, { resources: { b } })`,
      `}`,
      ``,
    ].join('\n')

    const result = migrateData(source, 'main.ts')
    expect(result.changes).toHaveLength(1)
    expect(result.migrated).toContain(`  app.use(FrappeUI, { resources: { a } })`)
    expect(result.migrated).toContain(`  app.use(FrappeUI, { resources: true })`)
  })

  it('migrates inside a Vue script setup block', () => {
    const source = `<script setup lang="ts">\nimport { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources: { a } })\n</script>\n<template><div /></template>\n`
    expect(migrateData(source, 'Main.vue').migrated).toContain(
      'resources: true',
    )
  })

  it('is idempotent', () => {
    const source = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources: { a } })\n`
    const first = migrateData(source, 'main.ts')
    const second = migrateData(first.migrated, 'main.ts')

    expect(second.migrated).toBe(first.migrated)
    expect(second.changes).toHaveLength(0)
  })

  it('leaves a boolean option and a plugin installed with no options alone', () => {
    const source = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI)\napp.use(FrappeUI, { resources: true })\napp.use(FrappeUI, { resources: false })\n`
    const result = migrateData(source, 'main.ts')

    expect(result.migrated).toBe(source)
    expect(result.refusals).toHaveLength(0)
  })

  it('refuses a variable resources value and leaves the file unchanged', () => {
    const source = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources })\napp.use(FrappeUI, { resources: config.resources })\n`
    const result = migrateData(source, 'main.ts')

    expect(result.migrated).toBe(source)
    expect(result.refusals).toHaveLength(2)
    expect(result.refusals[0].message).toContain('bound to a variable')
    expect(result.refusals[0].line).toBe(2)
    expect(result.refusals[1].message).toContain('cannot read')
  })

  it('refuses an options object it cannot see into', () => {
    const spread = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { ...options })\n`
    expect(migrateData(spread, 'main.ts').refusals[0].message).toContain(
      'spreads another value',
    )

    const computed = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { [key]: { a } })\n`
    expect(migrateData(computed, 'main.ts').refusals[0].message).toContain(
      'computed key',
    )

    const opaque = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, options)\n`
    expect(migrateData(opaque, 'main.ts').refusals[0].message).toContain(
      'options this codemod cannot read',
    )
  })

  it('reports an unparsable Vue file instead of rewriting it', () => {
    const source = `<script setup>\nimport { FrappeUI } from 'frappe-ui'\n</script>\n<template><div></template>\n`
    const result = migrateData(source, 'Broken.vue')

    expect(result.migrated).toBe(source)
    expect(result.refusals[0].message).toContain('could not be parsed')
  })

  it('supports dry runs and writes normal runs', () => {
    const files = {
      'main.ts': `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources: { a } })\n`,
    }
    const dir = tempDir(files)

    const dry = spawnSync(process.execPath, [SCRIPT, '--dry-run', dir], {
      encoding: 'utf8',
    })
    expect(dry.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'main.ts'), 'utf8')).toContain(
      'resources: { a }',
    )

    const write = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })
    expect(write.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'main.ts'), 'utf8')).toContain(
      'resources: true',
    )
  })

  it('reports that a refused file is left unchanged', () => {
    const source = `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources })\n`
    const dir = tempDir({ 'main.ts': source })
    const result = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('affected files were left unchanged')
    expect(fs.readFileSync(path.join(dir, 'main.ts'), 'utf8')).toBe(source)
  })

  it('runs through an installed-style binary symlink', () => {
    const dir = tempDir({
      'main.ts': `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources: { a } })\n`,
    })
    const bin = path.join(dir, 'data-v1')
    fs.symlinkSync(SCRIPT, bin)

    const result = spawnSync(process.execPath, [bin, dir], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'main.ts'), 'utf8')).toContain(
      'resources: true',
    )
  })

  it('does not follow target symlinks', () => {
    const outside = tempDir({
      'outside.ts': `import { FrappeUI } from 'frappe-ui'\napp.use(FrappeUI, { resources: { a } })\n`,
    })
    const dir = tempDir({})
    fs.symlinkSync(outside, path.join(dir, 'linked'), 'dir')

    const result = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(outside, 'outside.ts'), 'utf8')).toContain(
      'resources: { a }',
    )
  })

  it('runs with only the dependencies the package ships', () => {
    const declared = JSON.parse(
      fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
    )
    const imports = fs
      .readFileSync(SCRIPT, 'utf8')
      .matchAll(/^import .* from '([^']+)'$/gm)

    for (const [, specifier] of imports) {
      if (specifier.startsWith('node:') || specifier.startsWith('.')) continue
      expect(
        declared.dependencies?.[specifier] ?? declared.peerDependencies?.[specifier],
      ).toBeDefined()
    }
    expect(declared.bin['data-v1']).toBe('./scripts/migrate-data-v1.js')
    // A bin whose file is not published installs as a broken symlink.
    expect(declared.files).toContain('scripts/migrate-data-v1.js')
  })
})
