import type { Component } from 'vue'

export interface ToastAction {
  /** Label shown for the toast action */
  label: string

  /** Accessible text announced for the action control */
  altText?: string

  /** Callback invoked when the action is triggered */
  onClick: () => void
}

export interface ToastProps {
  /** Controls whether the toast is visible (required) */
  open: boolean

  /** Message content rendered inside the toast */
  message?: string

  /** Visual tone of the toast */
  type?: 'info' | 'success' | 'warning' | 'error'

  /** Auto-dismiss duration in milliseconds */
  duration?: number

  /** Optional custom icon rendered before the message */
  icon?: Component

  /** Whether the close button is shown */
  closable?: boolean

  /** Optional action rendered on the right side of the toast */
  action?: ToastAction
}
