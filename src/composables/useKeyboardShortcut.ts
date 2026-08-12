import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
  toValue,
  type MaybeRefOrGetter,
} from 'vue'

// ---------------------------------------------------------------------------
// Key vocabulary
//
// A combo is `Mod+Ctrl+Alt+Shift+<Key>`, in that order. Punctuation uses a
// name, never the character, because `+` is the separator.
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
// Config
// ---------------------------------------------------------------------------

interface KeyboardShortcutBase {
  /** The key combination, e.g. `"Mod+Shift+K"`. */
  combo: KeyboardShortcutCombo
  /** Label shown in `KeyboardShortcutsDialog`. Shortcuts sharing one are merged into a single row. */
  description: string
  /** Heading the shortcut is listed under in the dialog (default: `"General"`). */
  group?: string
  /** Fires only while this is `true`. When `false` the shortcut is inert and hidden from the dialog (default: `true`). */
  enabled?: MaybeRefOrGetter<boolean>
  /** Call `preventDefault()` on the matched event (default: `true`). */
  preventDefault?: boolean
  /** Fire while an input, textarea or contenteditable has focus (default: `false`). */
  allowInInput?: boolean
  /** Fire while focus is inside a `[role="dialog"]` element (default: `false`). */
  allowInDialog?: boolean
}

/** A shortcut that runs an action on each press. */
export interface PressKeyboardShortcutConfig extends KeyboardShortcutBase {
  /** Runs on keydown when the combo matches. */
  handler: (e: KeyboardEvent) => void
  onHold?: never
  onRelease?: never
}

/** A shortcut that stays on while the combo is held. */
export interface HoldKeyboardShortcutConfig extends KeyboardShortcutBase {
  handler?: never
  /** Runs once when the combo goes down. Its presence selects hold mode. */
  onHold: (e: KeyboardEvent) => void
  /** Runs when the combo is released. */
  onRelease?: (e: KeyboardEvent) => void
}

/**
 * One registration. Give it a `handler` for press mode, or an `onHold` for
 * hold mode. A hold shortcut takes no `handler`.
 */
export type KeyboardShortcutConfig =
  | PressKeyboardShortcutConfig
  | HoldKeyboardShortcutConfig

// ---------------------------------------------------------------------------
// Combo parsing
// ---------------------------------------------------------------------------

interface ParsedCombo {
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
  key: KeyboardShortcutKey
}

const isMac =
  typeof navigator !== 'undefined' &&
  (/Mac|iPod|iPhone|iPad/i.test(
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? '',
  ) ||
    /Mac OS X|Macintosh/i.test(navigator.userAgent))

const KEY_BY_LOWERCASE_NAME = new Map<string, KeyboardShortcutKey>(
  [...Object.keys(KEYS_BY_EVENT_KEY), ...Object.keys(KEYS_BY_EVENT_CODE)].map(
    (name) => [name.toLowerCase(), name as KeyboardShortcutKey],
  ),
)

const parseCache = new Map<string, ParsedCombo | null>()

/** @internal Exported for unit tests only. */
export function parseCombo(combo: string): ParsedCombo | null {
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
          if (isMac) parsed.meta = true
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
  const parsed = parseCombo(combo)
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
function isStillHeld(e: KeyboardEvent, parsed: ParsedCombo): boolean {
  if (matchesKey(e, parsed.key)) return false
  if (parsed.ctrl && !e.ctrlKey) return false
  if (parsed.meta && !e.metaKey) return false
  if (parsed.alt && !e.altKey) return false
  if (parsed.shift && !e.shiftKey) return false
  return true
}

// ---------------------------------------------------------------------------
// Dev warnings, once per key per page load
// ---------------------------------------------------------------------------

const warned = new Set<string>()

function warnOnce(key: string, message: string) {
  if (import.meta.env.PROD) return
  if (warned.has(key)) return
  warned.add(key)
  console.warn(`[frappe-ui] ${message}`)
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetKeyboardShortcutWarnings() {
  warned.clear()
}

// ---------------------------------------------------------------------------
// Registry (module-internal)
// ---------------------------------------------------------------------------

interface Registration {
  id: symbol
  config: KeyboardShortcutConfig
}

const registrations: Registration[] = []
const heldShortcuts = new Set<symbol>()
// Bumped on every register and unregister so `getShortcutGroups` recomputes.
const registryVersion = ref(0)

let listenerAttached = false

function isEnabled(config: KeyboardShortcutConfig): boolean {
  return toValue(config.enabled ?? true)
}

function isTargetEditable(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement | null
  if (!target) return false
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA'
  )
}

/** True when the keypress came from inside an open dialog (focus-trap owned). */
function isInsideDialog(e: KeyboardEvent): boolean {
  const target = e.target
  if (!(target instanceof Element)) return false
  return !!target.closest('[role="dialog"]')
}

function globalKeydownHandler(e: KeyboardEvent) {
  // Reverse order: the last registration that is live right now wins. A
  // shortcut whose `enabled` is false is not in the race at all, so two
  // registrations on one combo with opposite guards both keep working.
  const live: Registration[] = []
  for (let i = registrations.length - 1; i >= 0; i--) {
    const registration = registrations[i]
    const { config } = registration
    if (!matchesCombo(e, config.combo)) continue
    if (!isEnabled(config)) continue
    if (!config.allowInInput && isTargetEditable(e)) continue
    if (!config.allowInDialog && isInsideDialog(e)) continue
    live.push(registration)
  }

  if (!live.length) return
  if (live.length > 1) warnOnCollision(live)

  const { id, config } = live[0]

  if (config.preventDefault !== false) e.preventDefault()

  if (config.onHold) {
    if (!heldShortcuts.has(id)) {
      heldShortcuts.add(id)
      config.onHold(e)
    }
  } else {
    config.handler?.(e)
  }
}

function globalKeyupHandler(e: KeyboardEvent) {
  for (const { id, config } of [...registrations]) {
    if (!heldShortcuts.has(id)) continue
    const parsed = parseCombo(config.combo)
    if (!parsed || isStillHeld(e, parsed)) continue
    heldShortcuts.delete(id)
    config.onRelease?.(e)
  }
}

function attachGlobalListener() {
  // No-op during SSR. Registration still works; the listeners attach on the
  // first client-side call.
  if (typeof document === 'undefined') return
  if (listenerAttached) return
  listenerAttached = true
  document.addEventListener('keydown', globalKeydownHandler)
  document.addEventListener('keyup', globalKeyupHandler)
}

// Whether two registrations on one combo really collide depends on their
// guards, which only resolve at match time. Apps pair one combo with opposite
// `enabled` guards on purpose, so a registration-time warning would cry wolf.
// `live` is ordered last-registered first.
function warnOnCollision(live: Registration[]) {
  const active = live[0].config
  const shadowed = live[live.length - 1].config
  warnOnce(
    `duplicate:${active.combo}`,
    `Duplicate shortcut ${active.combo}:\n` +
      `  "${shadowed.description}" (registered first, now shadowed)\n` +
      `  "${active.description}" (active)`,
  )
}

// ---------------------------------------------------------------------------
// The dialog's view of the registry: module-internal, not a public export
// ---------------------------------------------------------------------------

/** One row in `KeyboardShortcutsDialog`. */
export interface KeyboardShortcutEntry {
  /** The combo of the first registration with this description. */
  combo: KeyboardShortcutCombo
  /** Combos of the later registrations that share the description. */
  altCombos: KeyboardShortcutCombo[]
  description: string
  group: string
}

/** One column in `KeyboardShortcutsDialog`. */
export interface KeyboardShortcutGroup {
  name: string
  shortcuts: KeyboardShortcutEntry[]
}

/**
 * @internal Groups every enabled shortcut for `KeyboardShortcutsDialog`.
 * Disabled shortcuts are left out. Shortcuts that share a group and a
 * description merge into one entry carrying the extra combos as `altCombos`.
 */
export function getShortcutGroups(): KeyboardShortcutGroup[] {
  registryVersion.value // track register / unregister

  const groups: KeyboardShortcutGroup[] = []
  const groupsByName = new Map<string, KeyboardShortcutGroup>()
  const entriesByIdentity = new Map<string, KeyboardShortcutEntry>()

  for (const { config } of registrations) {
    if (!isEnabled(config)) continue

    const name = config.group ?? 'General'
    let group = groupsByName.get(name)
    if (!group) {
      group = { name, shortcuts: [] }
      groupsByName.set(name, group)
      groups.push(group)
    }

    const identity = `${name}|${config.description}`
    const existing = entriesByIdentity.get(identity)
    if (existing) {
      if (
        existing.combo !== config.combo &&
        !existing.altCombos.includes(config.combo)
      ) {
        existing.altCombos.push(config.combo)
      }
      continue
    }

    const entry: KeyboardShortcutEntry = {
      combo: config.combo,
      altCombos: [],
      description: config.description,
      group: name,
    }
    entriesByIdentity.set(identity, entry)
    group.shortcuts.push(entry)
  }

  return groups
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Registers one or more keyboard shortcuts for as long as the calling
 * component is mounted. They are removed on unmount, and while the component
 * is deactivated inside a `<KeepAlive>` tree.
 *
 * Every registration also lists itself in `KeyboardShortcutsDialog`.
 *
 * @example
 * ```ts
 * useKeyboardShortcut([
 *   { combo: 'Mod+S', description: 'Save', group: 'File', handler: save },
 *   { combo: 'Mod+Z', description: 'Undo', enabled: canEdit, handler: undo },
 * ])
 * ```
 */
export function useKeyboardShortcut(
  shortcuts: KeyboardShortcutConfig | KeyboardShortcutConfig[],
): void {
  attachGlobalListener()

  const configs = Array.isArray(shortcuts) ? shortcuts : [shortcuts]
  const owned: Registration[] = configs.map((config) => ({
    id: Symbol(config.description),
    config,
  }))

  const add = () => {
    for (const registration of owned) {
      if (registrations.includes(registration)) continue
      registrations.push(registration)
    }
    registryVersion.value++
  }

  const remove = () => {
    for (const registration of owned) {
      const index = registrations.indexOf(registration)
      if (index !== -1) registrations.splice(index, 1)
      heldShortcuts.delete(registration.id)
    }
    registryVersion.value++
  }

  add()

  onBeforeUnmount(remove)
  onDeactivated(remove)
  onActivated(add)
}
