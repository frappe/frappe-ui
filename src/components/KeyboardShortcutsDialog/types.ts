export interface KeyboardShortcutsDialogProps {
  /** Dialog title (default: "Keyboard Shortcuts"). */
  title?: string
  /**
   * Top padding while the dialog sits at the top of the screen. Takes the
   * same values as `Dialog`'s own prop (default: "5vh").
   */
  paddingTop?: string | number
  /**
   * The search input appears once the number of rows passes this count.
   * Rows, not registrations: shortcuts that merge count once (default: 20).
   */
  searchThreshold?: number
}
