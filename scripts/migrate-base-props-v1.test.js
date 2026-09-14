import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { migrateBaseProps } from './migrate-base-props-v1.js'

const SCRIPT = fileURLToPath(
  new URL('./migrate-base-props-v1.js', import.meta.url),
)
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0))
    fs.rmSync(dir, { recursive: true, force: true })
})

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'base-props-v1-'))
  tempDirs.push(dir)
  for (const [name, content] of Object.entries(files))
    fs.writeFileSync(path.join(dir, name), content)
  return dir
}

describe('base props migration', () => {
  it('renames only props on the matching component tags', () => {
    const source = `<template>\n  <Icon name="lucide-star" />\n  <Divider :position="side" />\n  <input name="name" />\n  <Dialog position="top" />\n</template>\n`
    expect(migrateBaseProps(source).migrated).toBe(
      `<template>\n  <Icon icon="lucide-star" />\n  <Divider :align="side" />\n  <input name="name" />\n  <Dialog position="top" />\n</template>\n`,
    )
  })

  it('follows component aliases imported from frappe-ui', () => {
    const source = `<script setup>\nimport { Icon as BaseIcon, Divider as Rule } from 'frappe-ui'\n</script>\n<template><BaseIcon :name="value" /><Rule position="start" /></template>`
    expect(migrateBaseProps(source).migrated).toContain(
      `<template><BaseIcon :icon="value" /><Rule align="start" /></template>`,
    )
  })

  it('handles kebab-case component aliases and quoted greater-than expressions', () => {
    const source = `<script setup>\nimport { Icon as BaseIcon } from 'frappe-ui'\n</script>\n<template><base-icon :name="score > 2 ? chosen : fallback" /></template>`
    expect(migrateBaseProps(source).migrated).toContain(
      `<base-icon :icon="score > 2 ? chosen : fallback" />`,
    )
  })

  it('leaves a locally shadowed component with the same tag name alone', () => {
    const source = `<script setup>\nimport { Icon } from './icons'\n</script>\n<template><Icon name="sprite-name" /></template>`
    expect(migrateBaseProps(source).migrated).toBe(source)
  })

  it('keeps both Icon props and migrates unrelated base props in the file', () => {
    const source = `<template><Icon name="lucide-star" icon="lucide-check" /><Divider position="end" /></template>`
    const result = migrateBaseProps(source)

    expect(result.migrated).toBe(
      `<template><Icon name="lucide-star" icon="lucide-check" /><Divider align="end" /></template>`,
    )
    expect(result.changes).toHaveLength(1)
    expect(result.refusals).toHaveLength(0)
  })

  it('migrates target elements behind structural directives', () => {
    const source = `<template>\n  <Icon v-if="show" name="lucide-x" />\n  <Divider v-else-if="other" position="start" />\n  <template v-if="steps"><Progress intervals interval-count="3" /></template>\n</template>`
    expect(migrateBaseProps(source).migrated).toBe(
      `<template>\n  <Icon v-if="show" icon="lucide-x" />\n  <Divider v-else-if="other" align="start" />\n  <template v-if="steps"><Progress :intervals="3" /></template>\n</template>`,
    )
  })

  it('preserves same-name bindings and the default interval count', () => {
    const source = `<template><Icon :name /><Divider v-bind:position /><Progress intervals /><Progress intervals="true" /><Progress intervals="5" /></template>`
    expect(migrateBaseProps(source).migrated).toBe(
      `<template><Icon :icon="name" /><Divider v-bind:align="position" /><Progress :intervals="6" /><Progress :intervals="6" /><Progress :intervals="5" /></template>`,
    )
  })

  it('combines Progress boolean mode and interval count', () => {
    const source = `<template>\n  <Progress :intervals="true" :interval-count="steps.length" />\n  <Progress intervals interval-count="5" />\n  <Progress :intervals="enabled" :interval-count="count" />\n</template>`
    expect(migrateBaseProps(source).migrated).toBe(
      `<template>\n  <Progress :intervals="steps.length" />\n  <Progress :intervals="5" />\n  <Progress :intervals="(enabled) ? (count) : undefined" />\n</template>`,
    )
  })

  it('removes a disabled Progress interval mode without leaving extra space', () => {
    const source = `<template><Progress :intervals="false" label="Loading" /><Progress :interval-count="5" label="Loading" :intervals="false" /></template>`
    expect(migrateBaseProps(source).migrated).toBe(
      `<template><Progress label="Loading" /><Progress label="Loading" /></template>`,
    )
  })

  it('is idempotent for the numeric Progress API', () => {
    const source = `<template><Progress :intervals="steps.length" /></template>`
    const first = migrateBaseProps(source)
    expect(first.migrated).toBe(source)
    expect(first.changes).toHaveLength(0)
  })

  it('refuses an ambiguous dynamic Progress boolean', () => {
    const source = `<template>\n  <Progress :intervals="showSteps" />\n  <Progress :intervals="intervals" />\n  <Progress :intervals />\n  <Progress intervals="maybe" />\n</template>`
    const result = migrateBaseProps(source)
    expect(result.migrated).toBe(source)
    expect(result.refusals).toHaveLength(4)
    expect(result.refusals[0].message).toContain(
      'may still be the v0 boolean mode',
    )
    expect(result.refusals[3].message).toContain('intervals="maybe"')
  })

  it('cleans spacing when intervalCount precedes intervals', () => {
    const source = `<template><Progress :interval-count="count" :intervals="true" /></template>`
    expect(migrateBaseProps(source).migrated).toBe(
      `<template><Progress :intervals="count" /></template>`,
    )
  })

  it('refuses an orphaned intervalCount and leaves the file unchanged', () => {
    const source = `<template><Progress :interval-count="count" /></template>`
    const result = migrateBaseProps(source)
    expect(result.migrated).toBe(source)
    expect(result.refusals[0].message).toContain('without intervals')
  })

  it('supports dry runs and writes normal runs', () => {
    const dir = tempDir({
      'Example.vue': `<template><Icon name="lucide-x" /></template>`,
    })
    const dry = spawnSync(process.execPath, [SCRIPT, '--dry-run', dir], {
      encoding: 'utf8',
    })
    expect(dry.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'Example.vue'), 'utf8')).toContain(
      ' name=',
    )

    const write = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })
    expect(write.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'Example.vue'), 'utf8')).toContain(
      ' icon=',
    )
  })

  it('reports that a refused file is left unchanged', () => {
    const source = `<template><Icon name="lucide-x" /><Progress :intervals="enabled" /></template>`
    const dir = tempDir({ 'Example.vue': source })
    const result = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('affected files were left unchanged')
    expect(fs.readFileSync(path.join(dir, 'Example.vue'), 'utf8')).toBe(source)
  })

  it('runs through an installed-style binary symlink', () => {
    const dir = tempDir({
      'Example.vue': `<template><Divider position="end" /></template>`,
    })
    const bin = path.join(dir, 'base-props-v1')
    fs.symlinkSync(SCRIPT, bin)
    const result = spawnSync(process.execPath, [bin, dir], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'Example.vue'), 'utf8')).toContain(
      'align="end"',
    )
  })

  it('does not follow target symlinks', () => {
    const outside = tempDir({
      'Outside.vue': `<template><Icon name="lucide-x" /></template>`,
    })
    const dir = tempDir({})
    fs.symlinkSync(outside, path.join(dir, 'linked'), 'dir')

    const result = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(
      fs.readFileSync(path.join(outside, 'Outside.vue'), 'utf8'),
    ).toContain(' name=')
  })
})
