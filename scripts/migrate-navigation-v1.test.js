import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { migrateNavigation } from './migrate-navigation-v1.js'

const SCRIPT = fileURLToPath(new URL('./migrate-navigation-v1.js', import.meta.url))
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

function tempDir(source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'navigation-v1-'))
  tempDirs.push(dir)
  fs.writeFileSync(path.join(dir, 'Example.vue'), source)
  return dir
}

describe('navigation prop migration', () => {
  it('preserves enabled and disabled SettingsDialog shortcut behavior', () => {
    const source = `<template><SettingsDialog shortcut/><SettingsDialog :shortcut="true"/><SettingsDialog :shortcut="false"/></template>`
    const result = migrateNavigation(source)
    expect(result.refusals).toEqual([])
    expect(result.migrated).toBe(`<template><SettingsDialog /><SettingsDialog /><SettingsDialog :keyboard-shortcut="false"/></template>`)
    expect(migrateNavigation(result.migrated).migrated).toBe(result.migrated)
  })

  it('refuses dynamic boolean shortcut bindings', () => {
    for (const source of [
      `<template><SettingsDialog :shortcut/></template>`,
      `<template><SettingsDialog :shortcut="enabled"/></template>`,
    ]) {
      const result = migrateNavigation(source)
      expect(result.refusals).toEqual([
        expect.objectContaining({ message: expect.stringContaining('dynamic shortcut') }),
      ])
      expect(result.migrated).toBe(source)
    }
  })

  it('renames the rail variant', () => {
    const source = `<template><SidebarRailItem variant="tile"/></template>`
    const result = migrateNavigation(source)
    expect(result.migrated).toBe(`<template><SidebarRailItem variant="subtle"/></template>`)
  })

  it('follows aliases and leaves locally imported components alone', () => {
    const source = `<script setup>import { SettingsDialog as Settings } from 'frappe-ui'; import SidebarRailItem from './local/SidebarRailItem.vue'</script><template><Settings :shortcut="false"/><SidebarRailItem variant="tile"/></template>`
    const result = migrateNavigation(source)
    expect(result.migrated).toContain('<Settings :keyboard-shortcut="false"/>')
    expect(result.migrated).toContain('<SidebarRailItem variant="tile"/>')
  })

  it('refuses duplicate props and opaque spreads without partial changes', () => {
    for (const source of [
      `<template><SettingsDialog shortcut="Mod+K" keyboard-shortcut="Mod+J"/></template>`,
      `<template><SettingsDialog v-bind="settings" shortcut="Mod+K"/></template>`,
    ]) {
      const result = migrateNavigation(source)
      expect(result.refusals.length).toBeGreaterThan(0)
      expect(result.migrated).toBe(source)
    }
  })
})

describe('tab slot migration', () => {
  it('renames shorthand slot bindings and references through v-if', () => {
    const source = `<template><Tabs v-if="ready"><template #tab-label="{ tab, selected, disabled }"><span :class="selected ? 'on' : 'off'">{{ selected && tab.label }}</span></template></Tabs></template>`
    const result = migrateNavigation(source)
    expect(result.refusals).toEqual([])
    expect(result.migrated).toContain('{ tab, active, disabled }')
    expect(result.migrated).toContain(`:class="active ? 'on' : 'off'"`)
    expect(result.migrated).toContain('{{ active && tab.label }}')
  })

  it('renames slot keys while preserving aliased local variables', () => {
    const source = `<template><TabButtons><template #suffix="{ checked: isCurrent }"><span v-if="isCurrent"/></template></TabButtons><TabTrigger><template #default="{ selected: isCurrent }">{{ isCurrent }}</template></TabTrigger></template>`
    const result = migrateNavigation(source)
    expect(result.migrated).toContain('{ active: isCurrent }')
    expect(result.migrated.match(/active: isCurrent/g)).toHaveLength(2)
    expect(result.migrated).toContain('v-if="isCurrent"')
  })

  it('keeps nested lexical bindings and quoted template text intact', () => {
    const source = `<template><Tabs><template #tab-label="{ selected }"><span :title="count > 1 ? '<template>' : ''" :fn="() => { const selected = false; return selected }">{{ selected }}</span></template></Tabs></template><docs>{"selected":"<template>"}</docs>`
    const result = migrateNavigation(source)
    expect(result.migrated).toContain('const selected = false; return selected')
    expect(result.migrated).toContain(`count > 1 ? '<template>' : ''`)
    expect(result.migrated).toContain('<docs>{"selected":"<template>"}</docs>')
    expect(result.migrated).toContain('{{ active }}')
  })

  it('does not rename slots owned by nested components', () => {
    const source = `<template><Tabs><OtherTabs><template #item="{ selected }">{{ selected }}</template></OtherTabs></Tabs></template>`
    const result = migrateNavigation(source)
    expect(result.refusals).toEqual([])
    expect(result.migrated).toBe(source)
  })

  it('refuses duplicate, computed, and rest slot bindings', () => {
    for (const pattern of ['{ selected, active }', '{ [name]: selected }', '{ selected, ...rest }']) {
      const source = `<template><Tabs><template #tab-label="${pattern}">{{ selected }}</template></Tabs></template>`
      const result = migrateNavigation(source)
      expect(result.refusals.length).toBeGreaterThan(0)
      expect(result.migrated).toBe(source)
    }
  })
})

describe('navigation CLI', () => {
  it('runs through an installed-bin symlink and rejects unknown options', () => {
    const dir = tempDir(`<template><SidebarRailItem variant="tile"/></template>`)
    const bin = path.join(dir, 'navigation-v1')
    fs.symlinkSync(SCRIPT, bin)
    const result = spawnSync(process.execPath, [bin, dir], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'Example.vue'), 'utf8')).toContain('subtle')
    const refused = spawnSync(process.execPath, [bin, '--force', dir], { encoding: 'utf8' })
    expect(refused.status).toBe(1)
    expect(refused.stderr).toContain('Unknown option')
  })
})
