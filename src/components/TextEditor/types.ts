import type { Component } from 'vue'
import type { Editor } from '@tiptap/vue-3'

export interface Button {
  label?: string
  icon?: Component
  class?: string
  component?: Component
  isActive?: (editor: Editor | null) => boolean
  action: (editor: Editor | null) => void
}

interface Separator {
  type: 'separator'
}

type ActionButton = Button | Separator
export type ActionItem = ActionButton | ActionButton[]
export type MenuProps = { buttons: ActionItem[] }

