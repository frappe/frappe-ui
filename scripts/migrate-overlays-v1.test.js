import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import {
  listOverlayScriptRefusals,
  migrateOverlays,
} from './migrate-overlays-v1.js'

const SCRIPT = fileURLToPath(new URL('./migrate-overlays-v1.js', import.meta.url))
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'overlays-v1-'))
  tempDirs.push(dir)
  for (const [name, source] of Object.entries(files)) {
    const file = path.join(dir, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, source)
  }
  return dir
}

describe('overlay delay migration', () => {
  it('converts static second values and leaves millisecond values idempotent', () => {
    const source = `<template><Tooltip hover-delay="0.5"/><TooltipProvider :skip-delay="0.3"><HoverCard :hover-delay="1" :leave-delay="300"/></TooltipProvider></template>`
    const once = migrateOverlays(source)
    expect(once.refusals).toEqual([])
    expect(once.migrated).toContain('hover-delay="500"')
    expect(once.migrated).toContain(':skip-delay="300"')
    expect(once.migrated).toContain(':hover-delay="1000"')
    expect(once.migrated).toContain(':leave-delay="300"')
    expect(migrateOverlays(once.migrated).migrated).toBe(once.migrated)
  })

  it('follows aliases and ignores local same-name components', () => {
    const source = `<script setup>import { Tooltip as Tip } from 'frappe-ui'; import HoverCard from './HoverCard.vue'</script><template><Tip :hover-delay="0.2"/><HoverCard :hover-delay="0.2"/></template>`
    const result = migrateOverlays(source)
    expect(result.migrated).toContain('<Tip :hover-delay="200"/>')
    expect(result.migrated).toContain('<HoverCard :hover-delay="0.2"/>')
  })

  it('refuses dynamic values, duplicate props, and opaque spreads without partial edits', () => {
    for (const source of [
      `<template><Tooltip :hover-delay="delay"/></template>`,
      `<template><Tooltip hover-delay="0.5" :hover-delay="500"/></template>`,
      `<template><Tooltip v-bind="attrs" hover-delay="0.5"/></template>`,
    ]) {
      const result = migrateOverlays(source)
      expect(result.refusals.length).toBeGreaterThan(0)
      expect(result.migrated).toBe(source)
    }
  })
})

describe('overlay control migration', () => {
  it('renames picker toggle controls and keeps binding aliases', () => {
    const source = `<template><DatePicker><template #trigger="{ toggle: togglePicker, displayLabel }"><button @click="togglePicker()">{{ displayLabel }}</button></template></DatePicker></template>`
    const result = migrateOverlays(source)
    expect(result.refusals).toEqual([])
    expect(result.migrated).toContain('{ setOpen: togglePicker, displayLabel, open }')
    expect(result.migrated).toContain('@click="togglePicker(!open)"')
  })

  it('renames shorthand bindings and referenced calls with lexical scope', () => {
    const source = `<template><DateRangePicker v-if="ready"><template #trigger="{ toggle, open }"><button @click="toggle(false)"/><button :fn="() => { const toggle = () => 1; return toggle() }"/></template></DateRangePicker></template>`
    const result = migrateOverlays(source)
    expect(result.refusals).toEqual([])
    expect(result.migrated).toContain('#trigger="{ setOpen, open }"')
    expect(result.migrated).toContain('@click="setOpen(false)"')
    expect(result.migrated).toContain('const toggle = () => 1; return toggle()')
  })

  it('refuses Popover trigger toggles, nonliteral setter arguments, and opaque slot patterns', () => {
    for (const source of [
      `<template><Popover><template #trigger="{ toggle, open }"><button @click="toggle"/></template></Popover></template>`,
      `<template><TimePicker><template #trigger="{ toggle }"><button @click="toggle(next)"/></template></TimePicker></template>`,
      `<template><DatePicker><template #trigger="{ toggle, ...controls }"><button @click="toggle()"/></template></DatePicker></template>`,
    ]) {
      const result = migrateOverlays(source)
      expect(result.refusals.length).toBeGreaterThan(0)
      expect(result.migrated).toBe(source)
    }
  })

  it('preserves quoted greater-than text, comments, and custom blocks', () => {
    const source = `<template><DatePicker><template #trigger="{ toggle }"><button :title="score > 1 ? '<template>' : 'x'" @click="toggle()"/></template></DatePicker></template><i18n>{"sample":"<template #trigger=\\"{ toggle }\\">"}</i18n>`
    const result = migrateOverlays(source)
    expect(result.refusals).toEqual([])
    expect(result.migrated).toContain(`:title="score > 1 ? '<template>' : 'x'"`)
    expect(result.migrated).toContain('<i18n>{"sample":"<template #trigger=\\"{ toggle }\\">"}</i18n>')
  })

  it('lists render-function controls without matching strings or comments', () => {
    const source = `
      import { h } from 'vue'
      import { DatePicker } from 'frappe-ui'
      // toggle in a comment is not the reason this is listed
      const prose = 'togglePopover in a string'
      export const render = () => h(DatePicker, null, {
        trigger: ({ toggle }) => h('button', { onClick: toggle })
      })
    `
    expect(listOverlayScriptRefusals(source)).toEqual([
      expect.objectContaining({
        message: expect.stringContaining('render-function DatePicker'),
      }),
    ])
    expect(
      listOverlayScriptRefusals(
        `const prose = 'DatePicker toggle togglePopover' // Tooltip toggle`,
      ),
    ).toEqual([])
  })
})

describe('picker prop and CLI migration', () => {
  it('renames allowCustomTime and preserves same-name shorthand bindings', () => {
    const source = `<template><DateTimePicker :allow-custom-time/><DateTimePicker allow-custom-time/></template>`
    const result = migrateOverlays(source)
    expect(result.migrated).toContain(':typeable="allowCustomTime"')
    expect(result.migrated).toContain('<DateTimePicker typeable/>')
  })

  it('runs through a symlink and leaves refused files unchanged', () => {
    const dir = tempDir({ 'Good.vue': `<template><Tooltip hover-delay="0.5"/></template>` })
    const bin = path.join(dir, 'overlays-v1')
    fs.symlinkSync(SCRIPT, bin)
    const run = spawnSync(process.execPath, [bin, dir], { encoding: 'utf8' })
    expect(run.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'Good.vue'), 'utf8')).toContain('500')

    const refused = tempDir({ 'Bad.vue': `<template><Tooltip :hover-delay="delay"/></template>` })
    const failed = spawnSync(process.execPath, [SCRIPT, refused], { encoding: 'utf8' })
    expect(failed.status).toBe(1)
    expect(failed.stderr).toContain('left unchanged')
    expect(fs.readFileSync(path.join(refused, 'Bad.vue'), 'utf8')).toContain('delay')
  })
})
