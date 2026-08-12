export interface KeyboardShortcutsDialogProps {
  /** Dialog title (default: "Keyboard Shortcuts"). */
  title?: string
  /** CSS value for top padding when position is top (default: "5vh"). */
  paddingTop?: string
  /**
   * The search input appears once the number of rows passes this count.
   * Rows, not registrations: shortcuts that merge count once (default: 20).
   */
  searchThreshold?: number
}
