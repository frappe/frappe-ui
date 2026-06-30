import type { DialogSize } from '../Dialog/types'

export interface SettingsDialogProps {
  /** Max-width size of the dialog. */
  size?: DialogSize

  /** Enable the Cmd/Ctrl+Shift+, shortcut that toggles the dialog. */
  shortcut?: boolean
}

export interface SettingsDialogEmits {
  /** Fired when the dialog is opened or closed. */
  'update:modelValue': [value: boolean]
}
