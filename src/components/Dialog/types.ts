import type { ButtonProps } from '../Button'
import type { Action } from '../shared/action'

export type DialogSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'

export type DialogTheme = 'amber' | 'blue' | 'red' | 'green'

export type DialogPosition = 'center' | 'top'

export type DialogIcon = {
  name: string
  /** Color tone. */
  theme?: DialogTheme
}

export type DialogActionContext = {
  close: () => void
}

export type DialogAction = Action<DialogActionContext>

/** A `DialogAction` augmented with a reactive `loading` flag, as surfaced to the `#actions` slot. */
export type DialogReactiveAction = DialogAction & { loading: boolean }

export interface DialogProps {
  // Visibility — both supported, `open` is canonical.
  /** Controls whether the dialog is open (v-model:open). Canonical. */
  open?: boolean

  /** Controls whether the dialog is open (v-model). Also supported. */
  modelValue?: boolean

  // Content.
  /** Dialog title. Renders the auto-header. */
  title?: string

  /** Description text rendered below the title. */
  message?: string

  /** Icon shown next to the title in the auto-header. */
  icon?: string | DialogIcon

  // Layout.
  /** Max-width size of the dialog. Default `'lg'`. */
  size?: DialogSize

  /** Vertical placement. Default `'center'`. */
  position?: DialogPosition

  /** Overrides the position-based top padding (escape hatch). */
  paddingTop?: string | number

  // Actions.
  /** Footer action buttons. */
  actions?: DialogAction[]

  // Behavior.
  /** Allow outside-click and Escape to close. Default `true`. */
  dismissible?: boolean

  /** Show the top-right close button. Default `true`. */
  showCloseButton?: boolean

  /** Drop the chrome: no padded card, no auto-header, no auto-actions. Default `false`. */
  bare?: boolean
}

export interface DialogEmits {
  /** Fired when the dialog open state changes via `v-model:open`. */
  'update:open': [value: boolean]

  /** Fired when the dialog open state changes via `v-model`. */
  'update:modelValue': [value: boolean]

  /** Fired when the dialog transitions to closed. */
  close: []

  /** Fired after the close animation finishes. */
  'after-leave': []
}

/** Scoped payload exposed to every Dialog slot. */
export interface DialogSlotProps {
  /** Closes the dialog. */
  close: () => void
}

/** Scoped payload for the `#actions` slot. */
export interface DialogActionsSlotProps extends DialogSlotProps {
  /** Reactive list of resolved actions (with `loading` state) for re-laying-out auto-rendered buttons. */
  actions: DialogReactiveAction[]
}

export interface DialogSlots {
  /** Main content rendered inside the padded card. Exposes `{ close }`. */
  default?: (props: DialogSlotProps) => any

  /** Title area; accepts arbitrary content (extra buttons next to title, etc.). Exposes `{ close }`. */
  title?: (props: DialogSlotProps) => any

  /** Footer override; exposes `{ close, actions }`. */
  actions?: (props: DialogActionsSlotProps) => any
}
