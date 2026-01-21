import type { ButtonProps } from '../Button'

export type DialogIcon = {
  name: string
  appearance?: 'warning' | 'info' | 'danger' | 'success'
}

type DialogOptions = {
  title?: string
  message?: string
  // default size = 'lg'
  size?:
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
  icon?: DialogIcon | string
  actions?: Array<DialogAction>
  // default position = 'center'
  position?: 'top' | 'center'
  paddingTop?: string | number
}

export type DialogActionContext = {
  close: () => void
}
export type DialogAction = ButtonProps & {
  onClick?: (context: DialogActionContext) => void | Promise<void>
}

export interface DialogProps {
  /** Controls whether the dialog is open (v-model) */
  modelValue: boolean

  /** Configuration options for title, message, size, icon, actions, etc. */
  options?: DialogOptions

  /** Prevents closing the dialog when clicking outside */
  disableOutsideClickToClose?: boolean
}
