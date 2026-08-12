// The display side of the combo grammar defined in `spec/shortcuts.md`, the
// one `useKeyboardShortcut` fires on. An older, looser vocabulary (`cmd`,
// `meta`, `option`, `esc`, `del`) is gone: it drew a chip for a combo that
// could never fire, which is the silent failure this family exists to remove.
//
// `KeyboardShortcut`'s `combo` prop stays typed `string`, because callers
// usually compute it, so the check happens here at runtime.

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

/** Spoken names for the glyphs a part can display. */
const WORD_BY_DISPLAY: Record<string, string> = {
  '⌘': 'Command',
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
}

const isLetter = (lower: string) => /^[a-z]$/.test(lower)
const isFunctionKey = (lower: string) => /^f([1-9]|1[0-2])$/.test(lower)

const warned = new Set<string>()

function warnUnknownToken(token: string, combo: string) {
  if (import.meta.env.PROD) return
  if (warned.has(token)) return
  warned.add(token)
  console.warn(
    `[frappe-ui] "${token}" in the combo "${combo}" is not a key name ` +
      `KeyboardShortcut knows, so it renders as written. Write the modifiers ` +
      `as Mod+Ctrl+Alt+Shift and name the key (e.g. "Mod+Shift+K", ` +
      `"Mod+Slash", "Mod+Shift+Digit1").`,
  )
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetComboWarnings() {
  warned.clear()
}

export function parseCombo(
  raw: string | undefined,
  isMac: boolean,
): ComboPart[] {
  if (!raw) return []

  return raw
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((original) => {
      const lower = original.toLowerCase()

      if (MODIFIERS.includes(lower)) {
        if (lower === 'shift')
          return { raw: original, type: 'shift', display: 'Shift' }
        if (lower === 'alt')
          return { raw: original, type: 'alt', display: isMac ? '⌥' : 'Alt' }
        if (lower === 'ctrl' || !isMac)
          return { raw: original, type: 'ctrl', display: 'Ctrl' }
        return { raw: original, type: 'cmd', display: '⌘' }
      }

      if (KEY_DISPLAY[lower]) {
        return { raw: original, type: 'key', display: KEY_DISPLAY[lower] }
      }
      if (isLetter(lower) || isFunctionKey(lower)) {
        return { raw: original, type: 'key', display: lower.toUpperCase() }
      }

      warnUnknownToken(original, raw)
      return { raw: original, type: 'key', display: original }
    })
}

/** Spells a parsed combo for an `aria-label`. */
export function spellOut(parts: ComboPart[]): string {
  return parts.map((p) => WORD_BY_DISPLAY[p.display] ?? p.display).join(' + ')
}
