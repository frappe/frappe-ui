import { DialogTitle, DialogDescription } from 'reka-ui'

import DialogMain from './Dialog.vue'
export type { DialogProps } from './types'

type DialogExport = typeof DialogMain & {
  Title: typeof DialogTitle
  Description: typeof DialogDescription
}

const Dialog = DialogMain as DialogExport
Dialog.Title = DialogTitle
Dialog.Description = DialogDescription

export { Dialog }
