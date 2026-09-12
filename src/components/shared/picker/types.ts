import type { InputSize, InputVariant } from '../../../composables/inputTypes'
import type { FrappeUIError } from '../../../composables/useInputLabeling'

export interface PickerShellProps {
  /** Side of the trigger to render the panel on. Already resolved by the caller. */
  side: 'top' | 'right' | 'bottom' | 'left'

  /** Alignment of the panel along the chosen side. */
  align: 'start' | 'center' | 'end'

  /** Distance in px between the input row and the panel. */
  offset: number

  /** Whether focusing the input opens the panel. */
  openOnFocus?: boolean

  /** Whether clicking the input opens the panel. */
  openOnClick?: boolean

  /** Id of the underlying input. */
  id?: string

  /** Label above the input. */
  label?: string

  /** Help text below the input. */
  description?: string

  /** Error message, as a string or `FrappeUIError`. */
  error?: string | FrappeUIError

  /** Whether the input is required. */
  required?: boolean

  /** Input size token. */
  size?: InputSize

  /** Input variant token. */
  variant?: InputVariant

  /** Placeholder for the input. */
  placeholder?: string

  /** Whether the input is disabled. */
  disabled?: boolean

  /** Whether the input is read-only. */
  readonly?: boolean

  /** Formatted value, passed to the trigger slots so a custom trigger can render it. */
  displayLabel?: string
}

/** Slot props passed to the `#trigger`, `#prefix` and `#suffix` slots. */
export interface PickerShellTriggerSlotProps {
  /** Flips the open state, or sets it when passed a boolean. */
  toggle: (flag?: boolean | Event) => void
  /** Whether the panel is currently open. */
  open: boolean
  /** The formatted value. */
  displayLabel: string
  /** The raw text in the input. */
  inputValue: string
}

export interface PickerShellSlots {
  /** Replaces the whole `TextInput` trigger. */
  trigger?: (props: PickerShellTriggerSlotProps) => any
  /** Content before the input text. */
  prefix?: (props: PickerShellTriggerSlotProps) => any
  /** Content after the input text. Replaces the chevron. */
  suffix?: (props: PickerShellTriggerSlotProps) => any
  /** The panel body. */
  default?: (props: { close: () => void }) => any
}

/** Methods available on a `<PickerShell>` template ref. */
export interface PickerShellExposed {
  /** Opens the panel. */
  open: () => void
}
