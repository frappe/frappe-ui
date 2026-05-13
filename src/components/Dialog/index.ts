import DialogMain from './Dialog.vue'
import { DialogTitle, DialogDescription, DialogClose } from 'reka-ui'

export type {
  DialogProps,
  DialogEmits,
  DialogSlots,
  DialogExposed,
  DialogActionsSlotProps,
  DialogAction,
  DialogReactiveAction,
  DialogActionContext,
  DialogIcon,
  DialogIconAppearance,
  DialogOptions,
  DialogPosition,
  DialogSize,
  DialogTheme,
} from './types'

type DialogExport = typeof DialogMain & {
  Title: typeof DialogTitle
  Description: typeof DialogDescription
  Close: typeof DialogClose
}

const Dialog = DialogMain as DialogExport
Dialog.Title = DialogTitle
Dialog.Description = DialogDescription
Dialog.Close = DialogClose

export { Dialog }
