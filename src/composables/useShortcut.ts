import {
  computed,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  reactive,
  readonly,
} from 'vue'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShortcutConfig {
  /** Shortcut key(s) to listen for (e.g. "s", "Escape", "ArrowUp") */
  key: string
  /** Whether Ctrl (or Cmd on Mac) must be held */
  ctrl?: boolean
  /** Whether Shift must be held */
  shift?: boolean
  /** Human-readable label shown in the shortcuts modal */
  description: string
  /** Group name for categorising in the shortcuts modal */
  group?: string
  /** Whether the action fires on press ("press") or while held ("hold") */
  triggeredOn?: 'press' | 'hold'
  /** Handler called on keydown when the shortcut matches */
  handler?: (e: KeyboardEvent) => void
  /** Called each keydown while the shortcut is being held (triggeredOn: "hold") */
  onHold?: (e: KeyboardEvent) => void
  /** Called on keyup when the held shortcut is released (triggeredOn: "hold") */
  onRelease?: (e: KeyboardEvent) => void
  /** Prevent default browser behaviour (default: true) */
  preventDefault?: boolean
  /** Allow the shortcut to fire when an input / textarea is focused (default: false) */
  allowInInput?: boolean
  /**
   * Condition function — the shortcut fires only when this returns `true`.
   * When absent the shortcut is always active.
   */
  condition?: () => boolean
}

export interface RegisteredShortcut {
  key: string
  ctrl: boolean
  shift: boolean
  description: string
  group: string
  id: symbol
  condition?: () => boolean
}

/** A `RegisteredShortcut` enriched with all resolved key aliases. */
export interface ActiveShortcut extends RegisteredShortcut {
  keys: string[]
}

// ---------------------------------------------------------------------------
// Module-level state (global singleton)
// ---------------------------------------------------------------------------

const activeShortcuts = reactive<RegisteredShortcut[]>([])
const shortcutHandlers = new Map<symbol, ShortcutConfig>()
const heldShortcuts = new Set<symbol>()

let listenerAttached = false

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isCtrlOrCmd(e: KeyboardEvent): boolean {
  return e.ctrlKey || e.metaKey
}

function isTargetEditable(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA'
  )
}

function isDialogOpen(): boolean {
  return !!document.querySelector("[role='dialog']")
}

function matchesShortcut(e: KeyboardEvent, config: ShortcutConfig): boolean {
  if (
    e.key.toLowerCase() !== config.key.toLowerCase() &&
    e.key !== config.key
  ) {
    return false
  }

  const wantsCtrl = config.ctrl ?? false
  const wantsShift = config.shift ?? false

  if (wantsCtrl && !isCtrlOrCmd(e)) return false
  if (!wantsCtrl && isCtrlOrCmd(e)) return false

  // For keys whose character is itself produced by Shift (e.g. "?" = Shift+/)
  // only enforce the Shift check when explicitly requested in the config.
  const isShiftProducedKey =
    config.key !== config.key.toLowerCase() ||
    /^[?!@#$%^&*()_+{}|:"<>~]$/.test(config.key)

  if (wantsShift && !e.shiftKey) return false
  if (!wantsShift && e.shiftKey && !isShiftProducedKey) return false

  return true
}

function isShortcutStillPressed(
  e: KeyboardEvent,
  config: ShortcutConfig,
): boolean {
  const wantsCtrl = config.ctrl ?? false
  const wantsShift = config.shift ?? false
  if (wantsCtrl && !isCtrlOrCmd(e)) return false
  if (wantsShift && !e.shiftKey) return false
  return true
}

function globalKeydownHandler(e: KeyboardEvent) {
  if (isDialogOpen()) return

  for (const [id, config] of shortcutHandlers) {
    if (!matchesShortcut(e, config)) continue
    if (config.condition && !config.condition()) continue
    if (!config.allowInInput && isTargetEditable(e)) continue

    if (config.preventDefault !== false) e.preventDefault()

    config.handler?.(e)

    if (config.triggeredOn === 'hold' && !heldShortcuts.has(id)) {
      heldShortcuts.add(id)
      config.onHold?.(e)
    }

    return // fire first match only
  }
}

function globalKeyupHandler(e: KeyboardEvent) {
  if (isDialogOpen()) return

  const toRelease: symbol[] = []

  for (const id of heldShortcuts) {
    const config = shortcutHandlers.get(id)
    if (!config || config.triggeredOn !== 'hold') continue
    if (!isShortcutStillPressed(e, config)) toRelease.push(id)
  }

  for (const id of toRelease) {
    const config = shortcutHandlers.get(id)
    config?.onRelease?.(e)
    heldShortcuts.delete(id)
  }
}

function attachGlobalListener() {
  if (listenerAttached) return
  listenerAttached = true
  document.addEventListener('keydown', globalKeydownHandler)
  document.addEventListener('keyup', globalKeyupHandler)
}

// ---------------------------------------------------------------------------
// Identity helper for merging duplicate shortcuts in the modal
// ---------------------------------------------------------------------------

function getShortcutMergeIdentity(
  shortcut: Pick<
    RegisteredShortcut,
    'group' | 'description' | 'ctrl' | 'shift'
  >,
): string {
  return [
    shortcut.group,
    shortcut.description,
    Boolean(shortcut.ctrl),
    Boolean(shortcut.shift),
  ].join('|')
}

// ---------------------------------------------------------------------------
// formatShortcutLabel — convenience helper for inline display
// ---------------------------------------------------------------------------

const isMacPlatform =
  typeof navigator !== 'undefined' &&
  (/Mac|iPod|iPhone|iPad/i.test(
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? '',
  ) ||
    /Mac OS X|Macintosh/i.test(navigator.userAgent))

/**
 * Returns a short human-readable string for a shortcut, e.g. `"⌘ K"` or
 * `"Ctrl + K"`.
 */
export function formatShortcutLabel(config: {
  key: string
  ctrl?: boolean
  shift?: boolean
}): string {
  const parts: string[] = []
  if (config.ctrl) parts.push(isMacPlatform ? '⌘' : 'Ctrl')
  if (config.shift) parts.push(isMacPlatform ? '⇧' : 'Shift')

  const keyMap: Record<string, string> = {
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    escape: 'Esc',
    backspace: '⌫',
    delete: 'Del',
    enter: '↵',
    ' ': 'Space',
    '\\': '\\',
    '=': '+',
    '-': '−',
  }

  const displayKey =
    keyMap[config.key.toLowerCase()] ?? config.key.toUpperCase()
  parts.push(displayKey)

  return parts.join(isMacPlatform ? ' ' : ' + ')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Register one or more keyboard shortcuts that are automatically cleaned up
 * when the component unmounts (or is deactivated in a `<KeepAlive>` tree).
 *
 * @example
 * ```ts
 * useShortcut([
 *   {
 *     key: 's',
 *     ctrl: true,
 *     description: 'Save',
 *     group: 'General',
 *     handler: () => save(),
 *   },
 *   {
 *     key: 'z',
 *     ctrl: true,
 *     description: 'Undo',
 *     group: 'Edit',
 *     handler: () => undo(),
 *   },
 * ])
 * ```
 */
export function useShortcut(shortcuts: ShortcutConfig | ShortcutConfig[]): {
  activeShortcuts: Readonly<RegisteredShortcut[]>
  formatShortcutLabel: typeof formatShortcutLabel
} {
  attachGlobalListener()

  const configs = Array.isArray(shortcuts) ? shortcuts : [shortcuts]
  const registeredIds: symbol[] = []

  for (const config of configs) {
    const id = Symbol(config.description)
    const registered: RegisteredShortcut = {
      key: config.key,
      ctrl: config.ctrl ?? false,
      shift: config.shift ?? false,
      description: config.description,
      group: config.group ?? 'General',
      id,
      condition: config.condition,
    }

    shortcutHandlers.set(id, config)
    activeShortcuts.push(registered)
    registeredIds.push(id)
  }

  const removeShortcuts = () => {
    for (const id of registeredIds) {
      shortcutHandlers.delete(id)
      heldShortcuts.delete(id)
      const idx = activeShortcuts.findIndex((s) => s.id === id)
      if (idx !== -1) activeShortcuts.splice(idx, 1)
    }
  }

  const addShortcuts = () => {
    for (let i = 0; i < configs.length; i++) {
      const id = registeredIds[i]
      if (!shortcutHandlers.has(id)) {
        shortcutHandlers.set(id, configs[i])
        activeShortcuts.push({
          key: configs[i].key,
          ctrl: configs[i].ctrl ?? false,
          shift: configs[i].shift ?? false,
          description: configs[i].description,
          group: configs[i].group ?? 'General',
          id,
          condition: configs[i].condition,
        })
      }
    }
  }

  onBeforeUnmount(removeShortcuts)
  onDeactivated(removeShortcuts)
  onActivated(addShortcuts)

  return {
    activeShortcuts: readonly(activeShortcuts),
    formatShortcutLabel,
  }
}

/**
 * Returns a computed ref of all currently active shortcuts whose conditions
 * are met. Duplicate entries (same group + description + modifiers) are merged
 * into a single `ActiveShortcut` with multiple `keys`.
 *
 * Typically consumed by `<KeyboardShortcutsModal>`.
 */
export function getActiveShortcuts() {
  return computed<ActiveShortcut[]>(() => {
    const visible = activeShortcuts.filter((s) => !s.condition || s.condition())
    const merged = new Map<string, ActiveShortcut>()

    for (const shortcut of visible) {
      const identity = getShortcutMergeIdentity(shortcut)
      const existing = merged.get(identity)

      if (!existing) {
        merged.set(identity, { ...shortcut, keys: [shortcut.key] })
        continue
      }

      if (
        !existing.keys.some(
          (k) => k.toLowerCase() === shortcut.key.toLowerCase(),
        )
      ) {
        existing.keys.push(shortcut.key)
      }
    }

    return [...merged.values()]
  })
}
