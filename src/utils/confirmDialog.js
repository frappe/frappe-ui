import ConfirmDialog from '../components/ConfirmDialog.vue'
import { h, ref } from 'vue'

export function confirmDialog({
  title = 'Untitled',
  message = '',
  fields = [],
  onConfirm,
}) {
  renderDialog(
    h(ConfirmDialog, {
      title,
      message,
      fields,
      onConfirm,
    }),
  )
}

export const dialogs = ref([])

export function renderDialog(component) {
  component.id = dialogs.length
  dialogs.value.push(component)
}
