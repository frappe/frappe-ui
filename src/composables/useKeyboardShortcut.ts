import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
  toValue,
  type MaybeRefOrGetter,
} from 'vue'
import {
  isStillHeld,
  matchesCombo,
  parseComboForMatching,
  warnOnce,
  type KeyboardShortcutCombo,
} from '../utils/keyboardShortcutCombo'

// The combo grammar — the key tables, the parser, the matcher — lives in
// `utils/keyboardShortcutCombo.ts`, next to the display half the chip draws
// with. This file is the registry and the lifecycle around it.
export type {
  KeyboardShortcutCombo,
  KeyboardShortcutKey,
} from '../utils/keyboardShortcutCombo'

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
  /**
   * Runs when the combo is released. Also runs, with no event, when the
   * component unmounts or is deactivated while the combo is still down.
   */
  onRelease?: (e?: KeyboardEvent) => void
}

/**
 * One registration. Give it a `handler` for press mode, or an `onHold` for
 * hold mode. A hold shortcut takes no `handler`.
 */
export type KeyboardShortcutConfig =
  | PressKeyboardShortcutConfig
  | HoldKeyboardShortcutConfig

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

/**
 * True when the keypress belongs to whatever the user is typing in — an input,
 * a textarea, or a contenteditable. A shortcut that swallows those keys leaves
 * the field looking broken, so every keydown listener on the document owes it
 * this check.
 */
export function isTargetEditable(e: KeyboardEvent): boolean {
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
    const parsed = parseComboForMatching(config.combo)
    if (!parsed || isStillHeld(e, parsed)) continue
    heldShortcuts.delete(id)
    // Guarded like the release path in `remove()`: a throwing `onRelease` must
    // not escape the document listener and leave the other held shortcuts
    // stuck down with nothing left to release them.
    try {
      config.onRelease?.(e)
    } catch (error) {
      console.error(
        `[frappe-ui] onRelease for "${config.description}" threw on keyup.`,
        error,
      )
    }
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
// `live` is ordered last-registered first, so the message lists the active
// shortcut first and the earliest registration last. Three or more can be live
// at once, so every one is named. Naming only the ends hides the middle.
function warnOnCollision(live: Registration[]) {
  const { combo } = live[0].config
  const lines = live.map(
    ({ config }, i) =>
      `  "${config.description}" (${i === 0 ? 'active' : 'shadowed'})`,
  )
  warnOnce(
    `duplicate:${combo}`,
    `Duplicate shortcut ${combo}. ${live.length} shortcuts are live on ` +
      `this keypress:\n${lines.join('\n')}`,
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
    // A combo that is still down when the component goes away gets no `keyup`,
    // so release it here. Whatever `onHold` switched on would stay on with no
    // shortcut left to switch it off.
    const released: KeyboardShortcutConfig[] = []
    for (const registration of owned) {
      const index = registrations.indexOf(registration)
      if (index !== -1) registrations.splice(index, 1)
      // `delete` reports whether the id was held, so each held shortcut
      // releases once and one that was never held releases never.
      if (heldShortcuts.delete(registration.id)) {
        released.push(registration.config)
      }
    }
    registryVersion.value++

    // Last, and one callback at a time: a throwing `onRelease` must not leave a
    // registration in the list or block the next release.
    for (const config of released) {
      try {
        config.onRelease?.()
      } catch (error) {
        console.error(
          `[frappe-ui] onRelease for "${config.description}" threw while the ` +
            `shortcut was being removed.`,
          error,
        )
      }
    }
  }

  add()

  onBeforeUnmount(remove)
  onDeactivated(remove)
  onActivated(add)
}
