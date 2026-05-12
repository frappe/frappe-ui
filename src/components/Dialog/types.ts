import type { ButtonProps } from '../Button'

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

export type DialogTheme = 'yellow' | 'blue' | 'red' | 'green'

export type DialogPosition = 'center' | 'top'

/** Legacy icon appearance — replaced by `theme`. */
export type DialogIconAppearance = 'warning' | 'info' | 'danger' | 'success'

export type DialogIcon = {
  name: string
  /** Color tone. Replaces deprecated `appearance`. */
  theme?: DialogTheme
  /** @deprecated Use `theme` instead. */
  appearance?: DialogIconAppearance
}

export type DialogActionContext = {
  close: () => void
}

export type DialogAction = ButtonProps & {
  onClick?: (context: DialogActionContext) => void | Promise<void>
}

/** A `DialogAction` augmented with a reactive `loading` flag, as surfaced to the `#actions` slot. */
export type DialogReactiveAction = DialogAction & { loading: boolean }

/** Legacy blob — accepted for back-compat, warns once. */
export type DialogOptions = {
  title?: string
  message?: string
  size?: DialogSize
  icon?: string | DialogIcon
  actions?: DialogAction[]
  position?: DialogPosition
  paddingTop?: string | number
}

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
  dismissable?: boolean

  /** Show the top-right close button. Default `true`. */
  showCloseButton?: boolean

  /** Drop the chrome: no padded card, no auto-header, no auto-actions. Default `false`. */
  bare?: boolean

  // Deprecated.
  /** @deprecated Use `dismissable` (inverted) instead. */
  disableOutsideClickToClose?: boolean

  /** @deprecated Use flat top-level props instead. */
  options?: DialogOptions
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

/** Scoped payload for the `#actions` slot. */
export interface DialogActionsSlotProps {
  /** Closes the dialog. */
  close: () => void

  /** Reactive list of resolved actions (with `loading` state) for re-laying-out auto-rendered buttons. */
  actions: DialogReactiveAction[]
}

export interface DialogExposed {
  /** Closes the dialog. */
  close: () => void
}

export interface DialogSlots {
  /** Main content rendered inside the padded card. */
  default?: () => any

  /** Title area; accepts arbitrary content (extra buttons next to title, etc.). */
  title?: () => any

  /** Footer override; exposes `{ close, actions }`. */
  actions?: (props: DialogActionsSlotProps) => any

  /** @deprecated Use `#default` + `bare` prop. */
  body?: () => any

  /** @deprecated Use `#default`. */
  'body-main'?: () => any

  /** @deprecated Use `#title` for extras (no direct replacement). */
  'body-header'?: () => any

  /** @deprecated Use `#title`. */
  'body-title'?: () => any

  /** @deprecated Use `#default`. */
  'body-content'?: () => any
}
