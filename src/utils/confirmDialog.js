import ConfirmDialog from '../components/ConfirmDialog.vue'
import { h, ref } from 'vue'

export function confirmDialog({ title = 'Untitled', message = '', onConfirm, onCancel }) {
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
