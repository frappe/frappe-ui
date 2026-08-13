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
 * `['Mod', '', '']` and never fires. Nothing fails: the build passes and v1
 * warns once in the dev console, which a production build drops. It is the same
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
 * - an uppercase letter with no `shift: true` (v0 fired it both ways)
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
 * - a v0 spelling that never matched, such as 'esc' or 'up'. v0 compared
 *   `event.key`, which never reports those, so the combo is live now.
 * - a possible hand-rolled hold: a registration plus a manual `keyup`
 *   listener. Only a human can say which half becomes `onHold` and which
 *   `onRelease`. The migrated file is correct either way, and an unrelated
 *   `keyup` listener in the same file matches too, so no edit could clear a
 *   refusal here.
 * - an object that reads like a config in a place nothing proves, in a file
 *   the run leaves alone. In a file the run would write, the same object is a
 *   refusal: writing the rest would leave this one on v0 beside a renamed
 *   call, which is the half migration this codemod exists to prevent.
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

// v0 compared `config.key` to `event.key` with no alias table, and the browser
// never reports these spellings. So a shortcut written this way never fired.
// Normalising it makes a dead shortcut live, which is a behaviour change and
// gets a note. `' '` is not here: `event.key` really does report it.
const DEAD_V0_SPELLINGS = new Set(['esc', 'del', 'spacebar', 'up', 'down', 'left', 'right'])

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

// A name that reads like a shortcut config. None of these proves one, and
// nothing here decides a rewrite: they decide whether the run mentions a site
// it could not prove. A note costs a line of output. A rewrite costs the app.
const NOTE_SIGNALS = new Set([
  'description',
  'onHold',
  'onRelease',
  'triggeredOn',
])

// A name a shortcut config never carries, and frappe-ui's option types do.
// `ComboboxGroupedOption` is `{ key, group, hideLabel, options }` and
// `ComboboxCustomOption` is `{ key, label, description, onClick, condition }`.
// One of these means the object is an option or a menu row, so the run says
// nothing at all about it.
const OPTION_SIGNALS = new Set([
  'label',
  'value',
  'options',
  'items',
  'onClick',
  'slot',
  'slots',
  'icon',
  'hideLabel',
  'type',
  'component',
  'route',
  'to',
  'children',
])

const HOLD_CALLBACKS = ['onHold', 'onRelease']

// v0 fired `onHold` and `onRelease` only under `triggeredOn: 'hold'`. v1 reads
// the callback itself as the request for hold mode, so a callback that was
// dead in v0 starts firing. That is a behaviour change, so the site is refused.
const DEAD_HOLD_CALLBACK =
  "`onHold`/`onRelease` without `triggeredOn: 'hold'` never fired in v0, and does fire in v1. Delete the callback, or keep it on purpose."
const MODIFIER_PROPS = ['ctrl', 'alt', 'shift']

// ---------- IMPORT BINDINGS ----------

const BARREL = /^frappe-ui(?:\/|$)/

// Maps each imported local name to the module it came from, so a rename can
// stay inside the frappe-ui barrel. An app's own `useShortcut` fork keeps its
// name and gets reported instead.
export function importBindings(source, mask) {
  const bindings = new Map()
  const statement = /\bimport\b([^;]*?)\bfrom\s*(['"])([^'"]+)\2/g
  let m
  while ((m = statement.exec(source))) {
    if (mask?.[m.index]) continue
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
//
// `interface`, `type` and `enum` belong here as much as `function` does.
// `ShortcutConfig` is a type, so a type declaration is the only way an app
// declares one of its own.
const DECLARATION_KEYWORDS = 'function|const|let|var|class|interface|type|enum'

function declaresLocally(source, name, mask) {
  const declaration = new RegExp(`\\b(?:${DECLARATION_KEYWORDS})\\s+${name}\\b`, 'g')
  return firstUnmasked(source, declaration, mask) >= 0
}

// The first match that is real code. A name inside a comment or a string is
// prose about the code, not the code, so it does not count.
function firstUnmasked(source, pattern, mask) {
  pattern.lastIndex = 0
  let m
  while ((m = pattern.exec(source))) {
    if (!mask?.[m.index]) return m.index
  }
  return -1
}

// ---------- LEXING ----------

// Mask values. Everything non-zero is "not code". Comments carry their own
// value, because a property may start or end with one and the property name
// still has to be readable.
const MASK_LITERAL = 1
const MASK_COMMENT = 2

// Marks every character inside a string, a template literal, a comment or a
// regex literal. Object scanning reads this mask, so a brace or a `key:`
// inside a string never counts.
function maskLiterals(source) {
  const mask = new Uint8Array(source.length)
  let i = 0
  let lastSignificant = ''

  // One entry per `${ ... }` this position sits inside, holding the brace
  // depth reached in the expression. The expression is code, so the main loop
  // reads it, and a string, a comment or a regex in there is masked like any
  // other. Naive brace counting cannot do that: `${ a['}'] }` ends at the
  // quoted brace and everything after it is lexed in the wrong mode.
  const interpolations = []

  const markRange = (from, to, value = MASK_LITERAL) => {
    for (let j = from; j < to && j < mask.length; j++) mask[j] = value
  }

  // Marks the text of a template literal. Stops at the closing backtick, or
  // at a `${`, where code starts again.
  const maskTemplateText = (from) => {
    let j = from
    while (j < source.length) {
      if (source[j] === '\\') {
        mask[j] = MASK_LITERAL
        if (j + 1 < source.length) mask[j + 1] = MASK_LITERAL
        j += 2
        continue
      }
      mask[j] = MASK_LITERAL
      if (source[j] === '`') return { at: j + 1, open: false }
      if (source[j] === '$' && source[j + 1] === '{') {
        mask[j + 1] = MASK_LITERAL
        return { at: j + 2, open: true }
      }
      j++
    }
    return { at: j, open: false }
  }

  while (i < source.length) {
    const c = source[i]
    const next = source[i + 1]

    if (c === '/' && next === '/') {
      const end = source.indexOf('\n', i)
      const stop = end === -1 ? source.length : end
      markRange(i, stop, MASK_COMMENT)
      i = stop
      continue
    }
    if (c === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      const stop = end === -1 ? source.length : end + 2
      markRange(i, stop, MASK_COMMENT)
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
      mask[i] = MASK_LITERAL
      const run = maskTemplateText(i + 1)
      i = run.at
      if (run.open) interpolations.push(0)
      lastSignificant = run.open ? '{' : '`'
      continue
    }
    if (
      c === '/' &&
      (regexCanStart(lastSignificant) || REGEX_AFTER_KEYWORD.has(wordBefore(source, i)))
    ) {
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
    // The `}` that closes the innermost `${ ... }`. Text mode starts again.
    if (interpolations.length > 0 && (c === '{' || c === '}')) {
      const top = interpolations.length - 1
      if (c === '{') interpolations[top]++
      else if (interpolations[top] > 0) interpolations[top]--
      else {
        mask[i] = MASK_LITERAL
        interpolations.pop()
        const run = maskTemplateText(i + 1)
        i = run.at
        if (run.open) interpolations.push(0)
        lastSignificant = run.open ? '{' : '`'
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

// A keyword can precede a regex too. Missing one lexes the regex body as code,
// so a quote inside it opens a run that masks the rest of the object and the
// site is dropped in silence.
const REGEX_AFTER_KEYWORD = new Set([
  'return',
  'typeof',
  'instanceof',
  'case',
  'in',
  'of',
  'do',
  'else',
  'yield',
  'await',
  'delete',
  'void',
  'throw',
  'new',
])

// The word that ends just before `index`, ignoring whitespace.
function wordBefore(source, index) {
  let j = index - 1
  while (j >= 0 && /\s/.test(source[j])) j--
  const end = j + 1
  while (j >= 0 && /[\w$]/.test(source[j])) j--
  return source.slice(j + 1, end)
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

// A .vue template is markup, not code. Exactly three places in it can name a
// component or a binding, and a rename anywhere else changes prose, a class
// list or a plain attribute value. The `d` flag gives each group's offsets.
// The tag: `<KeyboardShortcutsModal`, `</keyboard-shortcuts-modal`. A tag name
// is a name and nothing else, so the whole span opens up.
const TEMPLATE_TAG = /<\/?([A-Za-z][\w.-]*)/dg

// A bound attribute value holds a JS expression. HTML ends the value at the
// matching quote, so the quote is a reliable boundary. An unquoted value ends
// at the first space or `>`.
//
// The name covers every form: `:is`, `v-bind:is`, `v-if`, `@click`, `v-on:click`
// and a dynamic argument such as `:[prop]`.
const TEMPLATE_BINDING =
  /(?:^|\s)(?::|@|v-)[\w:.\-[\]]*\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+))/dg

// A mustache also holds a JS expression, but `}}` is not a reliable boundary:
// `{{ fn({ a: { b: 1 }}) + X }}` closes at the inner `}}` under a regex, and
// everything after it stays hidden, so `X` never migrates. So the end is found
// by walking the expression: the first `}}` at brace depth zero, outside a
// string or a comment.
function mustacheRanges(text, offset) {
  const spans = []
  let i = 0
  while (i < text.length - 1) {
    if (text[i] !== '{' || text[i + 1] !== '{') {
      i++
      continue
    }
    const start = i + 2
    const rest = text.slice(start)
    const restMask = maskLiterals(rest)
    let depth = 0
    let end = -1
    for (let j = 0; j < rest.length - 1; j++) {
      if (restMask[j]) continue
      const c = rest[j]
      if (c === '{') depth++
      else if (c === '}') {
        if (depth === 0 && rest[j + 1] === '}' && !restMask[j + 1]) {
          end = j
          break
        }
        depth--
      }
    }
    // No close: this `{{` is prose, not a mustache.
    if (end === -1) {
      i = start
      continue
    }
    spans.push([offset + start, offset + start + end])
    i = start + end + 2
  }
  return spans
}

// Every group of every match, as absolute spans.
function* matchedGroups(text, offset, pattern) {
  pattern.lastIndex = 0
  let m
  while ((m = pattern.exec(text))) {
    for (let group = 1; group < m.length; group++) {
      const span = m.indices[group]
      if (span) yield [offset + span[0], offset + span[1]]
    }
  }
}

// The parts of the file that are not `<script>`.
function outsideScript(source, ranges) {
  const outside = []
  let cursor = 0
  for (const [from, to] of ranges) {
    if (from > cursor) outside.push([cursor, from])
    cursor = Math.max(cursor, to)
  }
  if (cursor < source.length) outside.push([cursor, source.length])
  return outside
}

// A second mask, for the identifier rename only.
//
// Inside script code it hides strings, comments and regexes, so a module
// specifier like './useShortcut' or a name quoted in prose is never rewritten.
//
// A .vue template starts fully hidden, and only a tag, a bound attribute value
// and a mustache are opened up. A component tag still renames when global
// registration hides the import, and `class="useShortcut"` stays as it is.
function buildRenameMask(source, ranges, ext) {
  if (ext !== '.vue') return maskLiterals(source)

  const mask = new Uint8Array(source.length).fill(MASK_LITERAL)
  for (const [from, to] of ranges) {
    const sub = maskLiterals(source.slice(from, to))
    for (let i = 0; i < sub.length; i++) mask[from + i] = sub[i]
  }

  for (const [from, to] of outsideScript(source, ranges)) {
    const text = source.slice(from, to)
    for (const [start, end] of matchedGroups(text, from, TEMPLATE_TAG)) {
      for (let i = start; i < end; i++) mask[i] = 0
    }
    const expressions = [
      ...matchedGroups(text, from, TEMPLATE_BINDING),
      ...mustacheRanges(text, from),
    ]
    for (const [start, end] of expressions) {
      const sub = maskLiterals(source.slice(start, end))
      for (let i = 0; i < sub.length; i++) mask[start + i] = sub[i]
    }
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

  // A comment sits inside the segment a comma split off, so `key: 's', // save`
  // leaves the next segment starting at `//`. Skipping comments as well as
  // whitespace keeps the property name at the head, where the parser reads it.
  const skippable = (index) => /\s/.test(source[index]) || mask[index] === MASK_COMMENT

  const push = (from, to, commaEnd) => {
    let start = from
    let end = to
    while (start < end && skippable(start)) start++
    while (end > start && skippable(end - 1)) end--
    if (start >= end) return
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

// ---------- COMBO BUILDING ----------

// Returns a combo part or a refusal — never a guess.
//
// `prefix` is the modifier run this site holds, such as `Mod+`. A refusal
// names the key on its own and then the whole combo, because an author who
// pastes the key alone loses the modifiers and binds the bare key.
export function keyToComboPart(key, { hasShift, prefix = '' } = {}) {
  // The whole property to write, modifiers and all. Naming the key on its own
  // reads as an edit to `key`, and `key: 'Slash'` is still a v0 config: it
  // never fired, and the next run refuses it again.
  const write = (combo) => `\`combo: '${prefix}${combo}'\``

  if (key.length === 1) {
    if (/[a-z]/.test(key)) return { part: key.toUpperCase() }
    if (/[A-Z]/.test(key)) {
      if (hasShift) return { part: key }
      // v0 compared the letter case-insensitively, and skipped its Shift check
      // for an uppercase key, so `{ key: 'S' }` fired on S and on Shift+S
      // alike. v1 matches exactly, and no single combo covers both.
      return {
        refusal: `key '${key}' is uppercase with no \`shift: true\`. v0 matched the letter either way and ignored Shift, so it fired on ${key.toLowerCase()} and on Shift+${key}. v1 is exact. Write ${write(key)} for the plain key, ${write(`Shift+${key}`)} for the shifted one, or register both.`,
      }
    }
    if (/[0-9]/.test(key)) return { part: `Digit${key}`, digit: true }
    if (key in PUNCTUATION_NAMES) {
      return {
        refusal: `key '${key}' is punctuation. '${key}' would collide with the combo separator or with the keyboard layout, so v1 names the key \`${PUNCTUATION_NAMES[key]}\`. Write ${write(PUNCTUATION_NAMES[key])} by hand.`,
      }
    }
    if (key in SHIFTED_CHARS) {
      const nearMiss = NEAR_MISS_NAMES[key] ? ` ${NEAR_MISS_NAMES[key]}` : ''
      // The name already carries the Shift the site holds, so the prefix must
      // give its own up: `{ key: '>', shift: true }` is `Shift+Period`, never
      // `Shift+Shift+Period`. Shift is last in the modifier order, so dropping
      // it from the prefix keeps the rest in order.
      const held = hasShift ? prefix.replace('Shift+', '') : prefix
      return {
        refusal: `key '${key}' is a shifted character. v1 matches the physical key, which is named \`${SHIFTED_CHARS[key]}\`. Write \`combo: '${held}${SHIFTED_CHARS[key]}'\` by hand.${nearMiss}`,
      }
    }
  }

  const named = NAMED_KEY_BY_LOWER.get(key.toLowerCase())
  if (named) return { part: named, revived: DEAD_V0_SPELLINGS.has(key.toLowerCase()) }

  // A v1 key name in a v0 `key` field lands here, because v0 compared
  // `event.key` and never saw that spelling.
  const v1Name = key in PUNCTUATION_VALUES || SHIFTED_VALUES.has(key)
  const hint = v1Name
    ? ` \`${key}\` is a v1 key name, so write ${write(key)} instead of a \`key\`.`
    : ''
  return {
    refusal: `key '${key}' has no known v1 spelling. Take the name from the combo reference in the migration guide.${hint}`,
  }
}

// Every v1 key name the refusals above name, so a second run can tell an
// author who edited `key` instead of writing `combo` what went wrong.
const PUNCTUATION_VALUES = Object.fromEntries(
  Object.values(PUNCTUATION_NAMES).map((name) => [name, true]),
)
const SHIFTED_VALUES = new Set(Object.values(SHIFTED_CHARS).map((c) => c.split('+').pop()))

// Modifier order is fixed, so one combo has exactly one spelling.
const MODIFIER_ORDER = ['Mod', 'Ctrl', 'Alt', 'Shift']

export function buildCombo({ key, ctrl, alt, shift }) {
  const held = new Set()
  // v0's `ctrl` matched `ctrlKey || metaKey`, so it always meant Mod.
  if (ctrl) held.add('Mod')
  if (alt) held.add('Alt')
  if (shift) held.add('Shift')

  const modifiers = MODIFIER_ORDER.filter((m) => held.has(m))
  const prefix = modifiers.length > 0 ? `${modifiers.join('+')}+` : ''

  const { part, refusal, digit, revived } = keyToComboPart(key, {
    hasShift: !!shift,
    prefix,
  })
  if (refusal) return { refusal }

  return { combo: [...modifiers, part].join('+'), digit, revived }
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

  // Renaming `condition` on an object that already has `enabled` writes the
  // name twice. The later one wins in silence, and the file no longer lints.
  const refuseDoubleEnabled = () => ({
    refusals: [
      {
        line: lineAt(source, condition.start),
        message:
          'this object carries `condition` and `enabled`. Renaming `condition` would write `enabled` twice — merge them by hand.',
      },
    ],
  })

  const isOption = props.some((p) => p.name && OPTION_SIGNALS.has(p.name))
  const hasCallback = ['handler', ...HOLD_CALLBACKS].some((n) => byName.has(n))

  // Pass two: an object built by spreading a v0 config still carries
  // `condition`, which v1 spells `enabled`.
  if (!keyProp) {
    if (!condition || !hasCallback) return null
    if (!ctx.proven) {
      // `condition` beside a callback is the shape of a command entry and of a
      // `ComboboxCustomOption` as much as of a config, so it is never rewritten
      // here. It is worth a line when the object also carries a v0-only name.
      if (isOption || !byName.has('description')) return null
      return {
        unproven: true,
        note: {
          line: lineAt(source, condition.start),
          message:
            'this object carries `condition` beside a callback. If it is a shortcut config, v1 spells that `enabled`. The run cannot prove what this is, so it left it as it is.',
        },
      }
    }
    if (byName.has('enabled')) return refuseDoubleEnabled()
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

  // Nothing proves this object is a config, so nothing here rewrites it. The
  // run says what it would have written and moves on.
  if (!ctx.proven) {
    if (isOption) return null
    const literal = readStringLiteral(keyProp.value)
    if (!literal) return null

    const flags = {}
    for (const name of MODIFIER_PROPS) {
      if (byName.get(name)?.value.trim() === 'true') flags[name] = true
    }
    const held = MODIFIER_PROPS.some((name) => flags[name])
    const reads =
      props.some((p) => p.name && NOTE_SIGNALS.has(p.name)) ||
      ((hasCallback || condition) && held)
    if (!reads) return null

    const { combo, refusal } = buildCombo({ key: literal.value, ...flags })
    return {
      unproven: true,
      note: {
        line,
        message: `this reads like a shortcut config, and the run cannot prove it is one. It is not in a \`useShortcut(...)\` call this file imports from frappe-ui, and it carries no \`ShortcutConfig\` annotation, so it was left as it is. ${
          combo ? `If it is a shortcut, write \`combo: '${combo}'\`.` : refusal
        }`,
      },
    }
  }

  if (condition && byName.has('enabled')) return refuseDoubleEnabled()

  // A property with no readable name. A spread and a computed name both land
  // here, and each needs its own words: the reader has to find the thing the
  // message names.
  const unreadable = props.find((p) => p.name === null && !p.shorthand)
  if (unreadable) {
    return refuse(
      unreadable.text.startsWith('[')
        ? 'the shortcut object has a computed property name, so the run cannot tell what it holds. Convert it by hand.'
        : 'the shortcut object spreads another object, so its `key` and modifiers cannot be read here. Convert it by hand.',
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
    // `triggeredOn: 'press'` is the same dead callback as a missing
    // `triggeredOn`. v0 gated `onHold` and `onRelease` on 'hold' alone, so
    // here they never fired.
    if (mode.value !== 'hold' && hasHoldCallback) return refuse(DEAD_HOLD_CALLBACK)
    drops.push(triggeredOn.index)
  } else if (hasHoldCallback) {
    return refuse(DEAD_HOLD_CALLBACK)
  }

  const { combo, refusal, digit, revived } = buildCombo({ key: literal.value, ...flags })
  if (refusal) return refuse(refusal)

  const notes = revived
    ? [
        {
          line,
          message: `key '${literal.value}' never matched in v0: it compared \`event.key\`, which never reports that spelling. The combo '${combo}' does fire, so this shortcut is live now.`,
        },
      ]
    : []

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
    notes,
  }
}

// The span a bracket opens, from the bracket to its match.
function balancedRange(source, mask, open) {
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (mask[i]) continue
    const c = source[i]
    if (c === '(' || c === '{' || c === '[') depth++
    else if (c === ')' || c === '}' || c === ']') {
      depth--
      if (depth === 0) return [open, i]
    }
  }
  return null
}

// Where a v0 config is certain, and the only place anything is rewritten.
//
// Certainty has two sources, and both resolve through this file's imports:
//
//  - the argument list of a `useShortcut(...)` call whose name this file
//    imports from frappe-ui, and
//  - the value of a declaration annotated with a frappe-ui config type,
//    `const shortcuts: ShortcutConfig[] = [ ... ]`.
//
// A field name is never a source. `key`, `group`, `description`, `handler` and
// `condition` are frappe-ui's own option vocabulary as much as the shortcut
// vocabulary: `ComboboxCustomOption` carries `key`, `description` and
// `condition` together, and `ComboboxGroupedOption` carries `key` and `group`.
// Reading one as proof rewrites a Combobox option into a shortcut and reports
// a clean run. Everything the run cannot prove becomes a note.
//
// `maxDepth` is how deep inside the span an object may sit and still be the
// thing the span is about: one level for a call, because the argument may be
// an array, and none for an annotated value, because the array is the value.
function provenRanges(source, mask, bindings) {
  const ranges = []

  const callNames = CALL_NAMES.filter((name) => fromBarrel(bindings, name))
  if (callNames.length > 0) {
    const call = new RegExp(`\\b(?:${callNames.join('|')})\\s*\\(`, 'g')
    let m
    while ((m = call.exec(source))) {
      if (mask[m.index]) continue
      const span = balancedRange(source, mask, m.index + m[0].length - 1)
      if (span) ranges.push({ open: span[0], end: span[1], maxDepth: 1 })
    }
  }

  const typeNames = CONFIG_TYPES.filter((name) => fromBarrel(bindings, name))
  if (typeNames.length > 0) {
    const annotated = new RegExp(`:\\s*(?:${typeNames.join('|')})(?:\\s*\\[\\s*\\])?\\s*=`, 'g')
    let t
    while ((t = annotated.exec(source))) {
      if (mask[t.index]) continue
      let at = t.index + t[0].length
      while (at < source.length && (mask[at] || /\s/.test(source[at]))) at++
      if (source[at] !== '[' && source[at] !== '{') continue
      const span = balancedRange(source, mask, at)
      if (span) ranges.push({ open: span[0], end: span[1], maxDepth: 0 })
    }
  }

  return ranges
}

const CALL_NAMES = ['useShortcut', 'useKeyboardShortcut']
const CONFIG_TYPES = ['ShortcutConfig', 'KeyboardShortcutConfig']

function fromBarrel(bindings, name) {
  const module = bindings.get(name)
  return !!module && BARREL.test(module)
}

// True when the span holds this object directly, and not somewhere inside a
// callback body, where `{ key: 'a' }` is an analytics payload.
function holdsDirectly(source, mask, { open, maxDepth }, objectStart) {
  let depth = 0
  for (let i = open + 1; i < objectStart; i++) {
    if (mask[i]) continue
    const c = source[i]
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    if (depth < 0) return false
  }
  return depth <= maxDepth
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
  const unproven = []
  const edits = []

  const ranges = scriptRanges(content, ext)
  const mask = buildMask(content, ranges)
  const renameMask = buildRenameMask(content, ranges, ext)

  // A frappe-ui name stays frappe-ui's. A name this file imports from
  // somewhere else, or declares itself, belongs to the app, and nothing here
  // touches it or names it.
  //
  // Both reads run on the mask. A commented-out import is not an import, and a
  // name written in prose is not a declaration.
  const bindings = importBindings(content, renameMask)
  const appOwns = (name) => {
    const module = bindings.get(name)
    if (module) return !BARREL.test(module)
    return declaresLocally(content, name, renameMask)
  }
  const proven = provenRanges(content, mask, bindings)

  // The app's own `useShortcut`. Four of the apps we care about ship one, and
  // helpdesk's takes `(binding, callback)`, not a config. None of its objects
  // is ours, so the run says one line and touches nothing.
  const forked = CALL_NAMES.some((name) => appOwns(name))

  const seen = new Set()
  const visit = (offset) => {
    if (mask[offset]) return
    const range = ranges.find(([from, to]) => offset >= from && offset < to)
    if (!range) return
    const object = enclosingObject(content, mask, offset, range)
    if (!object || seen.has(object.start)) return
    seen.add(object.start)

    const isProven = proven.some(
      (span) =>
        object.start > span.open &&
        object.end <= span.end + 1 &&
        holdsDirectly(content, mask, span, object.start),
    )
    const result = convertObject(content, mask, object, { proven: isProven })
    if (!result) return
    if (result.note) {
      // An object the run could not prove. Whether it is advice or a stop
      // depends on the rest of the file, which is only known at the end.
      if (result.unproven) unproven.push(result.note)
      else notes.push(result.note)
      return
    }
    refusals.push(...(result.refusals ?? []))
    notes.push(...(result.notes ?? []))
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
  if (!forked) {
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
  }

  // A deleted member is flagged wherever it appears, comments included: the
  // name is gone from the package, so a stale mention is worth the noise.
  //
  // A name the app owns is not that name. An app's own `formatShortcutLabel`
  // or `RegisteredShortcut` keeps working, and a refusal on it can never be
  // cleared, so the file could never migrate. One line per name is enough: a
  // type used twenty times says the same thing twenty times.
  const deleted = new RegExp(`\\b(${Object.keys(DELETED_MEMBERS).join('|')})\\b`, 'g')
  const flagged = new Set()
  let d
  while ((d = deleted.exec(content))) {
    if (flagged.has(d[1]) || appOwns(d[1])) continue
    flagged.add(d[1])
    refusals.push({ line: lineAt(content, d.index), message: DELETED_MEMBERS[d[1]] })
  }

  // Only a call this file imports from frappe-ui. An app's own `useShortcut`
  // may well return something, and that is the app's business.
  const ourCalls = CALL_NAMES.filter((name) => fromBarrel(bindings, name))
  const destructured = new RegExp(
    `(?:const|let|var)\\s*\\{[^}]*\\}\\s*=\\s*(?:${ourCalls.join('|') || '(?!)'})\\s*\\(`,
    'g',
  )
  let r
  while ((r = destructured.exec(content))) {
    if (renameMask[r.index]) continue
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
  if (proven.length > 0) {
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
    if (renameMask[b.index]) continue
    // Only a v0 name counts. `KeyboardShortcutsDialog` is the v1 name, and a
    // test that mocks the barrel and mounts the dialog has nothing to fix, so
    // a refusal on it could never be cleared.
    const v0Names = new RegExp(`\\b(?:${Object.keys(IDENTIFIER_RENAMES).join('|')})\\b`, 'g')
    if (firstUnmasked(content, v0Names, renameMask) < 0) continue
    refusals.push({
      line: lineAt(content, b.index),
      message:
        "this mocks the 'frappe-ui' barrel. The mock key is renamed, but the captured configs still carry `key`/`ctrl` — update the assertions with the registrations.",
    })
  }

  const renames = []
  const nameLine = (name) => {
    const at = firstUnmasked(content, new RegExp(`\\b${name}\\b`, 'g'), renameMask)
    return lineAt(content, Math.max(0, at))
  }
  // A name the app owns is a note, never a refusal. Nothing the author can
  // write clears it: the fork is the app's and it keeps working. Helpdesk
  // imports its own `useShortcut` in ten files, and a refusal in each one
  // would hold every one of them back for good.
  const renameable = Object.keys(IDENTIFIER_RENAMES).filter((name) => {
    const module = bindings.get(name)
    if (module) {
      if (BARREL.test(module)) return true
      notes.push({
        line: nameLine(name),
        message: `\`${name}\` here comes from '${module}', not frappe-ui. It is the app's own, so nothing in this file was touched.`,
      })
      return false
    }
    if (declaresLocally(content, name, renameMask)) {
      notes.push({
        line: nameLine(name),
        message: `\`${name}\` is declared in this file, so it is the app's own. Nothing here was touched.`,
      })
      return false
    }
    return true
  })

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
    // The mask opens the tag name, not the `<` in front of it.
    if (renameMask[t.index + t[1].length]) continue
    edits.push({
      start: t.index + t[1].length,
      end: t.index + t[0].length,
      text: TAG_RENAMES[t[2]],
    })
    renames.push({ line: lineAt(content, t.index), from: t[2], to: TAG_RENAMES[t[2]] })
  }

  // An object the run walked away from is advice in a file it leaves alone,
  // and a stop in a file it would write. A converted site counts as much as a
  // rename: either one writes the file, and this object would reach v1 still
  // carrying `key`, where the first keypress throws. A note does not stop the
  // write, so in a file with other work it has to be a refusal.
  //
  // The refusal is dischargeable, both ways round. Write the `combo` by hand,
  // or annotate the array `KeyboardShortcutConfig[]` from frappe-ui and let
  // the next run convert it. Migrating the file by hand works too: with
  // nothing left to change, the object is a note again and the run exits zero.
  const willWrite = changes.length > 0 || renames.length > 0
  for (const item of unproven) {
    if (!willWrite) {
      notes.push(item)
      continue
    }
    refusals.push({
      line: item.line,
      message: `${item.message} The rest of this file does migrate, so writing it would leave this site on v0 beside a renamed call — v1 throws on the first keypress. Convert it by hand, or annotate it \`KeyboardShortcutConfig[]\` from frappe-ui so the next run can prove it.`,
    })
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

const OPTIONS = new Set(['--dry-run', '--help', '-h'])
const EXTENSIONS = new Set(['.vue', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'cache', 'coverage'])

function* walk(target) {
  if (fs.statSync(target).isFile()) {
    // The allowlist applies to a named file too. Rewriting a .json or a .md
    // that happens to hold a `key:` is never what the author asked for.
    if (EXTENSIONS.has(path.extname(target))) yield target
    else console.error(`Skipped ${target}: not a source file`)
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
  // An option this script does not know is a stop, not a shrug. `--dryrun`
  // used to fall through as a target-less flag and the run wrote every file.
  const unknown = args.filter((a) => a.startsWith('-') && !OPTIONS.has(a))
  if (unknown.length > 0) {
    console.error(`Unknown option: ${unknown.join(' ')}`)
    console.error(USAGE)
    process.exit(1)
  }

  const dryRun = args.includes('--dry-run')
  const targets = args.filter((a) => !a.startsWith('-'))

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

    // A note is advice about a site the run did not touch, so it carries over
    // whatever happened to the file. The interesting one lands in a file with
    // no change at all: an app's own fork, or a config array nothing proves.
    for (const refusal of refusals) allRefusals.push({ file, ...refusal })
    for (const note of notes) allNotes.push({ file, ...note })

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

    // A digit describes a conversion the run made. A refused file is
    // unchanged, so listing its digits would name work nobody did.
    for (const change of changes) if (change.digit) allDigits.push({ file, ...change })

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
    console.log('\n⚠ Read these — they do not fail the run:')
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
