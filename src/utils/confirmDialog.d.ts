import type { Ref, VNode } from 'vue'

export interface ConfirmDialogOptions {
  title?: string
  message?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

/**
 * @deprecated Use `dialog.confirm()` from `frappe-ui` instead.
 */
export function confirmDialog(options: ConfirmDialogOptions): void

export const dialogs: Ref<Array<VNode & { id?: number }>>

export function renderDialog(component: VNode & { id?: number }): void
