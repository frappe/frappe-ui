export interface KeyboardShortcutProps {
  /** Background chip style. */
  bg?: boolean
  /** Shortcut combo string, e.g. `"Mod+Shift+K"`. `Mod` resolves to Cmd on macOS, Ctrl elsewhere. */
  combo?: string
  /** Draw `+` between keys. `'auto'` draws it only between two text keys: "Ctrl+K", but "⌘K" and "⇧F2". Plain mode only. */
  showPlus?: boolean | 'auto'
  /** Alternative equivalent combos, rendered after a `/` separator (display only). */
  altCombos?: string[]
  /** Render icons for the arrow, Enter, Backspace and Delete keys. */
  useIcons?: boolean
}
