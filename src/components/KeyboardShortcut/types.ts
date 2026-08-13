export interface KeyboardShortcutProps {
  /** Background chip style. */
  bg?: boolean
  /** Shortcut combo string, e.g. `"Mod+Shift+K"`. `Mod` resolves to Cmd on macOS, Ctrl elsewhere. */
  combo?: string
  /** Whether to visually show `+` separators between keys (non-`bg` mode only). */
  showPlus?: boolean
  /** Alternative equivalent combos, rendered after a `/` separator (display only). */
  altCombos?: string[]
  /** Render icons for the arrow, Enter, Backspace and Delete keys. */
  useIcons?: boolean
}
