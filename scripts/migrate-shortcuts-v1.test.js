import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import {
  buildCombo,
  importBindings,
  keyToComboPart,
  migrateShortcuts,
  PUNCTUATION_NAMES,
  SHIFTED_CHARS,
} from './migrate-shortcuts-v1.js'

const SCRIPT = fileURLToPath(new URL('./migrate-shortcuts-v1.js', import.meta.url))

const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shortcuts-v1-'))
  tempDirs.push(dir)
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content)
  }
  return dir
}

function run(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' })
}

// A registration wrapped in the call, which is how every app writes one.
const inCall = (object) => `import { useShortcut } from 'frappe-ui'\nuseShortcut([\n  ${object},\n])\n`

describe('combo building', () => {
  it('collapses key + ctrl into a Mod combo', () => {
    expect(buildCombo({ key: 's', ctrl: true })).toEqual({ combo: 'Mod+S', digit: undefined })
  })

  it('writes modifiers in the fixed Mod+Ctrl+Alt+Shift order', () => {
    expect(buildCombo({ key: 'h', shift: true, ctrl: true, alt: true }).combo).toBe(
      'Mod+Alt+Shift+H',
    )
  })

  it('never emits Ctrl, because v0 ctrl matched ctrlKey || metaKey', () => {
    expect(buildCombo({ key: 'z', ctrl: true }).combo).not.toContain('Ctrl')
  })

  it('maps a digit onto its physical key name', () => {
    expect(buildCombo({ key: '1', ctrl: true, shift: true })).toEqual({
      combo: 'Mod+Shift+Digit1',
      digit: true,
    })
  })

  it('canonicalises a named key written in any case', () => {
    expect(keyToComboPart('escape').part).toBe('Escape')
    expect(keyToComboPart('ArrowUp').part).toBe('ArrowUp')
    expect(keyToComboPart(' ').part).toBe('Space')
  })

  it('refuses every punctuation key and names its replacement', () => {
    for (const [key, name] of Object.entries(PUNCTUATION_NAMES)) {
      const result = keyToComboPart(key)
      expect(result.part).toBeUndefined()
      expect(result.refusal).toContain(name)
    }
  })

  it('never produces Mod++ for the plus key, and never points at Plus', () => {
    // The whole reason this codemod exists: 'Mod++' splits into
    // ['Mod', '', ''] and silently never fires.
    //
    // `Plus` is the keypad `+` in the v1 grammar (spec/shortcuts.md). The `+` a
    // normal keyboard types is Shift+Equal, so naming `Plus` here would bind
    // the wrong physical key just as silently.
    const result = buildCombo({ key: '+', ctrl: true })
    expect(result.combo).toBeUndefined()
    expect(result.refusal).toContain('`Shift+Equal`')
    expect(result.refusal).toContain('keypad')
  })

  it('refuses every shifted character with its unshifted key name', () => {
    for (const [key, name] of Object.entries(SHIFTED_CHARS)) {
      const result = keyToComboPart(key)
      expect(result.part).toBeUndefined()
      expect(result.refusal).toContain(name)
    }
  })

  it('writes the whole property in a refusal, modifiers included', () => {
    // An author who pastes the key alone loses the modifiers and binds the
    // bare key. That is silent, and the next run exits clean.
    expect(buildCombo({ key: '?', ctrl: true }).refusal).toContain("`combo: 'Mod+Shift+Slash'`")
    expect(buildCombo({ key: '+', ctrl: true }).refusal).toContain("`combo: 'Mod+Shift+Equal'`")
    expect(buildCombo({ key: '=', ctrl: true, shift: true }).refusal).toContain(
      "`combo: 'Mod+Shift+Equal'`",
    )
    const upper = buildCombo({ key: 'S', ctrl: true }).refusal
    expect(upper).toContain("`combo: 'Mod+S'`")
    expect(upper).toContain("`combo: 'Mod+Shift+S'`")
    expect(buildCombo({ key: '?' }).refusal).toContain("`combo: 'Shift+Slash'`")
  })

  it('never doubles Shift when the site already holds it', () => {
    // The v1 name of a shifted character carries its own Shift. Helpdesk
    // writes `{ key: '>', shift: true }`, and `Shift+Shift+Period` is not a
    // combo v1 parses.
    for (const [key] of Object.entries(SHIFTED_CHARS)) {
      expect(buildCombo({ key, shift: true }).refusal).not.toContain('Shift+Shift')
      expect(buildCombo({ key, shift: true, ctrl: true }).refusal).not.toContain('Shift+Shift')
    }
    expect(buildCombo({ key: '>', shift: true }).refusal).toContain("`combo: 'Shift+Period'`")
    expect(buildCombo({ key: '?', ctrl: true, shift: true }).refusal).toContain(
      "`combo: 'Mod+Shift+Slash'`",
    )
  })

  it('tells an author who edited key instead of writing combo', () => {
    // A refusal names a v1 key name. Putting that name back in `key` leaves a
    // v0 config that never fired, so the run says what to write instead.
    const { refusal } = buildCombo({ key: 'Slash', ctrl: true })

    expect(refusal).toContain("key 'Slash' is already a v1 key name")
    expect(refusal).toContain("`combo: 'Mod+Slash'`")
    expect(buildCombo({ key: 'wat' }).refusal).not.toContain('v1 key name')
  })

  it('refuses an uppercase letter that carries no shift flag', () => {
    // v0's matchesShortcut compared the letter case-insensitively and skipped
    // its Shift check for an uppercase key, so it fired both ways.
    const { refusal } = buildCombo({ key: 'S', ctrl: true })
    expect(refusal).toContain('fired on s and on Shift+S')
    expect(refusal).toContain('register both')
    expect(buildCombo({ key: 'S', ctrl: true, shift: true }).combo).toBe('Mod+Shift+S')
  })

  it('notes a v0 key spelling that never matched', () => {
    const { notes, migrated } = migrateShortcuts(
      inCall("{ key: 'esc', description: 'Close', handler: close }"),
    )

    expect(migrated).toContain("combo: 'Escape'")
    expect(notes[0].message).toContain('never matched in v0')
  })

  it('does not note a space key, which event.key really reports', () => {
    const { notes } = migrateShortcuts(
      inCall("{ key: ' ', description: 'Pan', handler: pan }"),
    )

    expect(notes).toEqual([])
  })

  it('refuses a key it has no v1 spelling for', () => {
    expect(keyToComboPart('Meta').refusal).toContain('no known v1 spelling')
  })
})

describe('object rewriting', () => {
  it('rewrites the four v0 fields into one combo', () => {
    const { migrated, refusals } = migrateShortcuts(
      inCall("{ key: 's', ctrl: true, description: 'Save', group: 'View', handler: onSave }"),
    )

    expect(migrated).toContain(
      "{ combo: 'Mod+S', description: 'Save', group: 'View', handler: onSave }",
    )
    expect(refusals).toEqual([])
  })

  it('renames condition to enabled', () => {
    const { migrated } = migrateShortcuts(
      inCall(
        "{ key: 'z', ctrl: true, shift: true, description: 'Redo', condition: notReadOnly, handler: redo }",
      ),
    )

    expect(migrated).toContain(
      "{ combo: 'Mod+Shift+Z', description: 'Redo', enabled: notReadOnly, handler: redo }",
    )
  })

  it('deletes triggeredOn and keeps the hold callbacks', () => {
    const source = `import { useShortcut } from "frappe-ui"
useShortcut([
	{
		key: "l",
		ctrl: true,
		shift: true,
		triggeredOn: "hold",
		description: "Highlight Blocks with Client Scripts",
		group: "View",
		onHold: () => { store.highlight = true },
		onRelease: () => { store.highlight = false },
	},
])
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain('\t\tcombo: "Mod+Shift+L",\n\t\tdescription:')
    expect(migrated).not.toContain('triggeredOn')
    expect(migrated).toContain('onRelease: () => { store.highlight = false },')
  })

  it('keeps the surrounding formatting of a multi-line object', () => {
    const source = `import { useShortcut } from 'frappe-ui'
useShortcut([
  {
    key: 'f',
    ctrl: true,
    description: 'Find',
    handler: () => {
      open.value = true
    },
  },
])
`
    const { migrated } = migrateShortcuts(source)

    const expected = source
      .replaceAll('useShortcut', 'useKeyboardShortcut')
      .replace("    key: 'f',\n    ctrl: true,\n", "    combo: 'Mod+F',\n")
    expect(migrated).toBe(expected)
  })

  it('drops a trailing modifier without leaving a dangling comma', () => {
    const { migrated } = migrateShortcuts(
      inCall("{ description: 'Redo', key: 'z', ctrl: true, shift: true }"),
    )

    expect(migrated).toContain("{ description: 'Redo', combo: 'Mod+Shift+Z' }")
  })

  it('reports a punctuation site with its file line and leaves the source alone', () => {
    const source = inCall("{ key: '+', ctrl: true, description: 'Zoom in', handler: zoomIn }")
    const { migrated, refusals } = migrateShortcuts(source)

    expect(migrated).toContain("key: '+', ctrl: true")
    expect(refusals).toHaveLength(1)
    expect(refusals[0].line).toBe(3)
    expect(refusals[0].message).toContain('`Shift+Equal`')
  })

  it('reports an unshifted punctuation site with its named key', () => {
    const source = inCall("{ key: '-', ctrl: true, description: 'Zoom out', handler: zoomOut }")
    const { migrated, refusals } = migrateShortcuts(source)

    expect(migrated).toContain("key: '-', ctrl: true")
    expect(refusals[0].message).toContain('`Minus`')
  })

  it('marks a digit conversion so a shifted digit gets a second look', () => {
    const { changes } = migrateShortcuts(
      inCall("{ key: '1', ctrl: true, shift: true, description: 'Format as number' }"),
    )

    expect(changes).toEqual([
      { line: 3, from: "key: '1'", to: "combo: 'Mod+Shift+Digit1'", digit: true },
    ])
  })

  it('refuses a key that is not a plain string', () => {
    const { refusals } = migrateShortcuts(inCall('{ key: keyName, description: "Dynamic" }'))

    expect(refusals[0].message).toContain('not a plain string')
  })

  it('refuses a modifier that is not a literal boolean', () => {
    const { migrated, refusals } = migrateShortcuts(
      inCall("{ key: 's', ctrl: isMac, description: 'Save' }"),
    )

    expect(migrated).toContain('ctrl: isMac')
    expect(refusals[0].message).toContain('not a literal boolean')
  })

  it('refuses hold mode that also carries a handler', () => {
    const { refusals } = migrateShortcuts(
      inCall(
        "{ key: 'l', triggeredOn: 'hold', description: 'Hold', handler: a, onHold: b, onRelease: c }",
      ),
    )

    expect(refusals[0].message).toContain('Decide which callback stays')
  })

  it('refuses hold callbacks that v0 never fired', () => {
    const { refusals } = migrateShortcuts(
      inCall("{ key: 'l', description: 'Hold', onHold: a, onRelease: b }"),
    )

    expect(refusals[0].message).toContain('never fired in v0')
  })

  it("refuses hold callbacks under triggeredOn: 'press' too", () => {
    // v0 gated the callback on 'hold' alone, so 'press' is the same dead
    // callback as no `triggeredOn` at all.
    const { migrated, refusals } = migrateShortcuts(
      inCall("{ key: 'l', triggeredOn: 'press', description: 'Hold', onHold: a }"),
    )

    expect(refusals[0].message).toContain('never fired in v0')
    expect(migrated).toContain("key: 'l'")
  })

  it("keeps triggeredOn: 'press' with a handler, and drops the property", () => {
    const { migrated, refusals } = migrateShortcuts(
      inCall("{ key: 'l', triggeredOn: 'press', description: 'Go', handler: go }"),
    )

    expect(refusals).toEqual([])
    expect(migrated).toContain("combo: 'L'")
    expect(migrated).not.toContain('triggeredOn')
  })

  it('names a spread and a computed property name apart', () => {
    const spread = migrateShortcuts(inCall("{ ...base, key: 's', description: 'Save' }"))
    const computed = migrateShortcuts(inCall("{ key: 's', description: 'Save', [Keys.SAVE]: y }"))

    expect(spread.refusals[0].message).toContain('spreads another object')
    expect(computed.refusals[0].message).toContain('computed property name')
  })

  it('leaves a spread-built object alone, because nothing proves it is a config', () => {
    // The map returns into a plain function, so no call and no annotation
    // reaches it. `condition` beside a callback is shared vocabulary, so a
    // rename here is a guess.
    const source = `export function commandShortcuts() {
	return commands.all.value.map((command) => ({
		...command.keys!,
		group: command.group,
		condition: command.condition,
		handler: command.action,
	}))
}
`
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(notes).toEqual([])
    expect(refusals).toEqual([])
  })

  it('renames condition on a spread-built object under a v0 annotation', () => {
    const source = `import type { ShortcutConfig } from 'frappe-ui'
const bindings: ShortcutConfig[] = [
	{ ...base, condition: canEdit, handler: edit },
]
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('enabled: canEdit')
    expect(refusals).toEqual([])
  })

  it('converts a single object literal under an annotation', () => {
    // The annotated value is the object itself, so the span's opening bracket
    // is the object's own `{`. A strict `>` here made the object miss its own
    // proven range and fall to the unproven path.
    const source = `import { useShortcut, type ShortcutConfig } from 'frappe-ui'
const config: ShortcutConfig = { key: 's', ctrl: true, description: 'Save', handler: save }
useShortcut(config)
`
    const { migrated, refusals, notes } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(notes).toEqual([])
    expect(migrated).toContain(
      "const config: KeyboardShortcutConfig = { combo: 'Mod+S', description: 'Save', handler: save }",
    )
  })

  it('converts an object literal under a satisfies clause', () => {
    const source = `import { useShortcut, type ShortcutConfig } from 'frappe-ui'
const config = { key: 's', ctrl: true, description: 'Save', handler: save } satisfies ShortcutConfig
useShortcut(config)
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain(
      "const config = { combo: 'Mod+S', description: 'Save', handler: save } satisfies KeyboardShortcutConfig",
    )
  })

  it('converts an array under a satisfies clause', () => {
    const source = `import { useShortcut, type KeyboardShortcutConfig } from 'frappe-ui'
const bindings = [
  { key: 's', ctrl: true, description: 'Save', handler: save },
] satisfies KeyboardShortcutConfig[]
useShortcut(bindings)
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("{ combo: 'Mod+S', description: 'Save', handler: save }")
  })

  it('converts an array under as const satisfies readonly', () => {
    const source = `import { useShortcut, type KeyboardShortcutConfig } from 'frappe-ui'
const bindings = [
  { key: 's', ctrl: true, description: 'Save', handler: save },
] as const satisfies readonly KeyboardShortcutConfig[]
useShortcut(bindings)
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("{ combo: 'Mod+S', description: 'Save', handler: save }")
  })

  it('converts a literal cast to the config type', () => {
    const source = `import { useShortcut, type ShortcutConfig } from 'frappe-ui'
const bindings = [{ key: 's', ctrl: true, description: 'Save', handler: save }] as ShortcutConfig[]
useShortcut(bindings)
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("{ combo: 'Mod+S', description: 'Save', handler: save }")
  })

  it('does not call a v1 key name an unknown spelling', () => {
    // `Equal` is a v1 name in a v0 field. Saying it has no v1 spelling and
    // then that it is a v1 name in the same breath tells the author nothing.
    const source = `import { useShortcut } from 'frappe-ui'
useShortcut({ key: 'Equal', ctrl: true, handler: h })
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
    expect(refusals[0].message).not.toContain('has no known v1 spelling')
    expect(refusals[0].message).toContain('is already a v1 key name')
    expect(refusals[0].message).toContain("write `combo: 'Mod+Equal'`")
  })

  it('sends an unknown key to a reference the guide really has', () => {
    const source = `import { useShortcut } from 'frappe-ui'
useShortcut({ key: 'Meta', ctrl: true, handler: h })
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals[0].message).toContain('combo reference')

    const guide = fs.readFileSync(
      fileURLToPath(new URL('../docs/content/docs/migration.md', import.meta.url)),
      'utf8',
    )

    expect(guide).toContain('### Combo reference')
  })

  it('names the edit that keeps a dead hold callback', () => {
    // "Keep it on purpose" is not an edit. `triggeredOn: 'hold'` is, and the
    // next run converts the pair, so the message has to name it.
    const source = `import { useShortcut } from 'frappe-ui'
useShortcut({ key: 's', ctrl: true, onHold: hold })
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
    expect(refusals[0].message).toContain("add `triggeredOn: 'hold'`")

    const kept = `import { useShortcut } from 'frappe-ui'
useShortcut({ key: 's', ctrl: true, triggeredOn: 'hold', onHold: hold })
`
    const next = migrateShortcuts(kept, { ext: '.ts' })

    expect(next.refusals).toEqual([])
    expect(next.migrated).toContain("{ combo: 'Mod+S', onHold: hold }")
  })

  it('proves nothing from as const alone', () => {
    const source = `import { useShortcut, type ShortcutConfig } from 'frappe-ui'
const bindings = [{ key: 's', ctrl: true, description: 'Save', handler: save }] as const
useShortcut(bindings)
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
  })

  it('proves nothing from a cast that has no literal in front of it', () => {
    // The clause types the expression it follows. `raw as ShortcutConfig[]`
    // types `raw`, and must not reach back to an unrelated array above it.
    const source = `import { useShortcut, type ShortcutConfig } from 'frappe-ui'
const bindings = [{ key: 's', ctrl: true, description: 'Save', handler: save }]
const typed = raw as ShortcutConfig[]
useShortcut(bindings)
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals.some((r) => r.line === 2)).toBe(true)
  })

  it('proves nothing from a satisfies clause naming the app-s own type', () => {
    const source = `import { useShortcut } from 'frappe-ui'
import type { ShortcutConfig } from './types'
const bindings = [
  { key: 's', ctrl: true, description: 'Save', handler: save },
] satisfies ShortcutConfig[]
useShortcut(bindings)
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
    expect(refusals[0].line).toBe(4)
  })

  it('converts an object whose handler holds a regex after a keyword', () => {
    // A quote inside the regex used to open a string run that masked the rest
    // of the object, and the site was dropped with no refusal.
    const source = inCall(
      "{ key: 's', ctrl: true, description: 'S', handler: () => { if (a) return /'/.test(v); save() } }",
    )
    const { migrated, refusals } = migrateShortcuts(source)

    expect(refusals).toEqual([])
    expect(migrated).toContain("combo: 'Mod+S'")
    expect(migrated).toContain("return /'/.test(v)")
  })

  it('converts an object whose properties carry trailing comments', () => {
    const source = `import { useShortcut } from 'frappe-ui'
useShortcut([
  {
    key: 's', // save the file
    ctrl: true, // Cmd on macOS
    description: 'Save',
    handler: save,
  },
])
`
    const { migrated, refusals } = migrateShortcuts(source)

    expect(refusals).toEqual([])
    expect(migrated).toContain("combo: 'Mod+S', // save the file")
    expect(migrated).not.toContain('ctrl: true')
  })

  it('converts an object whose key name is quoted', () => {
    const { migrated, refusals } = migrateShortcuts(
      inCall("{ 'key': 's', ctrl: true, description: 'Save', handler: save }"),
    )

    expect(migrated).toContain("{ combo: 'Mod+S', description: 'Save', handler: save }")
    expect(refusals).toEqual([])
  })

  it('renames a shorthand condition into enabled with its value', () => {
    // A shorthand carries the value in the name, so renaming the name alone
    // would point at a variable that does not exist.
    const { migrated } = migrateShortcuts(
      inCall("{ key: 's', ctrl: true, description: 'Save', condition, handler }"),
    )

    expect(migrated).toContain("{ combo: 'Mod+S', description: 'Save', enabled: condition, handler }")
  })

  it('refuses an object that carries both condition and enabled', () => {
    const { migrated, refusals } = migrateShortcuts(
      inCall("{ key: 's', description: 'Save', condition: a, enabled: b, handler: h }"),
    )

    expect(migrated).toContain('condition: a, enabled: b')
    expect(refusals[0].message).toContain('would write `enabled` twice')
  })

  it('leaves a destructured condition alone', () => {
    const source = 'const { condition, handler } = props\n'
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
  })

  it('leaves an object built inside a handler body alone', () => {
    // `{ key: 'a' }` here is an analytics payload, not a shortcut. Only the
    // object the call receives directly counts as one on position alone.
    const source = inCall(
      "{ key: 's', ctrl: true, description: 'Save', handler: () => track('e', { key: 'a' }) }",
    )
    const { migrated, refusals } = migrateShortcuts(source)

    expect(migrated).toContain("combo: 'Mod+S'")
    expect(migrated).toContain("track('e', { key: 'a' })")
    expect(refusals).toEqual([])
  })

  it('does not refuse an unrelated nested object with a non-string key', () => {
    const source = inCall(
      "{ key: 's', ctrl: true, description: 'Save', handler: () => cache.set({ key: id }) }",
    )
    const { refusals } = migrateShortcuts(source)

    expect(refusals).toEqual([])
  })

  it('leaves a menu item shaped { condition, handler } alone', () => {
    // Same two fields, no config-only name, no shortcut position. Rewriting
    // `condition` here would break the menu and report a clean run.
    const source = `const items = [\n\t{ label: 'Delete', condition: canDelete, handler: remove },\n]\n`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
  })

  it('renames condition inside a useShortcut call even with no other config field', () => {
    const source =
      "import { useShortcut } from 'frappe-ui'\nuseShortcut([{ ...base, condition: canEdit, handler: edit }])\n"
    const { migrated } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('enabled: canEdit')
  })

  it('reads a method shorthand as the property it is', () => {
    const source = `import { useShortcut } from 'frappe-ui'\nuseShortcut({\n\tkey: 's',\n\tctrl: true,\n\tdescription: 'Save',\n\thandler() {\n\t\tsave()\n\t},\n})\n`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain("combo: 'Mod+S'")
    expect(migrated).toContain('handler() {')
    expect(refusals).toEqual([])
  })

  it('renames a condition method shorthand without eating its body', () => {
    const source = `import { useShortcut } from 'frappe-ui'\nuseShortcut({\n\tkey: 's',\n\tdescription: 'Save',\n\tcondition() {\n\t\treturn ready\n\t},\n\thandler: save,\n})\n`
    const { migrated } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('enabled() {')
    expect(migrated).toContain('return ready')
  })

  it('names a keys: { ... } object it cannot prove, and leaves it as it is', () => {
    const source = 'commands.register({\n\tkeys: { key: "p", ctrl: true, description: "Preview" },\n})\n'
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
    expect(notes[0].message).toContain('write `combo: \'Mod+P\'`')
  })

  it('leaves a type declaration of the v0 shape alone', () => {
    // A declaration is not a config. The app may own this type, and a rewrite
    // of a type body would move a shape the app still uses.
    const source =
      'export type CommandKeys = {\n\tkey: string;\n\tctrl?: boolean;\n\tshift?: boolean;\n\tdescription: string;\n};\n'
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
  })
})

describe('objects that are not shortcuts', () => {
  it('leaves a fake keyboard event alone', () => {
    // suite's own test builds events with the same four field names.
    const source = "fire({ key: 'z', ctrl: true })\nfire({ key: '=', ctrl: true })\n"
    const { migrated, refusals } = migrateShortcuts(source)

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
  })

  it('leaves a table column alone', () => {
    const source = "const columns = [{ key: 'name', label: 'Name' }]\n"

    expect(migrateShortcuts(source).migrated).toBe(source)
  })

  it('leaves a menu entry whose key is also a key name alone', () => {
    // `handler` and `condition` are shared vocabulary. A context-menu entry
    // and a route rule both carry them beside a `key`, so neither name is
    // evidence, and `key: 'delete'` must not become `combo: 'Delete'`.
    const source = `const items = [{ key: 'delete', label: 'Delete', handler: onDelete }]
const rules = [{ key: 'home', condition: isAdmin, handler: go }]
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
  })

  it('refuses an object it walked away from when the file also renamed', () => {
    // The call renames, so a registration left with `key` would reach v1 with
    // no `combo` and throw. A note would not stop the write, so it is a refusal.
    const source = `import { useShortcut } from 'frappe-ui'
const bindings = [{ key: 's', ctrl: true, handler: save }]
useShortcut(bindings)
`
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.js' })

    expect(notes).toEqual([])
    expect(refusals).toHaveLength(1)
    expect(refusals[0].line).toBe(2)
    expect(refusals[0].message).toContain("write `combo: 'Mod+S'`")
    expect(refusals[0].message).toContain('KeyboardShortcutConfig')
    expect(migrated).toContain("{ key: 's', ctrl: true, handler: save }")
  })

  it('refuses an object it walked away from beside a site it converted', () => {
    // No rename here: the file already calls the v1 name. A converted site is
    // the same evidence as a rename — the file is written, and this row would
    // reach v1 with no `combo`.
    const source = `import { useKeyboardShortcut } from 'frappe-ui'
useKeyboardShortcut({ key: 's', ctrl: true, description: 'Save', handler: save })
const more = [{ key: 'd', ctrl: true, description: 'Delete', handler: remove }]
`
    const { changes, notes, refusals } = migrateShortcuts(source, { ext: '.js' })

    expect(changes).toHaveLength(1)
    expect(notes).toEqual([])
    expect(refusals).toHaveLength(1)
    expect(refusals[0].line).toBe(3)
    expect(refusals[0].message).toContain("write `combo: 'Mod+D'`")
  })

  it('refuses a walked-away object in a file that renames through an alias', () => {
    const source = `import { useShortcut as useKb } from 'frappe-ui'
useKb([{ key: 's', ctrl: true, description: 'Save', handler: save }])
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
    expect(refusals[0].line).toBe(2)
    expect(migrated).toContain("{ key: 's', ctrl: true, description: 'Save', handler: save }")
  })

  it('names every object in a config module it cannot prove', () => {
    // A config module names no frappe-ui member and carries no annotation, so
    // nothing here is proven. The run names both rows and writes no file.
    const source = `export const bindings = [
  { key: 's', ctrl: true, description: 'Save', handler: save },
  { key: 'd', ctrl: true, handler: remove },
]
`
    const { migrated, notes, renames } = migrateShortcuts(source, { ext: '.ts' })

    expect(renames).toEqual([])
    expect(migrated).toBe(source)
    expect(notes.map((n) => n.line)).toEqual([2, 3])
  })

  it('names a modifier-less registration it walked away from', () => {
    // `{ key: 'escape', handler: close }` carries no modifier and no
    // config-only name. Saying nothing about it is the worst outcome: the call
    // renames, the file is written, and this row reaches v1 with no `combo`.
    const source = `import { useShortcut } from 'frappe-ui'

const bindings = [
  { key: 'escape', handler: close },
  { key: 'j', handler: next },
]

useShortcut(bindings)
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.js' })

    expect(refusals.map((r) => r.line)).toEqual([4, 5])
    expect(refusals[0].message).toContain("write `combo: 'Escape'`")
    expect(refusals[1].message).toContain("write `combo: 'J'`")
    expect(migrated).toContain("{ key: 'escape', handler: close }")
    // The rows sit in an array, so the array is what takes the annotation.
    expect(refusals[0].message).toContain('annotate the array with')
    expect(refusals[0].message).toContain('`KeyboardShortcutConfig[]` on v1')
  })

  it('names the annotation on a spread-built object it could not prove', () => {
    // The second unproven path carries no `key`, so it built its own note.
    // It has to carry the advice too, or the refusal reads "or undefined".
    const source = `import { useShortcut } from 'frappe-ui'
const rows = [{ ...base, description: 'Save', condition: canEdit, handler: edit }]
useShortcut({ key: 's', ctrl: true, description: 'X', handler: h })
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
    expect(refusals[0].message).not.toContain('undefined')
    expect(refusals[0].message).toContain('annotate the array')
  })

  it('names the type the app can import while it is still on v0', () => {
    // The codemod runs from the app being migrated, which still depends on
    // frappe-ui v0. `KeyboardShortcutConfig` is not exported there yet, so the
    // advice has to lead with the name that resolves today.
    const source = `import { useShortcut } from 'frappe-ui'
const bindings = [{ key: 's', ctrl: true, description: 'Save', handler: save }]
useShortcut(bindings)
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals[0].message).toContain('`ShortcutConfig[]` on v0')
    expect(refusals[0].message).toContain('`KeyboardShortcutConfig[]` on v1')
  })

  it('asks for the annotation that compiles on a lone object', () => {
    // `KeyboardShortcutConfig[]` on a single object is a type error, so the
    // advice has to name the type for the shape the run actually found.
    const source = `import { useShortcut } from 'frappe-ui'
const config = { key: 'escape', description: 'Close', handler: close }
useShortcut(config)
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
    expect(refusals[0].message).toContain('annotate it with')
    expect(refusals[0].message).toContain('`KeyboardShortcutConfig` on v1')
    expect(refusals[0].message).not.toContain('KeyboardShortcutConfig[]')
  })

  it('notes a modifier-less registration in a file with no other work', () => {
    const source = "export const bindings = [{ key: 'escape', handler: close }]\n"
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.js' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
    expect(notes[0].message).toContain("write `combo: 'Escape'`")
  })

  it('says nothing about a menu entry in a file it did not rename', () => {
    const source = "const items = [{ key: 'delete', label: 'Delete', handler: onDelete }]\n"
    const { migrated, notes } = migrateShortcuts(source, { ext: '.js' })

    expect(migrated).toBe(source)
    expect(notes).toEqual([])
  })

  it('says nothing about a table column beside a real shortcut', () => {
    // No `handler` and no `condition`, so it never read as a shortcut.
    const source = `import { useShortcut } from 'frappe-ui'
const columns = [{ key: 'name', label: 'Name' }]
useShortcut({ key: 's', ctrl: true, description: 'Save', handler: save })
`
    const { notes } = migrateShortcuts(source, { ext: '.js' })

    expect(notes).toEqual([])
  })

  it('names a shortcuts: [ ... ] array instead of rewriting it', () => {
    // A property name is not proof. An app is free to call its own array
    // `shortcuts` and hand it to its own composable.
    const source = "const cfg = { shortcuts: [{ key: 'k', ctrl: true, handler: open }] }\n"
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
    expect(notes[0].message).toContain("write `combo: 'Mod+K'`")
  })

  it('says nothing about a Combobox custom option', () => {
    // Real shape, from src/components/Combobox/stories/MemberPicker.vue. It
    // carries `key`, `description` and `condition`, which is the whole v0
    // vocabulary, and it is an option.
    const source = `const options = [
  ...members,
  {
    type: 'custom' as const,
    key: 'invite',
    label: 'Invite new member',
    description: 'Send an invite to this address',
    slot: 'invite',
    condition: () => true,
    onClick: ({ query }: { query: string }) => invite(query),
  },
]
`
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(notes).toEqual([])
    expect(refusals).toEqual([])
  })

  it('says nothing about a Combobox option group', () => {
    // Real shape, from src/components/Combobox/utils.ts.
    const source = `groups.push({
  key: 'ungrouped',
  group: '',
  hideLabel: true,
  options: pendingUngrouped,
})
`
    const { migrated, notes } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(notes).toEqual([])
  })

  it('leaves a key inside a string or a comment alone', () => {
    const source = "// { key: 's', ctrl: true, description: 'Save' }\nconst s = \"key: 's'\"\n"

    expect(migrateShortcuts(source).migrated).toBe(source)
  })

  it('does not read a .vue template as JavaScript', () => {
    const source = `<template>
  <p>Don't press { or } here</p>
</template>

<script setup>
import { useShortcut } from 'frappe-ui'
useShortcut({ key: 's', ctrl: true, description: 'Save', handler: save })
</script>
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.vue' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("<p>Don't press { or } here</p>")
    expect(migrated).toContain("{ combo: 'Mod+S', description: 'Save', handler: save }")
  })
})

describe('identifier renames', () => {
  it('renames the members that moved', () => {
    const source = `import { KeyboardShortcutsModal, useShortcut, type ShortcutConfig } from 'frappe-ui'
const config: ShortcutConfig = { key: 's', description: 'Save' }
useShortcut(config)
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    // The annotation proves the object, so the run converts it as well as
    // renaming around it. Asserting the renames alone once hid a refusal here.
    expect(refusals).toEqual([])
    expect(migrated).toContain(
      "import { KeyboardShortcutsDialog, useKeyboardShortcut, type KeyboardShortcutConfig } from 'frappe-ui'",
    )
    expect(migrated).toContain(
      "const config: KeyboardShortcutConfig = { combo: 'S', description: 'Save' }",
    )
    expect(migrated).toContain('useKeyboardShortcut(config)')
  })

  it('renames the tag in a template, where global registration hides the import', () => {
    const { migrated } = migrateShortcuts(
      '<template>\n  <KeyboardShortcutsModal v-model:open="open" />\n  <keyboard-shortcuts-modal />\n</template>\n',
      { ext: '.vue' },
    )

    expect(migrated).toContain('<KeyboardShortcutsDialog v-model:open="open" />')
    expect(migrated).toContain('<keyboard-shortcuts-dialog />')
  })

  it('leaves the name alone inside a string, a comment and a module specifier', () => {
    const source = `import { useShortcut } from 'frappe-ui'
import { legacy } from './useShortcut'
// useShortcut used to live here
const label = 'useShortcut'
useShortcut({ key: 's', description: 'Save', handler: save })
`
    const { migrated } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain("from './useShortcut'")
    expect(migrated).toContain('// useShortcut used to live here')
    expect(migrated).toContain("const label = 'useShortcut'")
    expect(migrated).toContain("import { useKeyboardShortcut } from 'frappe-ui'")
    expect(migrated).toContain('useKeyboardShortcut({ combo:')
  })

  it('leaves template prose and plain attribute values alone', () => {
    const source = `<script setup>
import { useShortcut, KeyboardShortcutsModal } from 'frappe-ui'
useShortcut({ key: 's', ctrl: true, description: 'Save', handler: save })
</script>

<template>
  <div class="useShortcut" data-test="KeyboardShortcutsModal">useShortcut</div>
  <KeyboardShortcutsModal v-model:open="open" />
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain('class="useShortcut" data-test="KeyboardShortcutsModal"')
    expect(migrated).toContain('>useShortcut</div>')
    expect(migrated).toContain('<KeyboardShortcutsDialog v-model:open="open" />')
    expect(migrated).toContain("import { useKeyboardShortcut, KeyboardShortcutsDialog }")
  })

  it('renames a bound attribute value and a mustache in a template', () => {
    const source = `<script setup>
import { KeyboardShortcutsModal } from 'frappe-ui'
</script>

<template>
  <component :is="KeyboardShortcutsModal" />
  <span>{{ KeyboardShortcutsModal.name }}</span>
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain(':is="KeyboardShortcutsDialog"')
    expect(migrated).toContain('{{ KeyboardShortcutsDialog.name }}')
  })

  it('leaves a string literal inside a template expression alone', () => {
    // A mustache holds an expression, so a reference migrates. A quoted string
    // inside it is output the user reads, and it does not.
    const source = `<script setup>
import { KeyboardShortcutsModal } from 'frappe-ui'
</script>

<template>
  <span>{{ 'KeyboardShortcutsModal' }}</span>
  <span :title="'useShortcut'">{{ label || 'useShortcut' }}</span>
  <span>{{ KeyboardShortcutsModal.name }}</span>
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain("{{ 'KeyboardShortcutsModal' }}")
    expect(migrated).toContain(`:title="'useShortcut'"`)
    expect(migrated).toContain("{{ label || 'useShortcut' }}")
    expect(migrated).toContain('{{ KeyboardShortcutsDialog.name }}')
  })

  it('renames every form of a bound attribute, and no plain one', () => {
    const source = `<script setup>
import { KeyboardShortcutsModal } from 'frappe-ui'
</script>

<template>
  <component v-bind:is="KeyboardShortcutsModal" />
  <component :is=KeyboardShortcutsModal />
  <div v-if="show && KeyboardShortcutsModal">x</div>
  <div class=KeyboardShortcutsModal data-x="KeyboardShortcutsModal">y</div>
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain('v-bind:is="KeyboardShortcutsDialog"')
    expect(migrated).toContain(':is=KeyboardShortcutsDialog')
    expect(migrated).toContain('v-if="show && KeyboardShortcutsDialog"')
    expect(migrated).toContain('class=KeyboardShortcutsModal data-x="KeyboardShortcutsModal"')
  })

  it('lexes a string, a comment and a regex inside a ${ } interpolation', () => {
    // A brace inside one of these is not a brace. Counting braces alone ends
    // the interpolation early, and the rest of the file is read in the wrong
    // mode, so a site after it converts wrongly or goes missing.
    const source = `const a = \`\${ map['}'] }\`
const b = \`\${ /* } */ x }\`
const c = \`\${ /}/.test(x) }\`
const d = \`\${ \`\${ y['}'] }\` }\`
import { useShortcut } from 'frappe-ui'
useShortcut({ key: 's', description: 'Save', handler: save })
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("useKeyboardShortcut({ combo: 'S'")
    expect(migrated).toContain(`const a = \`\${ map['}'] }\``)
  })

  it('reads a mustache past a }} inside an interpolated string', () => {
    const source = `<script setup>
import { KeyboardShortcutsModal } from 'frappe-ui'
</script>

<template>
  <span>{{ \`\${ map['}}'] }\` + KeyboardShortcutsModal.name }}</span>
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain('KeyboardShortcutsDialog.name')
    expect(migrated).not.toContain('KeyboardShortcutsModal')
  })

  it('reads a mustache to its real end, past a nested brace and a quoted }}', () => {
    // `}}` closes the mustache only at brace depth zero, outside a string.
    // Stopping at the first one hides the rest of the expression, and a
    // reference in there keeps a name its import no longer has.
    const source = `<script setup>
import { KeyboardShortcutsModal } from 'frappe-ui'
</script>

<template>
  <span>{{ fn({ a: { b: 1 }}) + KeyboardShortcutsModal.name }}</span>
  <span>{{ '}}' + KeyboardShortcutsModal.name }}</span>
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain('{{ fn({ a: { b: 1 }}) + KeyboardShortcutsDialog.name }}')
    expect(migrated).toContain(`{{ '}}' + KeyboardShortcutsDialog.name }}`)
    expect(migrated).not.toContain('KeyboardShortcutsModal')
  })

  it('leaves an unclosed {{ in prose alone', () => {
    const source = `<script setup>
import { KeyboardShortcutsModal } from 'frappe-ui'
</script>

<template>
  <p>Write {{ to open a mustache. KeyboardShortcutsModal is a component.</p>
  <KeyboardShortcutsModal v-model:open="open" />
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain('KeyboardShortcutsModal is a component.')
    expect(migrated).toContain('<KeyboardShortcutsDialog v-model:open="open" />')
  })

  it('renames a component tag in a template that has a script block', () => {
    const source = `<script setup>
const title = 'KeyboardShortcutsModal'
</script>

<template>
  <KeyboardShortcutsModal v-model:open="open" />
</template>
`
    const { migrated } = migrateShortcuts(source, { ext: '.vue' })

    expect(migrated).toContain('<KeyboardShortcutsDialog v-model:open="open" />')
    expect(migrated).toContain("const title = 'KeyboardShortcutsModal'")
  })

  it("leaves an app's own useShortcut fork alone and says so", () => {
    // Real shape, from helpdesk desk/src/composables/shortcuts.ts, which
    // exports a `useShortcut` of its own.
    const source = `import { useShortcut } from '@/composables/shortcuts'
useShortcut({ key: 's', description: 'Save', handler: save })
`
    const { migrated, notes, refusals } = migrateShortcuts(source)

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
    expect(notes[0].message).toContain("comes from '@/composables/shortcuts'")
  })

  it("converts frappe-ui's own call in a file that also imports a fork", () => {
    // One forked import used to disable object scanning for the whole file, so
    // a provable frappe-ui registration beside it was left on v0 in silence.
    const source = `import { useShortcut } from './composables/shortcuts'
import { useKeyboardShortcut } from 'frappe-ui'

useShortcut({ key: 'n', description: 'New ticket' }, create)
useKeyboardShortcut([{ key: 's', ctrl: true, description: 'Save', handler: save }])
`
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("{ combo: 'Mod+S', description: 'Save', handler: save }")
    expect(migrated).toContain("useShortcut({ key: 'n', description: 'New ticket' }, create)")
    expect(notes.some((n) => n.message.includes("comes from './composables/shortcuts'"))).toBe(true)
    // The note is about the name, not the file. This file was written.
    expect(notes.some((n) => n.message.includes('nothing in this file was touched'))).toBe(
      false,
    )
  })

  it("says nothing about an object the app's own composable receives", () => {
    // The fork's config is the app's. It is not frappe-ui's shape, and no edit
    // in this file would ever clear a refusal on it.
    const source = `import { useShortcut } from '@/composables/shortcuts'
import { KeyboardShortcutsModal } from 'frappe-ui'
useShortcut({ key: 'n', description: 'New ticket', handler: create })
`
    const { notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(notes).toHaveLength(1)
  })

  it('leaves a locally declared useShortcut alone', () => {
    const source = `export interface ShortcutBinding {
  key: string
  meta?: boolean
}
export function useShortcut(binding: ShortcutBinding, cb: () => void) {
  return { binding, cb }
}
`
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toBe(source)
    expect(refusals).toEqual([])
    expect(notes[0].message).toContain('declared in this file')
  })

  it("leaves an app's own ShortcutConfig type alone", () => {
    // A type is the only way an app declares one of its own, so a rename here
    // splits the app: the declaration moves and every consumer breaks.
    for (const source of [
      'export interface ShortcutConfig {\n  key: string\n  label: string\n}\n',
      'export type ShortcutConfig = { key: string; label: string }\n',
      'export enum ShortcutConfig {\n  Save = 1,\n}\n',
    ]) {
      const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.ts' })

      expect(migrated).toBe(source)
      expect(refusals).toEqual([])
      expect(notes[0].message).toContain('declared in this file')
    }
  })

  it('ignores a commented-out import and a name written in prose', () => {
    // A comment is not an import and not a declaration, so neither one may
    // read the file as a fork and hold the migration back.
    const source = `// import { useShortcut } from './old'
// export function KeyboardShortcutsModal() {}
// const { unbind } = useShortcut({ key: 'x' })
import { useShortcut } from 'frappe-ui'
useShortcut({ key: 's', description: 'Save', handler: save })
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("import { useKeyboardShortcut } from 'frappe-ui'")
    expect(migrated).toContain("combo: 'S'")
    expect(migrated).toContain("// import { useShortcut } from './old'")
  })

  it("does not touch an app's own useKeyboardShortcuts composable", () => {
    const source = `import { useShortcut } from 'frappe-ui'
export function useKeyboardShortcuts() {
  useShortcut({ key: 'd', ctrl: true, description: 'Toggle microphone', handler: toggle })
}
`
    const { migrated } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('export function useKeyboardShortcuts() {')
    expect(migrated).toContain("import { useKeyboardShortcut } from 'frappe-ui'")
  })

  it('reads the module each name is imported from', () => {
    const bindings = importBindings(
      "import { a, b as c } from 'frappe-ui'\nimport d from './d'\nimport * as e from 'vue'\n",
    )

    expect(bindings.get('a')).toBe('frappe-ui')
    expect(bindings.get('c')).toBe('frappe-ui')
    expect(bindings.get('d')).toBe('./d')
    expect(bindings.get('e')).toBe('vue')
  })
})

describe('hard stops', () => {
  it('refuses a deleted export instead of rewriting it', () => {
    const { migrated, refusals } = migrateShortcuts(
      "import { formatShortcutLabel, getActiveShortcuts } from 'frappe-ui'\n",
    )

    expect(migrated).toContain('formatShortcutLabel')
    expect(refusals.map((r) => r.message)).toEqual([
      expect.stringContaining('`formatShortcutLabel` is deleted'),
      expect.stringContaining('`getActiveShortcuts` is deleted'),
    ])
  })

  it('names a deleted member once, however often it appears', () => {
    const source = `import { getActiveShortcuts } from 'frappe-ui'
const a = getActiveShortcuts()
const b = getActiveShortcuts()
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toHaveLength(1)
  })

  it("leaves an app's own formatShortcutLabel out of it", () => {
    // The name is gone from frappe-ui, not from the app. A refusal here can
    // never be cleared, and it would hold the whole file back.
    const source = `import { useShortcut } from 'frappe-ui'
function formatShortcutLabel(config) {
  return config.key
}
interface RegisteredShortcut {
  key: string
}
useShortcut([{ key: 's', ctrl: true, description: 'Save', handler: save }])
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
    expect(migrated).toContain("combo: 'Mod+S'")
    expect(migrated).toContain('function formatShortcutLabel(config) {')
  })

  it('leaves a barrel mock alone when the file holds no v0 name', () => {
    const source = `import { KeyboardShortcutsDialog } from 'frappe-ui'
vi.mock('frappe-ui', () => ({ KeyboardShortcutsDialog }))
`
    const { refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(refusals).toEqual([])
  })

  it('refuses a destructured return, which v1 no longer gives', () => {
    const { refusals } = migrateShortcuts(
      "import { useShortcut } from 'frappe-ui'\nconst { activeShortcuts } = useShortcut({ key: 's', description: 'Save' })\n",
    )

    expect(refusals.some((r) => r.message.includes('returns void in v1'))).toBe(true)
  })

  it('notes a hand-rolled hold rather than folding it, and does not fail the run', () => {
    const source = `import { useShortcut } from 'frappe-ui'
useShortcut([{ key: ' ', description: 'Hold for move mode', handler: startMove }])
useEventListener(document, 'keyup', (e) => { if (e.key === ' ') endMove() })
`
    const { migrated, refusals, notes } = migrateShortcuts(source)

    expect(migrated).toContain("combo: 'Space'")
    expect(migrated).toContain("useEventListener(document, 'keyup'")
    expect(notes.some((n) => n.message.includes('hand-rolled hold'))).toBe(true)
    // No edit clears an unrelated `keyup` listener, so it must not exit non-zero.
    expect(refusals).toEqual([])
  })

  it('does not read keyup in a comment as a hand-rolled hold', () => {
    const source = `import { useShortcut } from 'frappe-ui'
// The old code attached a 'keyup' listener here.
useShortcut([{ key: ' ', description: 'Hold for move mode', handler: startMove }])
`
    const { notes } = migrateShortcuts(source)

    expect(notes.some((n) => n.message.includes('hand-rolled hold'))).toBe(false)
  })

  it('notes a hand-rolled hold beside a registration it could not prove', () => {
    // An aliased import proves no range at all, and the pair is the same pair.
    const source = `import { useShortcut as useKb } from 'frappe-ui'
useKb([{ key: ' ', description: 'Hold for move mode', handler: startMove }])
useEventListener(document, 'keyup', endMove)
`
    const { notes } = migrateShortcuts(source)

    expect(notes.some((n) => n.message.includes('hand-rolled hold'))).toBe(true)
  })

  it('reports a barrel mock keyed on the old export name', () => {
    const source = `import { vi } from 'vitest'
vi.mock('frappe-ui', () => ({ useShortcut: (configs) => registered.push(configs) }))
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('useKeyboardShortcut: (configs)')
    expect(refusals.some((r) => r.message.includes("mocks the 'frappe-ui' barrel"))).toBe(true)
  })
})

describe('cli', () => {
  it('exits non-zero and leaves a refused file byte-identical', () => {
    const before =
      "import { useShortcut } from 'frappe-ui'\nuseShortcut([{ key: '+', ctrl: true, description: 'Zoom in' }])\n"
    const dir = tempDir({ 'a.js': before })
    const result = run([dir])

    expect(result.status).toBe(1)
    expect(result.stdout).toContain('1 sites need a decision')
    expect(result.stdout).toContain('`Shift+Equal`')
    // Half a migration renames the call and leaves a config with no `combo`,
    // which throws on the first keypress. So nothing is written.
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(before)
  })

  it('leaves a file alone when one site refuses and the rest convert', () => {
    const before = `import { useShortcut } from 'frappe-ui'
useShortcut([
  { key: 's', ctrl: true, description: 'Save', handler: save },
  { key: '+', ctrl: true, description: 'Zoom in', handler: zoom },
])
`
    const dir = tempDir({ 'a.js': before })
    const result = run([dir])

    expect(result.status).toBe(1)
    expect(result.stdout).toContain('left alone')
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(before)
  })

  it('writes no half-migrated file when a config it cannot prove sits beside a rename', () => {
    const before = `import { useShortcut } from 'frappe-ui'
const bindings = [{ key: 's', ctrl: true, description: 'Save', handler: save }]
useShortcut(bindings)
`
    const dir = tempDir({ 'a.js': before })
    const result = run([dir])

    expect(result.status).toBe(1)
    expect(result.stdout).toContain('left alone')
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(before)
  })

  it('exits zero on a config module it changed nothing in', () => {
    // Nothing here renames and nothing converts, so the file is not written
    // and the objects are advice, not a stop.
    const before = `export const bindings = [
  { key: 's', ctrl: true, description: 'Save', handler: save },
  { key: 'd', ctrl: true, handler: remove },
]
`
    const dir = tempDir({ 'a.js': before })
    const result = run([dir])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('do not fail the run')
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(before)
  })

  it('lists no digit and no note for a file it left alone', () => {
    // The run says every file named is unchanged. So the summary above it
    // must not name work in one of those files as done.
    const before = `import { useShortcut } from 'frappe-ui'
useShortcut([
  { key: '1', ctrl: true, description: 'First', handler: first },
  { key: '+', ctrl: true, description: 'Zoom in', handler: zoom },
])
`
    const dir = tempDir({ 'a.js': before })
    const result = run([dir])

    expect(result.status).toBe(1)
    expect(result.stdout).toContain('left alone')
    expect(result.stdout).not.toContain('Digit keys converted')
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(before)
  })

  it('migrates the one file that imports the real composable, in an app that forks it', () => {
    // The shape of helpdesk desk/src: the app exports a `useShortcut` of its
    // own, most pages use that one, and a single page imports frappe-ui's.
    const fork = `export interface ShortcutBinding {
  key: string
  meta?: boolean
  description: string
}
export function useShortcut(binding: ShortcutBinding, cb: () => void) {
  return { binding, cb }
}
`
    const page = `<script setup lang="ts">
import { useShortcut } from '@/composables/shortcuts'
useShortcut({ key: 'n', meta: true, description: 'New ticket' }, create)
</script>
`
    const palette = `<script setup lang="ts">
import { useShortcut } from 'frappe-ui'
useShortcut({ key: 'k', ctrl: true, description: 'Open the palette', handler: open })
</script>
`
    const dir = tempDir({ 'shortcuts.ts': fork, 'Ticket.vue': page, 'Palette.vue': palette })
    const result = run([dir])

    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'shortcuts.ts'), 'utf8')).toBe(fork)
    expect(fs.readFileSync(path.join(dir, 'Ticket.vue'), 'utf8')).toBe(page)
    expect(fs.readFileSync(path.join(dir, 'Palette.vue'), 'utf8')).toContain(
      "useKeyboardShortcut({ combo: 'Mod+K', description: 'Open the palette', handler: open })",
    )
  })

  it('migrates the frappe-ui half of a file that also uses the fork', () => {
    const before = `<script setup lang="ts">
import { useShortcut } from '@/composables/shortcuts'
import { useKeyboardShortcut } from 'frappe-ui'

useShortcut({ key: 'n', meta: true, description: 'New ticket' }, create)
useKeyboardShortcut({ key: 's', ctrl: true, description: 'Save', handler: save })
</script>
`
    const dir = tempDir({ 'Ticket.vue': before })
    const result = run([dir])
    const after = fs.readFileSync(path.join(dir, 'Ticket.vue'), 'utf8')

    expect(result.status).toBe(0)
    expect(after).toContain(
      "useKeyboardShortcut({ combo: 'Mod+S', description: 'Save', handler: save })",
    )
    expect(after).toContain("useShortcut({ key: 'n', meta: true, description: 'New ticket' }, create)")
  })

  it('is safe to run twice', () => {
    // The guide says re-running is safe, so the second pass must change
    // nothing and still exit zero.
    const dir = tempDir({
      'a.js': `import { KeyboardShortcutsModal, useShortcut } from 'frappe-ui'
useShortcut([
  { key: 's', ctrl: true, description: 'Save', condition: ready, handler: save },
  { key: 'Escape', description: 'Close', handler: close },
])
`,
    })
    const first = run([dir])
    const afterFirst = fs.readFileSync(path.join(dir, 'a.js'), 'utf8')
    const second = run([dir])

    expect(first.status).toBe(0)
    expect(second.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(afterFirst)
    expect(afterFirst).toContain("combo: 'Mod+S'")
    expect(afterFirst).toContain('enabled: ready')
    expect(afterFirst).toContain('KeyboardShortcutsDialog')
  })

  it('rejects an unknown option instead of writing files', () => {
    const before =
      "import { useShortcut } from 'frappe-ui'\nuseShortcut([{ key: 's', ctrl: true, description: 'Save' }])\n"
    const dir = tempDir({ 'a.js': before })
    // A mistyped safety flag must never fall through to a real run.
    const result = run(['--dryrun', dir])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unknown option: --dryrun')
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(before)
  })

  it('skips a named file that is not a source file', () => {
    const dir = tempDir({ 'notes.md': "useShortcut([{ key: 's' }])\n" })
    const result = run([path.join(dir, 'notes.md')])

    expect(result.status).toBe(0)
    expect(result.stderr).toContain('not a source file')
    expect(fs.readFileSync(path.join(dir, 'notes.md'), 'utf8')).toContain('useShortcut')
  })

  it('exits zero on a clean run and writes the file', () => {
    const dir = tempDir({
      'a.js': "import { useShortcut } from 'frappe-ui'\nuseShortcut([{ key: 's', ctrl: true, description: 'Save' }])\n",
    })
    const result = run([dir])

    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toContain("{ combo: 'Mod+S'")
  })

  it('still exits non-zero on a dry run that found a refusal', () => {
    const dir = tempDir({
      'a.js': "import { useShortcut } from 'frappe-ui'\nuseShortcut([{ key: '=', description: 'Zoom' }])\n",
    })
    const result = run(['--dry-run', dir])

    expect(result.status).toBe(1)
    expect(result.stdout).toContain('[dry-run]')
  })

  it('writes nothing on a dry run', () => {
    const before = "import { useShortcut } from 'frappe-ui'\nuseShortcut([{ key: 's', ctrl: true, description: 'Save' }])\n"
    const dir = tempDir({ 'a.js': before })
    run(['--dry-run', dir])

    expect(fs.readFileSync(path.join(dir, 'a.js'), 'utf8')).toBe(before)
  })

  it('lists every digit it converted', () => {
    const dir = tempDir({
      'a.js': "import { useShortcut } from 'frappe-ui'\nuseShortcut([{ key: '1', ctrl: true, shift: true, description: 'Format' }])\n",
    })
    const result = run([dir])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Digit keys converted')
    expect(result.stdout).toContain("combo: 'Mod+Shift+Digit1'")
  })

  it('refuses an invalid path', () => {
    const result = run([path.join(os.tmpdir(), 'shortcuts-v1-does-not-exist')])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Invalid path')
  })

  it('prints the usage line with no target', () => {
    expect(run([]).status).toBe(1)
    expect(run(['--help']).stdout).toContain('Usage: shortcuts-v1')
  })
})

// One file shaped like a page an app really ships: a script block, a table, a
// context menu, a typed config array, two registrations and a template that
// names the component three ways. A synthetic one-line fixture hides the
// shapes that break a codemod.
describe('a real-shaped page', () => {
  const before = `<script setup lang="ts">
import { computed, ref } from 'vue'
import { KeyboardShortcutsModal, useShortcut, type ShortcutConfig } from 'frappe-ui'
import { useDocuments } from './useDocuments'

const { remove, save } = useDocuments()
const showShortcuts = ref(false)
const selected = ref<string | null>(null)

// The table. \`key\` is a column id here.
const columns = [
  { key: 'name', label: 'Name', width: '2fr' },
  { key: 'modified', label: 'Last modified', width: '1fr' },
]

// The context menu. \`key\` is a menu id here.
const menu = computed(() => [
  { key: 'delete', label: 'Delete', condition: () => !!selected.value, handler: remove },
])

const shortcuts: ShortcutConfig[] = [
  { key: 's', ctrl: true, description: 'Save the document', group: 'Document', handler: save },
  {
    key: 'k',
    ctrl: true,
    description: 'Open the palette',
    condition: () => !showShortcuts.value,
    handler: () => (palette.value = true),
  },
]

useShortcut(shortcuts)
useShortcut({
  key: 'Escape',
  description: 'Close the dialog',
  handler: () => (showShortcuts.value = false),
})
</script>

<template>
  <div class="useShortcut-grid">
    <p>Press / to see every useShortcut binding.</p>
    <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
    <KeyboardShortcutsModal v-model:open="showShortcuts" />
    <component :is="KeyboardShortcutsModal" v-if="false" />
    <span>{{ \`\${menu.length} items\` }}</span>
  </div>
</template>
`

  const after = `<script setup lang="ts">
import { computed, ref } from 'vue'
import { KeyboardShortcutsDialog, useKeyboardShortcut, type KeyboardShortcutConfig } from 'frappe-ui'
import { useDocuments } from './useDocuments'

const { remove, save } = useDocuments()
const showShortcuts = ref(false)
const selected = ref<string | null>(null)

// The table. \`key\` is a column id here.
const columns = [
  { key: 'name', label: 'Name', width: '2fr' },
  { key: 'modified', label: 'Last modified', width: '1fr' },
]

// The context menu. \`key\` is a menu id here.
const menu = computed(() => [
  { key: 'delete', label: 'Delete', condition: () => !!selected.value, handler: remove },
])

const shortcuts: KeyboardShortcutConfig[] = [
  { combo: 'Mod+S', description: 'Save the document', group: 'Document', handler: save },
  {
    combo: 'Mod+K',
    description: 'Open the palette',
    enabled: () => !showShortcuts.value,
    handler: () => (palette.value = true),
  },
]

useKeyboardShortcut(shortcuts)
useKeyboardShortcut({
  combo: 'Escape',
  description: 'Close the dialog',
  handler: () => (showShortcuts.value = false),
})
</script>

<template>
  <div class="useShortcut-grid">
    <p>Press / to see every useShortcut binding.</p>
    <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
    <KeyboardShortcutsDialog v-model:open="showShortcuts" />
    <component :is="KeyboardShortcutsDialog" v-if="false" />
    <span>{{ \`\${menu.length} items\` }}</span>
  </div>
</template>
`

  it('migrates the whole file and leaves the rest of it alone', () => {
    const dir = tempDir({ 'DocumentList.vue': before })
    const result = run([dir])

    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(dir, 'DocumentList.vue'), 'utf8')).toBe(after)
  })

  it('says nothing about the table, the menu or the template', () => {
    // Every other object on the page is an option or a row. The run proves
    // the two it converts and stays quiet about the rest.
    const dir = tempDir({ 'DocumentList.vue': before })
    const result = run([dir])

    expect(result.stdout).not.toContain(':L')
  })
})
