import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { migrateEditor } from './migrate-editor-v1.js'

const SCRIPT = fileURLToPath(new URL('./migrate-editor-v1.js', import.meta.url))
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'editor-v1-'))
  tempDirs.push(dir)
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content)
  }
  return dir
}

function run(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' })
}

describe('editor v1 migration', () => {
  it('renames static, bound, and shorthand EditorFixedMenu props', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template>\n  <EditorFixedMenu button-size="sm" />\n  <EditorFixedMenu :button-size="menuSize" />\n  <EditorFixedMenu :buttonSize />\n</template>\n`

    const result = migrateEditor(source, 'Menus.vue')

    expect(result.refusals).toEqual([])
    expect(result.migrated).toContain('<EditorFixedMenu size="sm" />')
    expect(result.migrated).toContain('<EditorFixedMenu :size="menuSize" />')
    expect(result.migrated).toContain('<EditorFixedMenu :size="buttonSize" />')
  })

  it('preserves the buttonSize expression for kebab-case shorthand', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template>\n  <EditorFixedMenu :button-size />\n  <EditorFixedMenu v-bind:button-size />\n</template>\n`

    const result = migrateEditor(source, 'Shorthand.vue')

    expect(result.migrated).toContain('<EditorFixedMenu :size="buttonSize" />')
    expect(result.migrated).toContain(
      '<EditorFixedMenu v-bind:size="buttonSize" />',
    )
  })

  it('handles multiline tags and greater-than signs inside values', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template>\n  <EditorFixedMenu\n    v-if="count > 1"\n    :button-size="count > 2 ? 'sm' : 'xs'"\n  />\n</template>\n`

    const result = migrateEditor(source, 'Multiline.vue')

    expect(result.refusals).toEqual([])
    expect(result.migrated).toContain(`:size="count > 2 ? 'sm' : 'xs'"`)
  })

  it('only changes attribute names, not values containing button-size text', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template><EditorFixedMenu title="the button-size prop" button-size="sm" /></template>\n`

    const result = migrateEditor(source, 'Literal.vue')

    expect(result.migrated).toContain('title="the button-size prop"')
    expect(result.migrated).toContain(' size="sm"')
  })

  it('handles an aliased import and kebab-case tag', () => {
    const source = `<script setup>\nimport { ref } from 'vue'\nimport { EditorFixedMenu as Toolbar } from 'frappe-ui/editor'\n</script>\n<template><toolbar :button-size="size" /></template>\n`

    expect(migrateEditor(source, 'Toolbar.vue').migrated).toContain(
      '<toolbar :size="size" />',
    )
  })

  it('does not touch a same-name local component', () => {
    const source = `<script setup>\nimport EditorFixedMenu from './EditorFixedMenu.vue'\n</script>\n<template><EditorFixedMenu button-size="sm" /></template>\n`

    const result = migrateEditor(source, 'Local.vue')
    expect(result.migrated).toBe(source)
    expect(result.changed).toBe(false)
  })

  it('refuses object v-bind because the property needs JavaScript context', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template><EditorFixedMenu v-bind="{ buttonSize }" /></template>\n`

    const result = migrateEditor(source, 'Bound.vue')
    expect(result.changed).toBe(false)
    expect(result.refusals[0].message).toContain('object v-bind')
  })

  it('does not mistake a later shorthand prop for part of object v-bind', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template><EditorFixedMenu v-bind="attrs" :buttonSize :items="items" /></template>\n`

    const result = migrateEditor(source, 'Separate.vue')

    expect(result.refusals).toEqual([])
    expect(result.migrated).toContain(
      'v-bind="attrs" :size="buttonSize" :items="items"',
    )
  })

  it('is idempotent', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template><EditorFixedMenu :button-size="menuSize" /></template>\n`
    const once = migrateEditor(source, 'Menu.vue').migrated
    const twice = migrateEditor(once, 'Menu.vue')

    expect(twice.migrated).toBe(once)
    expect(twice.changed).toBe(false)
  })

  it('supports dry-run without writing files', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template><EditorFixedMenu button-size="sm" /></template>\n`
    const dir = tempDir({ 'Menu.vue': source })
    const result = run(['--dry-run', dir])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Would update')
    expect(fs.readFileSync(path.join(dir, 'Menu.vue'), 'utf8')).toBe(source)
  })

  it('writes files in a real run', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template><EditorFixedMenu button-size="sm" /></template>\n`
    const dir = tempDir({ 'Menu.vue': source })
    const result = run([dir])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Updated')
    expect(fs.readFileSync(path.join(dir, 'Menu.vue'), 'utf8')).toContain(
      '<EditorFixedMenu size="sm" />',
    )
  })

  it('exits non-zero and leaves the whole file unchanged on a refusal', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template>\n  <EditorFixedMenu button-size="sm" />\n  <EditorFixedMenu v-bind="{ buttonSize }" />\n</template>\n`
    const dir = tempDir({ 'Menu.vue': source })
    const result = run([dir])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('This file is unchanged')
    expect(fs.readFileSync(path.join(dir, 'Menu.vue'), 'utf8')).toBe(source)
  })

  it('runs through a package-style symlink', () => {
    const source = `<script setup>\nimport { EditorFixedMenu } from 'frappe-ui/editor'\n</script>\n<template><EditorFixedMenu button-size="sm" /></template>\n`
    const dir = tempDir({ 'Menu.vue': source })
    const bin = path.join(dir, 'editor-v1')
    fs.symlinkSync(SCRIPT, bin)

    const result = spawnSync(process.execPath, [bin, dir], { encoding: 'utf8' })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Updated')
  })

  it('rejects unknown options cleanly', () => {
    const result = run(['--dryrun'])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unknown option: --dryrun')
    expect(result.stderr).not.toContain('at Object.statSync')
  })
})
