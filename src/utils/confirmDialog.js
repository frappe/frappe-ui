import ConfirmDialog from '../components/ConfirmDialog.vue'
import { h, ref } from 'vue'
import { warnDeprecated } from './warnDeprecated'

/**
 * @deprecated Use `dialog.confirm()` from `frappe-ui` instead.
 */
export function confirmDialog({ title = 'Untitled', message = '', onConfirm, onCancel }) {
  warnDeprecated('confirmDialog()', 'dialog.confirm()')
  renderDialog(
    h(ConfirmDialog, {
      title,
      message,
      onConfirm,
      onCancel
    }),
  )
}

export const dialogs = ref([])

export function renderDialog(component) {
  component.id = dialogs.length
  dialogs.value.push(component)
}
