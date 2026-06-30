import type { InputLabelingProps } from '../../src/composables/useInputLabeling'
import type {
  PopoverSide,
  PopoverAlign,
} from '../../src/components/Popover/types'
import type { SelectionSize } from '../../src/components/shared/selection/utils'

/** Sizes for the control and option rows (shared with the selection inputs). */
export type MultiEmailInputSize = SelectionSize

/** A suggestion shown in the dropdown. `value` is the email address. */
export interface MultiEmailOption {
  /** Display name; falls back to `value`. */
  label: string
  /** The email address — used as the chip value and the model entry. */
  value: string
  /**
   * Avatar image URL. An `Avatar` always renders for a suggestion row and a
   * chip — with this image when present, otherwise initials from `label`.
   * Named `avatar` rather than the house `icon` field on purpose: this control
   * is person-centric, so the leading visual is always a face / initials, never
   * a generic icon or `Component`.
   */
  avatar?: string
  /** Disables selecting this row. */
  disabled?: boolean
  [key: string]: any
}

export interface MultiEmailTagSlotProps {
  /** The chip's email value. */
  value: string
  /** The matched suggestion for this email, if one has been seen. */
  option: MultiEmailOption | null
  /** Index of the chip in the model. */
  index: number
  /** Removes this chip from the model. */
  removeTag: () => void
}

export interface MultiEmailItemSlotProps {
  /** The suggestion currently being rendered. */
  item: MultiEmailOption
  /** Current input query. */
  query: string
}

export interface MultiEmailInputProps extends InputLabelingProps {
  /**
   * Suggestions rendered in the dropdown. The host fetches these in response to
   * `update:query` (already-selected entries are filtered out automatically).
   */
  options?: MultiEmailOption[]

  /** Replaces the results with a loading state. */
  loading?: boolean

  /** Size of the control and option rows. */
  size?: MultiEmailInputSize

  /** Placeholder shown when there are no chips. */
  placeholder?: string

  /** Empty-state copy shown when there are no suggestions. */
  emptyText?: string

  /** Shown beside the spinner while `loading`. */
  loadingText?: string

  /** Disables the control. */
  disabled?: boolean

  /** Validator for typed addresses. Defaults to a practical email check. */
  validate?: (value: string) => boolean

  /** Builds the "create" row label for a typed address. */
  createLabel?: (value: string) => string

  /** Preferred popover side. */
  side?: PopoverSide

  /** Preferred popover alignment. */
  align?: PopoverAlign

  /** Gap between control and content. */
  offset?: number

  /** Teleport target for the popover content. */
  portalTo?: string | HTMLElement
}

export interface MultiEmailInputEmits {
  /** Fired when the model changes. Diff against the previous value if you need
   * per-address add/remove notifications. */
  'update:modelValue': [value: string[]]

  /** Fired when the input query changes (debounce in the host). */
  'update:query': [value: string]

  /** A typed address failed validation. */
  invalid: [value: string]

  /** The input received focus. */
  focus: [event: FocusEvent]

  /** The input lost focus. */
  blur: [event: FocusEvent]
}

export interface MultiEmailInputSlots {
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any

  /** Replaces a chip's inner content (avatar + text + remove button). */
  tag?: (props: MultiEmailTagSlotProps) => any

  /** Replaces the prefix (avatar) region of a suggestion row. */
  'item-prefix'?: (props: MultiEmailItemSlotProps) => any

  /** Replaces the label region of a suggestion row. */
  'item-label'?: (props: MultiEmailItemSlotProps) => any

  /** Replaces the suffix region of a suggestion row. */
  'item-suffix'?: (props: MultiEmailItemSlotProps) => any

  /** Fallback content rendered when there are no suggestions. */
  empty?: (props: { query: string }) => any
}

export interface MultiEmailInputExposed {
  /** Focuses the text input. */
  focus: () => void
  /** Clears all chips. */
  reset: () => void
}
