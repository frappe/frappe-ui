#!/usr/bin/env node
/**
 * Keyboard shortcut v1 migration codemod.
 *
 * v0 described a shortcut with a `key` string plus `ctrl` / `shift` / `alt`
 * booleans. v1 describes it with one `combo` string. This codemod rewrites the
 * old shape into the new one, and renames the members that moved:
 *
 *   useShortcut            -> useKeyboardShortcut
 *   KeyboardShortcutsModal -> KeyboardShortcutsDialog
 *   ShortcutConfig         -> KeyboardShortcutConfig
 *
 *   Usage:  shortcuts-v1 [--dry-run] <dir-or-file...>
 *
 * WHY A CODEMOD AND NOT A GREP
 *
 * `+` is both the combo separator and a key. A hand migration turns
 * `{ key: '+', ctrl: true }` into `'Mod++'`, which splits into
 * `['Mod', '', '']` and never fires. Nothing reports it. It is the same
 * silent-break class as v0's `ctrl` flag, which matched `ctrlKey || metaKey`
 * and so always meant `Mod`.
 *
 * So this codemod never guesses a punctuation key. It stops on the site,
 * prints the file, the line, and the named key the combo should use, and
 * exits non-zero. Every unconverted site is listed, and any unconverted site
 * makes the whole run exit non-zero — a clean exit means a clean run.
 *
 * A file with a refused site is left exactly as it was, even when its other
 * shortcuts converted. Half a migration puts a renamed call beside a config
 * with no `combo`, and v1 throws on the first keypress.
 *
 * WHAT IT CONVERTS AUTOMATICALLY
 *
 *   { key: 's', ctrl: true }              -> { combo: 'Mod+S' }
 *   { key: 'escape' }                     -> { combo: 'Escape' }
 *   { key: '1', ctrl: true, shift: true } -> { combo: 'Mod+Shift+Digit1' }
 *   condition: notReadOnly                -> enabled: notReadOnly
 *   triggeredOn: 'hold'                   -> deleted; onHold/onRelease select it
 *
 * Digits match on `KeyboardEvent.code` in v1, so a shifted digit resolves
 * where v0 compared `event.key`. The conversion is automatic but every digit
 * site is listed at the end of the run, because the matching behaviour moved.
 *
 * Modifiers are always written in one order: Mod+Ctrl+Alt+Shift+<Key>.
 *
 * WHICH OBJECTS IT TOUCHES
 *
 * A `key` property alone means nothing — table columns and `v-for` rows use
 * it too. An object is treated as a shortcut when it has a `key` string and
 * either a v0-only property (`ctrl`, `handler`, `condition`, ...), or a
 * position that says so: an object the `useShortcut(...)` call receives
 * directly, or the value of a `keys:` / `shortcut:` property. An object built
 * deeper inside the call, in a handler body, is not one.
 *
 * WHAT IT REFUSES
 *
 * - punctuation keys (it prints the named key to use)
 * - an uppercase letter with no `shift: true` (v0 fired it on Shift+<letter>)
 * - a `key` that is not a plain string
 * - a modifier flag that is not a literal `true` / `false`
 * - a type declaration of the v0 shape (use `KeyboardShortcutConfig`)
 * - `formatShortcutLabel` and `getActiveShortcuts`, deleted from the package
 * - a destructured `useShortcut(...)` return; v1 returns void
 * - `triggeredOn: 'hold'` next to a `handler`, and `onHold`/`onRelease` with
 *   no `triggeredOn: 'hold'` — both change which callbacks fire
 *
 * WHAT IT REPORTS BUT NEVER TOUCHES
 *
 * - a `vi.mock('frappe-ui', ...)` keyed on `useShortcut`. The rename fixes the
 *   key, but the captured configs still carry `key` / `ctrl`, so the
 *   assertions around it need reading. This one is a refusal.
 *
 * WHAT IT NOTES, WITHOUT FAILING THE RUN
 *
 * - a digit key, because v1 matches it on the physical key.
 * - a possible hand-rolled hold: a registration plus a manual `keyup`
 *   listener. Only a human can say which half becomes `onHold` and which
 *   `onRelease`. The migrated file is correct either way, and an unrelated
 *   `keyup` listener in the same file matches too, so no edit could clear a
 *   refusal here.
 *
 * An app's own composable is never renamed. `useShortcut` is rewritten only
 * where the file imports it from the `frappe-ui` barrel, or does not bind it
 * at all. crm, lms and suite's meet app each ship a local
 * `useKeyboardShortcuts`, one character from the new name.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const USAGE = 'Usage: shortcuts-v1 [--dry-run] <dir-or-file...>'

const GUIDE = 'https://ui.frappe.io/docs/migration#keyboard-shortcuts'

// ---------- KEY VOCABULARY ----------

// Punctuation is never rewritten. These are the names the combo should use,
// printed with each refusal so the fix is a copy-paste.
//
// `+` is not here. v1 names `Plus` for the keypad `+`, one name per physical
// key, so the `+` a normal keyboard types is `Shift+Equal`. It sits in
// SHIFTED_CHARS below. See spec/shortcuts.md, "Key names".
export const PUNCTUATION_NAMES = {
  '-': 'Minus',
  '=': 'Equal',
  '/': 'Slash',
  '\\': 'Backslash',
  '`': 'Backtick',
  ',': 'Comma',
  '.': 'Period',
  ';': 'Semicolon',
  "'": 'Quote',
  '[': 'BracketLeft',
  ']': 'BracketRight',
}

// A US keyboard produces these characters with Shift held. v1 matches
// punctuation and digits on the physical key, so the combo names the
// unshifted key and adds `Shift`. Printed as a hint; still a refusal, because
// adding `Shift` changes which events match.
export const SHIFTED_CHARS = {
  '+': 'Shift+Equal',
  '~': 'Shift+Backtick',
  '!': 'Shift+Digit1',
  '@': 'Shift+Digit2',
  '#': 'Shift+Digit3',
  $: 'Shift+Digit4',
  '%': 'Shift+Digit5',
  '^': 'Shift+Digit6',
  '&': 'Shift+Digit7',
  '*': 'Shift+Digit8',
  '(': 'Shift+Digit9',
  ')': 'Shift+Digit0',
  _: 'Shift+Minus',
  '{': 'Shift+BracketLeft',
  '}': 'Shift+BracketRight',
  '|': 'Shift+Backslash',
  ':': 'Shift+Semicolon',
  '"': 'Shift+Quote',
  '<': 'Shift+Comma',
  '>': 'Shift+Period',
  '?': 'Shift+Slash',
}

// A v1 key name that reads like the character but names a different physical
// key. Printed with the refusal, so nobody reaches for the wrong one.
const NEAR_MISS_NAMES = {
  '+': '`Plus` is the keypad `+`, a different physical key.',
}

// Keys that keep matching on `KeyboardEvent.key`. v0 compared them
// case-insensitively, so the codemod canonicalises the casing.
const NAMED_KEYS = [
  'Escape',
  'Enter',
  'Tab',
  'Backspace',
  'Delete',
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Insert',
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
]

const NAMED_KEY_BY_LOWER = new Map(NAMED_KEYS.map((k) => [k.toLowerCase(), k]))
// v0 spellings that reached the same key. ' ' is what `event.key` reports.
for (const [from, to] of [
  [' ', 'Space'],
  ['esc', 'Escape'],
  ['del', 'Delete'],
  ['spacebar', 'Space'],
  ['up', 'ArrowUp'],
  ['down', 'ArrowDown'],
  ['left', 'ArrowLeft'],
  ['right', 'ArrowRight'],
]) {
  NAMED_KEY_BY_LOWER.set(from, to)
}

// ---------- IDENTIFIER RENAMES ----------

export const IDENTIFIER_RENAMES = {
  useShortcut: 'useKeyboardShortcut',
  KeyboardShortcutsModal: 'KeyboardShortcutsDialog',
  ShortcutConfig: 'KeyboardShortcutConfig',
}

// Kebab-case tag spelling of the renamed component, for a template that
// registers it globally and never imports it.
const TAG_RENAMES = {
  'keyboard-shortcuts-modal': 'keyboard-shortcuts-dialog',
}

// Deleted from the package in v1. A hit is a hard stop, not a rewrite: there
// is no expression that keeps the code working.
export const DELETED_MEMBERS = {
  formatShortcutLabel:
    '`formatShortcutLabel` is deleted. Render `<KeyboardShortcut :combo="..." />` instead.',
  getActiveShortcuts:
    '`getActiveShortcuts` is deleted. Read the registry from the `<KeyboardShortcutsDialog>` default slot.',
  ActiveShortcut: '`ActiveShortcut` is deleted together with `getActiveShortcuts`.',
  RegisteredShortcut: '`RegisteredShortcut` is deleted together with `getActiveShortcuts`.',
}

// A property only a shortcut config carries. One of these next to a `key`
// string tells a registration apart from a table column or a `v-for` row.
//
// `ctrl` / `shift` / `alt` are deliberately NOT in this set. A fake keyboard
// event carries the same four fields — suite's own test writes
// `fire({ key: 'z', ctrl: true })` — and rewriting one of those to a combo
// breaks the test. v0's type made `description` mandatory, so every real
// registration carries one of the names below.
const CONFIG_SIGNALS = new Set([
  'description',
  'group',
  'handler',
  'onHold',
  'onRelease',
  'condition',
  'triggeredOn',
])

const HOLD_CALLBACKS = ['onHold', 'onRelease']
const MODIFIER_PROPS = ['ctrl', 'alt', 'shift']

// A `keys: { ... }` or `shortcut: { ... }` property holds a shortcut even
// when the object carries nothing but `key` and `description`.
const CONTEXT_PROPERTY = /(?:^|[^\w$])(?:keys|key_bindings|shortcut|shortcuts|binding)\s*:\s*$/

// ---------- IMPORT BINDINGS ----------

const BARREL = /^frappe-ui(?:\/|$)/

// Maps each imported local name to the module it came from, so a rename can
// stay inside the frappe-ui barrel. An app's own `useShortcut` fork keeps its
// name and gets reported instead.
export function importBindings(source) {
  const bindings = new Map()
  const statement = /\bimport\b([^;]*?)\bfrom\s*(['"])([^'"]+)\2/g
  let m
  while ((m = statement.exec(source))) {
    const [, clause, , module] = m
    const named = /\{([\s\S]*?)\}/.exec(clause)
    const specifiers = []
    if (named) {
      for (const part of named[1].split(',')) {
        const alias = /^\s*(?:type\s+)?[\w$]+\s+as\s+([\w$]+)\s*$/.exec(part)
        const plain = /^\s*(?:type\s+)?([\w$]+)\s*$/.exec(part)
        if (alias) specifiers.push(alias[1])
        else if (plain) specifiers.push(plain[1])
      }
    }
    const defaultOrNamespace = /^\s*(?:type\s+)?(?:\*\s+as\s+)?([\w$]+)/.exec(clause)
    if (defaultOrNamespace) specifiers.push(defaultOrNamespace[1])
    for (const name of specifiers) if (!bindings.has(name)) bindings.set(name, module)
  }
  return bindings
}

// A name declared in this file is this file's own, whatever it is called.
function declaresLocally(source, name) {
  return new RegExp(`\\b(?:function|const|let|var|class)\\s+${name}\\b`).test(source)
}

// ---------- LEXING ----------

// Marks every character inside a string, a template literal, a comment or a
// regex literal. Object scanning reads this mask, so a brace or a `key:`
// inside a string never counts.
function maskLiterals(source) {
  const mask = new Uint8Array(source.length)
  let i = 0
  let lastSignificant = ''

  const markRange = (from, to) => {
    for (let j = from; j < to && j < mask.length; j++) mask[j] = 1
  }

  while (i < source.length) {
    const c = source[i]
    const next = source[i + 1]

    if (c === '/' && next === '/') {
      const end = source.indexOf('\n', i)
      const stop = end === -1 ? source.length : end
      markRange(i, stop)
      i = stop
      continue
    }
    if (c === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      const stop = end === -1 ? source.length : end + 2
      markRange(i, stop)
      i = stop
      continue
    }
    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < source.length) {
        if (source[j] === '\\') {
          j += 2
          continue
        }
        if (source[j] === c || source[j] === '\n') break
        j++
      }
      markRange(i, j + 1)
      i = j + 1
      lastSignificant = c
      continue
    }
    if (c === '`') {
      // A template literal holds live code in `${ ... }`, so the mask covers
      // the text runs and leaves the expressions readable.
      mask[i] = 1
      i++
      while (i < source.length) {
        if (source[i] === '\\') {
          mask[i] = 1
          if (i + 1 < source.length) mask[i + 1] = 1
          i += 2
          continue
        }
        if (source[i] === '`') {
          mask[i] = 1
          i++
          break
        }
        if (source[i] === '$' && source[i + 1] === '{') {
          mask[i] = 1
          mask[i + 1] = 1
          i += 2
          let depth = 1
          while (i < source.length) {
            if (source[i] === '{') depth++
            else if (source[i] === '}') depth--
            if (depth === 0) {
              mask[i] = 1
              i++
              break
            }
            i++
          }
          continue
        }
        mask[i] = 1
        i++
      }
      lastSignificant = '`'
      continue
    }
    if (c === '/' && regexCanStart(lastSignificant)) {
      let j = i + 1
      let inClass = false
      let closed = false
      while (j < source.length) {
        const d = source[j]
        if (d === '\\') {
          j += 2
          continue
        }
        if (d === '\n') break
        if (d === '[') inClass = true
        else if (d === ']') inClass = false
        else if (d === '/' && !inClass) {
          closed = true
          break
        }
        j++
      }
      if (closed) {
        markRange(i, j + 1)
        i = j + 1
        lastSignificant = '/'
        continue
      }
    }
    if (!/\s/.test(c)) lastSignificant = c
    i++
  }

  return mask
}

// After one of these, a `/` opens a regex literal rather than dividing.
function regexCanStart(prev) {
  return prev === '' || '(,=:[!&|?{};+-*%~^<>'.includes(prev)
}

// A .vue file's <template> is HTML: an apostrophe in prose and an unbalanced
// brace would derail the JS lexer, so object scanning stays in <script>.
export function scriptRanges(source, ext) {
  if (ext !== '.vue') return [[0, source.length]]
  const ranges = []
  const lower = source.toLowerCase()
  const openTag = /<script\b[^>]*>/gi
  let m
  while ((m = openTag.exec(source))) {
    const start = m.index + m[0].length
    const close = lower.indexOf('</script>', start)
    const end = close === -1 ? source.length : close
    ranges.push([start, end])
    openTag.lastIndex = end
  }
  return ranges
}

// Everything outside a script range stays masked, so it is never scanned.
function buildMask(source, ranges) {
  const mask = new Uint8Array(source.length).fill(1)
  for (const [from, to] of ranges) {
    const sub = maskLiterals(source.slice(from, to))
    for (let i = 0; i < sub.length; i++) mask[from + i] = sub[i]
  }
  return mask
}

// A second mask, for the identifier rename only. It hides strings, template
// text, comments and regexes inside script code, so a module specifier like
// './useShortcut' or a name quoted in prose is never rewritten. A .vue
// template stays readable, because a component tag lives there and the file
// may never import the name.
function buildRenameMask(source, ranges) {
  const mask = new Uint8Array(source.length)
  for (const [from, to] of ranges) {
    const sub = maskLiterals(source.slice(from, to))
    for (let i = 0; i < sub.length; i++) mask[from + i] = sub[i]
  }
  return mask
}

function lineAt(content, offset) {
  let line = 1
  for (let i = 0; i < offset; i++) if (content[i] === '\n') line++
  return line
}

// ---------- OBJECT LITERAL PARSING ----------

// Walks back from a property match to the `{` that opens its object, then
// forward to the matching `}`. Returns null when the braces do not balance.
function enclosingObject(source, mask, offset, limit) {
  let depth = 0
  let start = -1
  for (let i = offset - 1; i >= limit[0]; i--) {
    if (mask[i]) continue
    const c = source[i]
    if (c === '}' || c === ')' || c === ']') depth++
    else if (c === '{') {
      if (depth === 0) {
        start = i
        break
      }
      depth--
    } else if (c === '(' || c === '[') {
      if (depth === 0) return null
      depth--
    }
  }
  if (start === -1) return null

  depth = 0
  for (let i = start; i < limit[1]; i++) {
    if (mask[i]) continue
    const c = source[i]
    if (c === '{' || c === '(' || c === '[') depth++
    else if (c === '}' || c === ')' || c === ']') {
      depth--
      if (depth === 0) return c === '}' ? { start, end: i + 1 } : null
    }
  }
  return null
}

// The name at the head of a property: `handler:`, `'handler':`, and the method
// shorthands `handler()`, `async handler()`, `*handler()`.
const METHOD_HEAD = /^(?:async\s+)?\*?\s*(?:(['"])([A-Za-z_$][\w$]*)\1|([A-Za-z_$][\w$]*))\s*\(/
const PROPERTY_NAME_SPAN =
  /^(?:async\s+)?\*?\s*(?:(['"])[A-Za-z_$][\w$]*\1|[A-Za-z_$][\w$]*)/

// Splits an object literal into its top-level properties, keeping the exact
// source range of each so a rewrite preserves the file's formatting.
function parseProperties(source, mask, range) {
  const inner = [range.start + 1, range.end - 1]
  const props = []
  let depth = 0
  let segStart = inner[0]

  const push = (from, to, commaEnd) => {
    const text = source.slice(from, to)
    if (!text.trim()) return
    const start = from + (text.length - text.trimStart().length)
    const end = from + text.trimEnd().length
    const body = source.slice(start, end)
    const named = /^(?:(['"])([A-Za-z_$][\w$]*)\1|([A-Za-z_$][\w$]*))\s*:/.exec(body)
    // `handler() { save() }` is a property too. Without this it reads as an
    // unnamed member, and the object is refused as if it spread another one.
    const method = named ? null : METHOD_HEAD.exec(body)
    const shorthand = !named && !method && /^[A-Za-z_$][\w$]*$/.test(body)
    props.push({
      name: named
        ? (named[2] ?? named[3])
        : method
          ? (method[2] ?? method[3])
          : shorthand
            ? body
            : null,
      shorthand,
      text: body,
      value: named ? body.slice(named[0].length).trim() : body,
      start,
      end,
      commaEnd: commaEnd ?? end,
    })
  }

  for (let i = inner[0]; i < inner[1]; i++) {
    if (mask[i]) continue
    const c = source[i]
    if (c === '{' || c === '(' || c === '[') depth++
    else if (c === '}' || c === ')' || c === ']') depth--
    else if (c === ',' && depth === 0) {
      push(segStart, i, i + 1)
      segStart = i + 1
    }
  }
  push(segStart, inner[1], null)
  return props
}

const STRING_LITERAL = /^(['"])((?:[^\\]|\\.)*?)\1$/

function readStringLiteral(text) {
  const m = STRING_LITERAL.exec(text.trim())
  if (!m) return null
  return { quote: m[1], value: m[2].replace(/\\(.)/g, '$1') }
}

// A `type`/`interface` body describing the v0 shape, not a registration. A
// modifier typed as `boolean` next to a `key` is what makes it unambiguous —
// `{ key: string }` on its own belongs to plenty of unrelated types.
const TYPE_DECLARATION = /\b(?:ctrl|shift|alt)\s*\??\s*:\s*boolean\b/

// ---------- COMBO BUILDING ----------

// Returns a combo part or a refusal — never a guess.
export function keyToComboPart(key, { hasShift } = {}) {
  if (key.length === 1) {
    if (/[a-z]/.test(key)) return { part: key.toUpperCase() }
    if (/[A-Z]/.test(key)) {
      if (hasShift) return { part: key }
      // v0 read an uppercase config key as shift-produced and fired it on
      // Shift+<letter>. Lowering the case silently widens the match.
      return {
        refusal: `key '${key}' is uppercase with no \`shift: true\`. v0 fired it on Shift+${key} only. Write \`Shift+${key}\` if that is what you meant, or lowercase the key.`,
      }
    }
    if (/[0-9]/.test(key)) return { part: `Digit${key}`, digit: true }
    if (key in PUNCTUATION_NAMES) {
      return {
        refusal: `key '${key}' is punctuation. Write the named key \`${PUNCTUATION_NAMES[key]}\` — '${key}' would collide with the combo separator or with the keyboard layout.`,
      }
    }
    if (key in SHIFTED_CHARS) {
      const nearMiss = NEAR_MISS_NAMES[key] ? ` ${NEAR_MISS_NAMES[key]}` : ''
      return {
        refusal: `key '${key}' is a shifted character. v1 matches the physical key, so write \`${SHIFTED_CHARS[key]}\`.${nearMiss}`,
      }
    }
  }

  const named = NAMED_KEY_BY_LOWER.get(key.toLowerCase())
  if (named) return { part: named }

  return {
    refusal: `key '${key}' has no known v1 spelling. Take the name from the combo reference in the migration guide.`,
  }
}

// Modifier order is fixed, so one combo has exactly one spelling.
const MODIFIER_ORDER = ['Mod', 'Ctrl', 'Alt', 'Shift']

export function buildCombo({ key, ctrl, alt, shift }) {
  const held = new Set()
  // v0's `ctrl` matched `ctrlKey || metaKey`, so it always meant Mod.
  if (ctrl) held.add('Mod')
  if (alt) held.add('Alt')
  if (shift) held.add('Shift')

  const { part, refusal, digit } = keyToComboPart(key, { hasShift: !!shift })
  if (refusal) return { refusal }

  const modifiers = MODIFIER_ORDER.filter((m) => held.has(m))
  return { combo: [...modifiers, part].join('+'), digit }
}

// ---------- REWRITING ----------

// Cuts a run of neighbouring properties out of an object, taking its
// separator with it. A run on its own lines takes the whole lines, so the
// object keeps its shape; an inline run takes its trailing comma and spaces.
function runDeletionRange(source, props, run, range) {
  const first = props[run[0]]
  const last = props[run[run.length - 1]]
  const hasComma = last.commaEnd > last.end

  let lineStart = first.start
  while (lineStart > range.start && source[lineStart - 1] !== '\n') lineStart--
  const ownLine = !source.slice(lineStart, first.start).trim()

  if (hasComma) {
    let end = last.commaEnd
    while (end < range.end && (source[end] === ' ' || source[end] === '\t')) end++
    if (ownLine && source[end] === '\n') return [lineStart, end + 1]
    if (ownLine) return [lineStart, end]
    return [first.start, end]
  }

  // Last property in the object: take the separator in front of the run.
  const prev = props[run[0] - 1]
  return [prev ? prev.end : range.start + 1, last.end]
}

// Groups property indices into runs of neighbours, so two deletions can never
// produce overlapping ranges.
function groupRuns(indices) {
  const sorted = [...new Set(indices)].sort((a, b) => a - b)
  const runs = []
  for (const index of sorted) {
    const current = runs[runs.length - 1]
    if (current && current[current.length - 1] === index - 1) current.push(index)
    else runs.push([index])
  }
  return runs
}

// Replaces the name only, so `condition: fn` and `condition() { ... }` both
// keep their value untouched.
function renameProperty(prop, name) {
  const span = PROPERTY_NAME_SPAN.exec(prop.text)
  return {
    start: prop.start,
    end: prop.start + (span ? span[0].length : prop.text.indexOf(':')),
    text: name,
  }
}

// `condition` reaches v1 as `enabled`. A shorthand carries the value in the
// name, so renaming the name alone would point at a variable that does not
// exist. It becomes `enabled: condition` instead.
function renameConditionProperty(prop) {
  if (prop.shorthand) {
    return { start: prop.start, end: prop.end, text: `enabled: ${prop.text}` }
  }
  return renameProperty(prop, 'enabled')
}

function convertObject(source, mask, range, ctx) {
  const props = parseProperties(source, mask, range)
  const byName = new Map()
  props.forEach((p, i) => {
    if (p.name && !byName.has(p.name)) byName.set(p.name, { ...p, index: i })
  })

  const keyProp = byName.get('key')
  const condition = byName.get('condition')

  // Pass two: an object built by spreading a v0 config still carries
  // `condition`, which v1 spells `enabled`.
  //
  // `condition` next to `handler` is not evidence on its own — a menu item, a
  // route rule and a command entry all share that shape. So the object must
  // also carry a config-only name, or sit where only a shortcut sits.
  if (!keyProp) {
    const isShortcutLike =
      condition &&
      ['handler', ...HOLD_CALLBACKS].some((n) => byName.has(n)) &&
      (ctx.insideCall ||
        ctx.contextProperty ||
        byName.has('description') ||
        byName.has('group'))
    if (!isShortcutLike) return null
    return {
      edits: [renameConditionProperty(condition)],
      change: {
        line: lineAt(source, condition.start),
        from: 'condition:',
        to: 'enabled:',
      },
      refusals: [],
    }
  }

  const line = lineAt(source, keyProp.start)
  const refuse = (message) => ({ refusals: [{ line, message }] })

  // The type check comes before the gate below: a type body has no `handler`
  // and sits in no call, so the gate would skip it in silence.
  if (TYPE_DECLARATION.test(source.slice(range.start, range.end))) {
    return refuse(
      'this declares the v0 shortcut shape as a type. v1 ships `KeyboardShortcutConfig` — import that, or replace `key`/`ctrl`/`shift`/`alt` with `combo: string` by hand.',
    )
  }

  const hasSignal = props.some((p) => p.name && CONFIG_SIGNALS.has(p.name))
  if (!hasSignal && !ctx.insideCall && !ctx.contextProperty) return null

  if (props.some((p) => p.name === null && !p.shorthand)) {
    return refuse(
      'the shortcut object spreads another object, so its `key` and modifiers cannot be read here. Convert it by hand.',
    )
  }

  const literal = readStringLiteral(keyProp.value)
  if (!literal) {
    return refuse(
      `\`key: ${keyProp.value}\` is not a plain string, so the combo cannot be built. Convert it by hand.`,
    )
  }

  // A modifier flag must be a literal boolean; anything else is a decision.
  const flags = {}
  const drops = []
  for (const name of MODIFIER_PROPS) {
    const prop = byName.get(name)
    if (!prop) continue
    const value = prop.value.trim()
    if (value !== 'true' && value !== 'false') {
      return refuse(
        `\`${name}: ${value}\` is not a literal boolean. v1 has no conditional modifier — build the combo string yourself.`,
      )
    }
    flags[name] = value === 'true'
    drops.push(prop.index)
  }

  const triggeredOn = byName.get('triggeredOn')
  const hasHandler = byName.has('handler')
  const hasHoldCallback = HOLD_CALLBACKS.some((n) => byName.has(n))
  if (triggeredOn) {
    const mode = readStringLiteral(triggeredOn.value)
    if (!mode || (mode.value !== 'hold' && mode.value !== 'press')) {
      return refuse(
        `\`triggeredOn: ${triggeredOn.value}\` is not a literal 'press' or 'hold', so hold mode cannot be resolved.`,
      )
    }
    if (mode.value === 'hold' && hasHandler) {
      return refuse(
        "`triggeredOn: 'hold'` next to a `handler` fired both in v0. v1 selects hold mode from `onHold`/`onRelease` alone. Decide which callback stays.",
      )
    }
    if (mode.value === 'hold' && !hasHoldCallback) {
      return refuse(
        "`triggeredOn: 'hold'` with no `onHold` or `onRelease` has nothing to select hold mode in v1. Add the callback, or drop the hold mode.",
      )
    }
    drops.push(triggeredOn.index)
  } else if (hasHoldCallback) {
    return refuse(
      "`onHold`/`onRelease` without `triggeredOn: 'hold'` never fired in v0, and does fire in v1. Delete the callback, or keep it on purpose.",
    )
  }

  const { combo, refusal, digit } = buildCombo({ key: literal.value, ...flags })
  if (refusal) return refuse(refusal)

  const edits = [
    {
      start: keyProp.start,
      end: keyProp.end,
      text: `combo: ${literal.quote}${combo}${literal.quote}`,
    },
  ]

  for (const run of groupRuns(drops)) {
    const [start, end] = runDeletionRange(source, props, run, range)
    edits.push({ start, end, text: '' })
  }

  if (condition) edits.push(renameConditionProperty(condition))

  return {
    edits,
    change: {
      line,
      from: keyProp.text.trim(),
      to: `combo: ${literal.quote}${combo}${literal.quote}`,
      digit: !!digit,
    },
    refusals: [],
  }
}

// Argument ranges of every useShortcut / useKeyboardShortcut call. An object
// inside one is a shortcut even without a telltale property.
function shortcutCallRanges(source, mask) {
  const ranges = []
  const call = /\b(?:useShortcut|useKeyboardShortcut)\s*\(/g
  let m
  while ((m = call.exec(source))) {
    if (mask[m.index]) continue
    const open = m.index + m[0].length - 1
    let depth = 0
    for (let i = open; i < source.length; i++) {
      if (mask[i]) continue
      const c = source[i]
      if (c === '(' || c === '{' || c === '[') depth++
      else if (c === ')' || c === '}' || c === ']') {
        depth--
        if (depth === 0) {
          ranges.push([open, i])
          break
        }
      }
    }
  }
  return ranges
}

// True when the call receives this object directly: as the argument itself, or
// as an element of the array or object the call receives. Anything deeper
// belongs to a handler body, where `{ key: 'a' }` is an analytics payload and
// not a shortcut.
function isDirectArgument(source, mask, open, objectStart) {
  let depth = 0
  for (let i = open + 1; i < objectStart; i++) {
    if (mask[i]) continue
    const c = source[i]
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    if (depth < 0) return false
  }
  return depth <= 1
}

/**
 * Rewrites one file's contents.
 *
 * Returns `{ migrated, changes, renames, refusals, notes }`. `refusals` is what
 * makes a run exit non-zero; each entry names a line and says what to write
 * instead. `notes` are printed and do not fail the run.
 */
export function migrateShortcuts(content, { ext = '.js' } = {}) {
  const changes = []
  const refusals = []
  const notes = []
  const edits = []

  const ranges = scriptRanges(content, ext)
  const mask = buildMask(content, ranges)
  const callRanges = shortcutCallRanges(content, mask)

  const seen = new Set()
  const visit = (offset) => {
    if (mask[offset]) return
    const range = ranges.find(([from, to]) => offset >= from && offset < to)
    if (!range) return
    const object = enclosingObject(content, mask, offset, range)
    if (!object || seen.has(object.start)) return
    seen.add(object.start)

    const insideCall = callRanges.some(
      ([s, e]) =>
        object.start > s &&
        object.end <= e + 1 &&
        isDirectArgument(content, mask, s, object.start),
    )
    const contextProperty = CONTEXT_PROPERTY.test(
      content.slice(Math.max(range[0], object.start - 40), object.start),
    )
    const result = convertObject(content, mask, object, { insideCall, contextProperty })
    if (!result) return
    refusals.push(...(result.refusals ?? []))
    if (result.edits) {
      edits.push(...result.edits)
      changes.push(result.change)
    }
  }

  // `key:` finds a registration; `condition:` finds an object built by
  // spreading one, which still needs the `enabled` rename. A quoted name
  // counts: `{ 'key': 's' }` is the same object.
  //
  // The scan lands on the colon, never on the name, because a quoted name is
  // masked as a string and the mask is what tells code from prose.
  for (const pattern of [
    /(?:\bkey\b|['"]key['"])\s*:/g,
    /(?:\bcondition\b|['"]condition['"])\s*:/g,
    // A shorthand `condition`, which carries its value in the name.
    /\bcondition\s*(?=[,}])/g,
  ]) {
    let m
    while ((m = pattern.exec(content))) {
      const at = m.index + m[0].length - 1
      if (mask[at]) continue
      visit(at)
    }
  }

  // A deleted member is flagged wherever it appears, comments included: the
  // name is gone from the package, so a stale mention is worth the noise.
  const deleted = new RegExp(`\\b(${Object.keys(DELETED_MEMBERS).join('|')})\\b`, 'g')
  let d
  while ((d = deleted.exec(content))) {
    refusals.push({ line: lineAt(content, d.index), message: DELETED_MEMBERS[d[1]] })
  }

  const destructured =
    /(?:const|let|var)\s*\{[^}]*\}\s*=\s*(?:useShortcut|useKeyboardShortcut)\s*\(/g
  let r
  while ((r = destructured.exec(content))) {
    refusals.push({
      line: lineAt(content, r.index),
      message:
        '`useKeyboardShortcut` returns void in v1. Delete the destructured return; cleanup already runs on unmount.',
    })
  }

  // A manual keyup listener beside a registration may be a hand-rolled hold.
  // Only a human can say which half is `onHold` and which is `onRelease`.
  //
  // This is a note, not a refusal. The registration converts, the listener
  // keeps working, so the migrated file is correct either way. It is also a
  // guess: an unrelated `keyup` listener in the same file matches too, and no
  // edit would ever clear it.
  if (callRanges.length > 0) {
    const keyup = /['"`]keyup['"`]/g
    let k
    while ((k = keyup.exec(content))) {
      notes.push({
        line: lineAt(content, k.index),
        message:
          'a manual `keyup` listener sits beside a shortcut registration. If it is a hand-rolled hold, v1 has `onHold`/`onRelease` — fold the pair by hand.',
      })
    }
  }

  // A barrel mock keyed on the old export name. The rename fixes the key, but
  // the captured configs still carry `key`/`ctrl`, so the assertions move too.
  const barrelMock = /\b(?:vi|jest)\.mock\(\s*['"]frappe-ui['"]/g
  let b
  while ((b = barrelMock.exec(content))) {
    if (!/\buseShortcut\b|\bKeyboardShortcut/.test(content)) continue
    refusals.push({
      line: lineAt(content, b.index),
      message:
        "this mocks the 'frappe-ui' barrel. The mock key is renamed, but the captured configs still carry `key`/`ctrl` — update the assertions with the registrations.",
    })
  }

  // A rename stays inside the frappe-ui barrel. A name this file imports from
  // somewhere else, or declares itself, belongs to the app.
  const bindings = importBindings(content)
  const renames = []
  const renameable = Object.keys(IDENTIFIER_RENAMES).filter((name) => {
    const module = bindings.get(name)
    if (module) {
      if (BARREL.test(module)) return true
      refusals.push({
        line: lineAt(content, content.indexOf(name)),
        message: `\`${name}\` here comes from '${module}', not the frappe-ui barrel. It was left alone — rename it yourself if it is a fork.`,
      })
      return false
    }
    if (declaresLocally(content, name)) {
      refusals.push({
        line: lineAt(content, content.indexOf(name)),
        message: `\`${name}\` is declared in this file, so it is the app's own. It was left alone.`,
      })
      return false
    }
    return true
  })

  const renameMask = buildRenameMask(content, ranges)

  if (renameable.length > 0) {
    const identifier = new RegExp(`\\b(${renameable.join('|')})\\b`, 'g')
    let id
    while ((id = identifier.exec(content))) {
      if (renameMask[id.index]) continue
      edits.push({
        start: id.index,
        end: id.index + id[1].length,
        text: IDENTIFIER_RENAMES[id[1]],
      })
      renames.push({
        line: lineAt(content, id.index),
        from: id[1],
        to: IDENTIFIER_RENAMES[id[1]],
      })
    }
  }

  const tag = new RegExp(`(</?)(${Object.keys(TAG_RENAMES).join('|')})\\b`, 'g')
  let t
  while ((t = tag.exec(content))) {
    if (renameMask[t.index]) continue
    edits.push({
      start: t.index + t[1].length,
      end: t.index + t[0].length,
      text: TAG_RENAMES[t[2]],
    })
    renames.push({ line: lineAt(content, t.index), from: t[2], to: TAG_RENAMES[t[2]] })
  }

  edits.sort((a, b) => a.start - b.start || a.end - b.end)
  let migrated = ''
  let cursor = 0
  for (const edit of edits) {
    if (edit.start < cursor) continue
    migrated += content.slice(cursor, edit.start) + edit.text
    cursor = edit.end
  }
  migrated += content.slice(cursor)

  const byLine = (a, b) => a.line - b.line
  return {
    migrated,
    changes: changes.sort(byLine),
    renames: renames.sort(byLine),
    refusals: refusals.sort(byLine),
    notes: notes.sort(byLine),
  }
}

// ---------- CLI ----------

const EXTENSIONS = new Set(['.vue', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'cache', 'coverage'])

function* walk(target) {
  if (fs.statSync(target).isFile()) {
    yield target
    return
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name)
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(full)
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      yield full
    }
  }
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE)
    return
  }
  const dryRun = args.includes('--dry-run')
  const targets = args.filter((a) => !a.startsWith('--'))

  if (targets.length === 0) {
    console.error(USAGE)
    process.exit(1)
  }

  const files = []
  const seen = new Set()
  for (const target of targets) {
    if (!fs.existsSync(target)) {
      console.error(`Invalid path: ${target}`)
      process.exit(1)
    }
    for (const file of walk(target)) {
      const resolved = fs.realpathSync(file)
      if (seen.has(resolved)) continue
      seen.add(resolved)
      files.push(file)
    }
  }

  let filesChanged = 0
  let filesLeftAlone = 0
  let totalCombos = 0
  let totalRenames = 0
  const allDigits = []
  const allNotes = []
  const allRefusals = []

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const { migrated, changes, renames, refusals, notes } = migrateShortcuts(content, {
      ext: path.extname(file),
    })

    for (const refusal of refusals) allRefusals.push({ file, ...refusal })
    for (const note of notes) allNotes.push({ file, ...note })
    for (const change of changes) if (change.digit) allDigits.push({ file, ...change })

    const changeCount = changes.length + renames.length
    if (changeCount === 0) continue

    // A refusal means part of this file is still v0. Writing the rest would
    // leave a renamed call beside a config that has no `combo`, and v1 throws
    // on the first keypress. So the file is left as it was: fix the sites the
    // run names, then run again and take the whole file at once.
    if (refusals.length > 0) {
      filesLeftAlone++
      console.log(`${file} (${changeCount} pending, left alone)`)
      continue
    }

    filesChanged++
    totalCombos += changes.length
    totalRenames += renames.length
    if (!dryRun) fs.writeFileSync(file, migrated)

    console.log(`${file} (${changeCount})`)
    if (dryRun) {
      for (const c of changes) console.log(`  L${c.line}: ${c.from} -> ${c.to}`)
      for (const r of renames) console.log(`  L${r.line}: ${r.from} -> ${r.to}`)
    }
  }

  console.log(
    `\n${dryRun ? '[dry-run] would update' : 'Updated'} ${filesChanged} files, ` +
      `${totalCombos} shortcut properties rewritten, ${totalRenames} identifier renames`,
  )
  if (filesLeftAlone > 0) {
    console.log(`${filesLeftAlone} files left alone, because a site in each was refused`)
  }

  if (allDigits.length > 0) {
    console.log('\n⚠ Digit keys converted — v1 matches these on the physical key:')
    for (const d of allDigits) console.log(`  ${d.file}:L${d.line}  ${d.to}`)
    console.log('  A shifted digit now resolves too. Check each one still reads right.')
  }

  if (allNotes.length > 0) {
    console.log('\n⚠ Read these — the file is migrated, but the code may want a rewrite:')
    for (const n of allNotes) console.log(`  ${n.file}:L${n.line}  ${n.message}`)
  }

  if (allRefusals.length > 0) {
    console.log(`\n✗ Not converted — ${allRefusals.length} sites need a decision:`)
    for (const f of allRefusals) console.log(`  ${f.file}:L${f.line}  ${f.message}`)
    console.log('\n  Every file named above is unchanged. Fix these, then run again.')
    console.log(`  Guide: ${GUIDE}`)
    process.exit(1)
  }
}

const scriptPath = fileURLToPath(import.meta.url)
const invokedPath = process.argv[1]
const isCLI = invokedPath && fs.realpathSync(invokedPath) === fs.realpathSync(scriptPath)
if (isCLI) main()
