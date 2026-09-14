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
    const source = `<script setup>\nimport Icon from './Icon.vue'\n</script>\n<template><Icon name="sprite-name" /></template>`
    expect(migrateBaseProps(source).migrated).toBe(source)
  })

  it('combines Progress boolean mode and interval count', () => {
    const source = `<template>\n  <Progress :intervals="true" :interval-count="steps.length" />\n  <Progress intervals interval-count="5" />\n  <Progress :intervals="enabled" :interval-count="count" />\n</template>`
    expect(migrateBaseProps(source).migrated).toBe(
      `<template>\n  <Progress :intervals="steps.length" />\n  <Progress :intervals="5" />\n  <Progress :intervals="(enabled) ? (count) : undefined" />\n</template>`,
    )
  })

  it('is idempotent for the numeric Progress API', () => {
    const source = `<template><Progress :intervals="steps.length" /></template>`
    const first = migrateBaseProps(source)
    expect(first.migrated).toBe(source)
    expect(first.changes).toHaveLength(0)
  })

  it('refuses an ambiguous dynamic Progress boolean', () => {
    const source = `<template><Progress :intervals="showSteps" /></template>`
    const result = migrateBaseProps(source)
    expect(result.migrated).toBe(source)
    expect(result.refusals[0].message).toContain(
      'may still be the v0 boolean mode',
    )
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
})
