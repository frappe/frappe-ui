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
  'update:open': [value: boolean]
}

/**
 * Shared with `ScrollArea` (imperative-api.md §2.5) once that component's own
 * sweep types its `defineExpose`. Kept local to this family until then.
 */
export interface SettingsBodyExposed {
  /** The element that actually scrolls. `null` before mount. */
  viewportElement: HTMLElement | null
}
