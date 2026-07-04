export interface BottomSheetProps {
  /** Controls whether the sheet is open (v-model:open). Canonical. */
  open?: boolean

  /** Controls whether the sheet is open (v-model). Also supported. */
  modelValue?: boolean

  /** Optional centered title rendered in the drag-handle area. */
  title?: string

  /** Allow outside-click, Escape, and swipe-down to close. Default `true`. */
  dismissible?: boolean
}

export interface BottomSheetEmits {
  /** Fired when the open state changes via `v-model:open`. */
  'update:open': [value: boolean]

  /** Fired when the open state changes via `v-model`. */
  'update:modelValue': [value: boolean]

  /** Fired after the close animation finishes. */
  'after-leave': []
}

export interface BottomSheetSlots {
  /** Sheet body, rendered in a scrollable region below the handle. */
  default?: () => any
}
