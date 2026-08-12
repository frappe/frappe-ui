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

  it('renames condition on an object built by spreading a v0 config', () => {
    const source = `export function commandShortcuts() {
	return commands.all.value.map((command) => ({
		...command.keys!,
		group: command.group,
		condition: command.condition,
		handler: command.action,
	}))
}
`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('enabled: command.condition,')
    expect(refusals).toEqual([])
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
    const source = 'useShortcut([{ ...base, condition: canEdit, handler: edit }])\n'
    const { migrated } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('enabled: canEdit')
  })

  it('reads a method shorthand as the property it is', () => {
    const source = `useShortcut({\n\tkey: 's',\n\tctrl: true,\n\tdescription: 'Save',\n\thandler() {\n\t\tsave()\n\t},\n})\n`
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain("combo: 'Mod+S'")
    expect(migrated).toContain('handler() {')
    expect(refusals).toEqual([])
  })

  it('renames a condition method shorthand without eating its body', () => {
    const source = `useShortcut({\n\tkey: 's',\n\tdescription: 'Save',\n\tcondition() {\n\t\treturn ready\n\t},\n\thandler: save,\n})\n`
    const { migrated } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain('enabled() {')
    expect(migrated).toContain('return ready')
  })

  it('converts a keys: { ... } object that carries no other config field', () => {
    const { migrated } = migrateShortcuts(
      'commands.register({\n\tkeys: { key: "p", ctrl: true, description: "Preview" },\n})\n',
      { ext: '.ts' },
    )

    expect(migrated).toContain('keys: { combo: "Mod+P", description: "Preview" }')
  })

  it('refuses a type declaration of the v0 shape', () => {
    const { migrated, refusals } = migrateShortcuts(
      'export type CommandKeys = {\n\tkey: string;\n\tctrl?: boolean;\n\tshift?: boolean;\n\tdescription: string;\n};\n',
      { ext: '.ts' },
    )

    expect(migrated).toContain('key: string;')
    expect(refusals[0].message).toContain('KeyboardShortcutConfig')
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

  it('names an object it walked away from when the file also renamed', () => {
    // The call renames, so a registration left with `key` would reach v1 with
    // no `combo` and throw. The run says so instead of exiting in silence.
    const source = `import { useShortcut } from 'frappe-ui'
const bindings = [{ key: 's', ctrl: true, handler: save }]
useShortcut(bindings)
`
    const { migrated, notes, refusals } = migrateShortcuts(source, { ext: '.js' })

    expect(refusals).toEqual([])
    expect(notes).toHaveLength(1)
    expect(notes[0].line).toBe(2)
    expect(notes[0].message).toContain('v1 throws on a config with no `combo`')
    expect(migrated).toContain("{ key: 's', ctrl: true, handler: save }")
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

  it('takes a shortcut under a shortcuts: [ ... ] property', () => {
    // The property names what the array holds, so each object in it is a
    // shortcut even with no `description`.
    const source = "const cfg = { shortcuts: [{ key: 'k', ctrl: true, handler: open }] }\n"
    const { migrated, refusals } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain("combo: 'Mod+K'")
    expect(refusals).toEqual([])
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
    const { migrated } = migrateShortcuts(source, { ext: '.ts' })

    expect(migrated).toContain(
      "import { KeyboardShortcutsDialog, useKeyboardShortcut, type KeyboardShortcutConfig } from 'frappe-ui'",
    )
    expect(migrated).toContain('const config: KeyboardShortcutConfig')
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
    const source = `import { useShortcut } from '@/composables/useShortcut'
useShortcut({ key: 's', description: 'Save', handler: save })
`
    const { migrated, refusals } = migrateShortcuts(source)

    expect(migrated).toContain("import { useShortcut } from '@/composables/useShortcut'")
    expect(refusals[0].message).toContain("comes from '@/composables/useShortcut'")
  })

  it('leaves a locally declared useShortcut alone', () => {
    const source = 'export function useShortcut(configs) {\n  return configs\n}\n'
    const { migrated, refusals } = migrateShortcuts(source)

    expect(migrated).toBe(source)
    expect(refusals[0].message).toContain('declared in this file')
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

  it('refuses a destructured return, which v1 no longer gives', () => {
    const { refusals } = migrateShortcuts(
      "const { activeShortcuts } = useShortcut({ key: 's', description: 'Save' })\n",
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
