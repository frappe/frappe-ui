import ConfirmDialog from '../components/ConfirmDialog.vue'
import { h, ref } from 'vue'

export function confirmDialog({ title = 'Untitled', message = '', onConfirm }) {
  renderDialog(
    h(ConfirmDialog, {
      title,
      message,
      onConfirm,
    }),
  )
}

export const dialogs = ref([])

export function renderDialog(component) {
  component.id = dialogs.length
  dialogs.value.push(component)
}
