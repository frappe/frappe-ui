export interface KeyboardShortcutsModalProps {
  /** Dialog title (default: "Keyboard Shortcuts"). */
  title?: string
  /** CSS value for top padding when position is top (default: "5vh"). */
  paddingTop?: string
  /**
   * Minimum number of shortcuts that must be registered before the search
   * input is shown (default: 20).
   */
  searchThreshold?: number
}
