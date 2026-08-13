// The combo grammar defined in `spec/shortcuts.md`, both halves in one file:
// the matching half `useKeyboardShortcut` fires on, and the display half
// `KeyboardShortcut` and `KeyboardShortcutsDialog` draw. An older, looser
// vocabulary (`cmd`, `meta`, `option`, `esc`, `del`) is gone: it drew a chip
// for a combo that could never fire, which is the silent failure this family
// exists to remove.
//
// It sits in `utils` because a composable and two components read it. Neither
// layer owns it, so neither layer imports the other to reach it.
//
// `KeyboardShortcut`'s `combo` prop stays typed `string`, because callers
// usually compute it, so the check happens here at runtime.

// ---------------------------------------------------------------------------
// Key vocabulary
//
// A combo is `Mod+Ctrl+Alt+Shift+<Key>`. That order is the canonical spelling
// and `KeyboardShortcutCombo` enforces it at a typed call site, but both
// parsers below read the modifiers in any order. Punctuation uses a name,
// never the character, because `+` is the separator.
//
// Letters, function keys and named keys match `event.key`. Digits and
// punctuation match `event.code`, so `Mod+Shift+Digit1` fires on both the
// digit and the shifted character the layout puts on that physical key.
// ---------------------------------------------------------------------------

/** Keys matched against `event.key`. */
const KEYS_BY_EVENT_KEY = {
  A: 'a',
  B: 'b',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  U: 'u',
  V: 'v',
  W: 'w',
  X: 'x',
  Y: 'y',
  Z: 'z',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  Escape: 'Escape',
  Enter: 'Enter',
  Tab: 'Tab',
  Space: ' ',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Insert: 'Insert',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
} as const

/** Keys matched against `event.code`, so a shifted character still resolves. */
const KEYS_BY_EVENT_CODE = {
  Digit0: 'Digit0',
  Digit1: 'Digit1',
  Digit2: 'Digit2',
  Digit3: 'Digit3',
  Digit4: 'Digit4',
  Digit5: 'Digit5',
  Digit6: 'Digit6',
  Digit7: 'Digit7',
  Digit8: 'Digit8',
  Digit9: 'Digit9',
  /** The keypad `+`. The `+` a layout types with Shift is `Shift+Equal`. */
  Plus: 'NumpadAdd',
  Minus: 'Minus',
  Equal: 'Equal',
  Slash: 'Slash',
  Backslash: 'Backslash',
  Backtick: 'Backquote',
  Comma: 'Comma',
  Period: 'Period',
  Semicolon: 'Semicolon',
  Quote: 'Quote',
  BracketLeft: 'BracketLeft',
  BracketRight: 'BracketRight',
} as const

// Which table a key sits in is an internal detail: an app names a key with
// `KeyboardShortcutKey`, or a whole combo with `KeyboardShortcutCombo`. Both
// halves stay module-internal so the split is free to move after 1.0.0 (P13).

/** A key name matched against `event.key`. */
type KeyboardShortcutNamedKey = keyof typeof KEYS_BY_EVENT_KEY
/** A key name matched against `event.code`. */
type KeyboardShortcutCodedKey = keyof typeof KEYS_BY_EVENT_CODE
/** Every key name a combo accepts. */
export type KeyboardShortcutKey =
  | KeyboardShortcutNamedKey
  | KeyboardShortcutCodedKey

/**
 * @internal Exported for unit tests only: every key name a combo accepts, so a
 * test can walk them through the display grammar below and catch the matching
 * tables and `KEY_DISPLAY` drifting apart.
 */
export const _keyboardShortcutKeyNames = [
  ...Object.keys(KEYS_BY_EVENT_KEY),
  ...Object.keys(KEYS_BY_EVENT_CODE),
] as KeyboardShortcutKey[]

type ModPrefix = '' | 'Mod+'
type CtrlPrefix = '' | 'Ctrl+'
type AltPrefix = '' | 'Alt+'
type ShiftPrefix = '' | 'Shift+'

/**
 * A key combination, written `Mod+Ctrl+Alt+Shift+<Key>` with the modifiers in
 * that order. `Mod` is Cmd on macOS and Ctrl elsewhere; `Ctrl` is Control on
 * every platform.
 */
export type KeyboardShortcutCombo =
  `${ModPrefix}${CtrlPrefix}${AltPrefix}${ShiftPrefix}${KeyboardShortcutKey}`

// ---------------------------------------------------------------------------
// Platform
// ---------------------------------------------------------------------------

/**
 * True on an Apple platform, where `Mod` draws ⌘ instead of Ctrl. The chip, the
 * dialog's search and the matcher all read this, so what a row shows is what
 * fires.
 */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false
  const platform =
    (navigator as any).userAgentData?.platform || navigator.platform || ''
  if (/Mac|iPod|iPhone|iPad/i.test(platform)) return true
  return /Mac OS X|Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// ---------------------------------------------------------------------------
// Dev warnings, once per key per page load
//
// The two halves keep separate dedup sets, so a test that resets one still
// sees the other's first warning.
// ---------------------------------------------------------------------------

const warnedMatchKeys = new Set<string>()

/** @internal Exported for the shortcut registry's duplicate warning. */
export function warnOnce(key: string, message: string) {
  if (import.meta.env.PROD) return
  if (warnedMatchKeys.has(key)) return
  warnedMatchKeys.add(key)
  console.warn(`[frappe-ui] ${message}`)
}

/**
 * Test-only: clear the dedup set so each test sees a fresh warning surface.
 * The parse cache goes with it. `parseComboForMatching` returns a cached
 * verdict before it warns, so a cache left behind swallows the next warning.
 */
export function _resetKeyboardShortcutWarnings() {
  warnedMatchKeys.clear()
  parseCache.clear()
}

const warnedDisplayTokens = new Set<string>()

/**
 * Warns about one part the matching half would refuse. `slot` is where the part
 * sits: every part but the last is a modifier, and the last one is the key.
 */
function warnBadPart(part: string, combo: string, slot: 'modifier' | 'key') {
  if (import.meta.env.PROD) return
  // Deduped per slot, not per token: `Shift` is a name the grammar knows, and
  // it is only wrong in the key slot.
  const dedupKey = `${slot}:${part.toLowerCase()}`
  if (warnedDisplayTokens.has(dedupKey)) return
  warnedDisplayTokens.add(dedupKey)
  const named = part === '' ? 'An empty part' : `"${part}"`
  const wanted = slot === 'key' ? 'a key name' : 'a modifier'
  console.warn(
    `[frappe-ui] ${named} in the combo "${combo}" is not ${wanted} ` +
      `KeyboardShortcut knows, so it renders as written and the combo never ` +
      `fires. Write the modifiers as Mod+Ctrl+Alt+Shift and name the key ` +
      `(e.g. "Mod+Shift+K", "Mod+Slash", "Mod+Shift+Digit1").`,
  )
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetComboWarnings() {
  warnedDisplayTokens.clear()
}

// ---------------------------------------------------------------------------
// Matching half: what a combo fires on
// ---------------------------------------------------------------------------

interface ParsedCombo {
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
  key: KeyboardShortcutKey
}

const KEY_BY_LOWERCASE_NAME = new Map<string, KeyboardShortcutKey>(
  [...Object.keys(KEYS_BY_EVENT_KEY), ...Object.keys(KEYS_BY_EVENT_CODE)].map(
    (name) => [name.toLowerCase(), name as KeyboardShortcutKey],
  ),
)

const parseCache = new Map<string, ParsedCombo | null>()

/** @internal Exported for unit tests only. */
export function parseComboForMatching(combo: string): ParsedCombo | null {
  // A JavaScript call site can hand us anything, including the v0 config that
  // had no `combo` at all. Warn rather than throw from a global listener.
  if (typeof combo !== 'string') {
    warnOnce(
      'combo:missing',
      `A shortcut was registered without a combo, so it will never fire. ` +
        `Replace the v0 key/ctrl/shift/alt fields with one combo string, ` +
        `e.g. { key: 's', ctrl: true } becomes { combo: 'Mod+S' }.`,
    )
    return null
  }

  const cached = parseCache.get(combo)
  if (cached !== undefined) return cached

  const parts = combo.split('+').map((part) => part.trim())
  const rawKey = parts.pop() ?? ''
  const key = KEY_BY_LOWERCASE_NAME.get(rawKey.toLowerCase())

  let parsed: ParsedCombo | null = key
    ? { ctrl: false, meta: false, alt: false, shift: false, key }
    : null

  if (parsed) {
    for (const modifier of parts) {
      switch (modifier.toLowerCase()) {
        case 'mod':
          // The chip reads the same check, so what a row draws is what fires.
          if (isMacPlatform()) parsed.meta = true
          else parsed.ctrl = true
          break
        case 'ctrl':
          parsed.ctrl = true
          break
        case 'alt':
          parsed.alt = true
          break
        case 'shift':
          parsed.shift = true
          break
        default:
          parsed = null
      }
      if (!parsed) break
    }
  }

  if (!parsed) {
    warnOnce(
      `combo:${combo}`,
      `"${combo}" is not a valid shortcut combo, so it will never fire. ` +
        `Write the modifiers as Mod+Ctrl+Alt+Shift and name the key ` +
        `(e.g. "Mod+Shift+K", "Mod+Slash", "Mod+Shift+Digit1").`,
    )
  }

  parseCache.set(combo, parsed)
  return parsed
}

function matchesKey(e: KeyboardEvent, key: KeyboardShortcutKey): boolean {
  if (key in KEYS_BY_EVENT_CODE) {
    return e.code === KEYS_BY_EVENT_CODE[key as KeyboardShortcutCodedKey]
  }
  const expected = KEYS_BY_EVENT_KEY[key as KeyboardShortcutNamedKey]
  return e.key.toLowerCase() === expected.toLowerCase()
}

/** @internal Exported for unit tests only. */
export function matchesCombo(e: KeyboardEvent, combo: string): boolean {
  const parsed = parseComboForMatching(combo)
  if (!parsed) return false
  if (e.ctrlKey !== parsed.ctrl) return false
  if (e.metaKey !== parsed.meta) return false
  if (e.altKey !== parsed.alt) return false
  if (e.shiftKey !== parsed.shift) return false
  return matchesKey(e, parsed.key)
}

// A held shortcut ends when its own key goes up, or when a modifier it needs
// goes up. Modifiers it does not need are ignored, so releasing Shift on a
// `Mod+L` hold keeps it running.
export function isStillHeld(e: KeyboardEvent, parsed: ParsedCombo): boolean {
  if (matchesKey(e, parsed.key)) return false
  if (parsed.ctrl && !e.ctrlKey) return false
  if (parsed.meta && !e.metaKey) return false
  if (parsed.alt && !e.altKey) return false
  if (parsed.shift && !e.shiftKey) return false
  return true
}

// ---------------------------------------------------------------------------
// Display half: what a combo draws
// ---------------------------------------------------------------------------

export interface ComboPart {
  raw: string
  /** `cmd`, `ctrl`, `shift`, `alt` or `key`. */
  type: string
  display: string
}

const MODIFIERS = ['mod', 'ctrl', 'alt', 'shift']

/** Every key name in the grammar whose display differs from the name. */
const KEY_DISPLAY: Record<string, string> = {
  escape: 'Esc',
  enter: '↵',
  space: 'Space',
  tab: 'Tab',
  insert: 'Insert',
  backspace: '⌫',
  delete: '⌦',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  pageup: 'PgUp',
  pagedown: 'PgDn',
  home: 'Home',
  end: 'End',
  digit0: '0',
  digit1: '1',
  digit2: '2',
  digit3: '3',
  digit4: '4',
  digit5: '5',
  digit6: '6',
  digit7: '7',
  digit8: '8',
  digit9: '9',
  /** The keypad `+`. The `+` a normal keyboard types is `Shift+Equal`. */
  plus: '+',
  minus: '-',
  equal: '=',
  slash: '/',
  backslash: '\\',
  backtick: '`',
  comma: ',',
  period: '.',
  semicolon: ';',
  quote: "'",
  bracketleft: '[',
  bracketright: ']',
}

/**
 * Spoken names for the glyphs and abbreviations a part can display. A screen
 * reader reads a lone `[` as nothing useful, and reads `PgDn` as written, so
 * every glyph and every shortened name gets a word.
 */
const WORD_BY_DISPLAY: Record<string, string> = {
  '⌘': 'Command',
  Esc: 'Escape',
  PgUp: 'Page Up',
  PgDn: 'Page Down',
  Shift: 'Shift',
  '⌥': 'Option',
  Alt: 'Alt',
  Ctrl: 'Control',
  '↵': 'Enter',
  '⌫': 'Backspace',
  '⌦': 'Delete',
  '↑': 'Up Arrow',
  '↓': 'Down Arrow',
  '←': 'Left Arrow',
  '→': 'Right Arrow',
  '+': 'Plus',
  '-': 'Minus',
  '=': 'Equal',
  '/': 'Slash',
  '\\': 'Backslash',
  '`': 'Backtick',
  ',': 'Comma',
  '.': 'Period',
  ';': 'Semicolon',
  "'": 'Quote',
  '[': 'Bracket Left',
  ']': 'Bracket Right',
}

/** The text a parsed combo draws, e.g. `Ctrl /` for `Mod+Slash`. */
export function displayText(parts: ComboPart[]): string {
  return parts.map((part) => part.display).join(' ')
}

const isLetter = (lower: string) => /^[a-z]$/.test(lower)
const isFunctionKey = (lower: string) => /^f([1-9]|1[0-2])$/.test(lower)

// A plain lookup walks the prototype, so `combo="constructor"` would render a
// function body. Only own keys count.
const isKeyName = (lower: string) =>
  Object.hasOwn(KEY_DISPLAY, lower) || isLetter(lower) || isFunctionKey(lower)

function parsePart(
  original: string,
  raw: string,
  isMac: boolean,
  slot: 'modifier' | 'key',
): ComboPart {
  const lower = original.toLowerCase()
  const isModifier = MODIFIERS.includes(lower)

  // The grammar is modifiers first, one key last. A part in the wrong slot is
  // a part the matching half refuses, so it warns here too: `Mod+Shift` drew
  // ⌘ ⇧ and fired on nothing.
  if (slot === 'key' ? !isKeyName(lower) : !isModifier) {
    warnBadPart(original, raw, slot)
  }

  if (isModifier) {
    if (lower === 'shift')
      return { raw: original, type: 'shift', display: 'Shift' }
    if (lower === 'alt')
      return { raw: original, type: 'alt', display: isMac ? '⌥' : 'Alt' }
    if (lower === 'ctrl' || !isMac)
      return { raw: original, type: 'ctrl', display: 'Ctrl' }
    return { raw: original, type: 'cmd', display: '⌘' }
  }

  if (Object.hasOwn(KEY_DISPLAY, lower)) {
    return { raw: original, type: 'key', display: KEY_DISPLAY[lower] }
  }
  if (isLetter(lower) || isFunctionKey(lower)) {
    return { raw: original, type: 'key', display: lower.toUpperCase() }
  }

  return { raw: original, type: 'key', display: original }
}

export function parseCombo(
  raw: string | undefined,
  isMac: boolean,
): ComboPart[] {
  if (!raw) return []

  // Empty parts are kept, not filtered out: `Mod++K` splits into
  // `['Mod', '', 'K']`, and dropping the empty part drew ⌘ K for a combo the
  // matching half refuses.
  const originals = raw.split('+').map((part) => part.trim())
  const keyIndex = originals.length - 1
  const parts = originals.map((original, index) =>
    parsePart(original, raw, isMac, index === keyIndex ? 'key' : 'modifier'),
  )

  // `Mod` and `Ctrl` are one modifier off macOS, so `Mod+Ctrl+K` would draw
  // two Ctrl chips for a key the user presses once. The matching half collapses
  // them the same way.
  const seenModifiers = new Set<string>()
  return parts.filter((part) => {
    if (part.type === 'key') return true
    if (seenModifiers.has(part.type)) return false
    seenModifiers.add(part.type)
    return true
  })
}

/** Spells a parsed combo for an `aria-label`. */
export function spellOut(parts: ComboPart[]): string {
  return parts
    .map((p) =>
      Object.hasOwn(WORD_BY_DISPLAY, p.display)
        ? WORD_BY_DISPLAY[p.display]
        : p.display,
    )
    .join(' + ')
}
