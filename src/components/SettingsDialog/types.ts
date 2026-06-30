import type { DialogSize } from '../Dialog/types'

export interface SettingsDialogProps {
  /** Max-width size of the dialog. */
  size?: DialogSize

  /** Enable the Cmd/Ctrl+Shift+, shortcut that toggles the dialog. */
  shortcut?: boolean

  /**
   * Unmount a panel's content when its tab is inactive (reka-ui default: true).
   * Set false to keep visited panels mounted (hidden) — preserves their state
   * and scroll position across tab switches at the cost of memory.
   */
  unmountOnHide?: boolean
}

export interface SettingsDialogEmits {
  /** Fired when the dialog is opened or closed. */
  'update:modelValue': [value: boolean]
}
