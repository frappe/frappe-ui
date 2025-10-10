import { type Component } from 'vue'
import { type UploadedFile } from '../../utils/useFileUpload'
import { type MentionSuggestionItem } from './extensions/mention/mention-extension'

type ConfigureMentionOptions =
  | {
      mentions: MentionSuggestionItem[]
      component?: Component
    }
  | MentionSuggestionItem[]
  | null

export interface TextEditorProps {
  content?: string | null
  placeholder?: string | (() => string)
  editorClass?: string | string[] | object
  editable?: boolean
  autofocus?: boolean
  bubbleMenu?: boolean | any[]
  bubbleMenuOptions?: object
  fixedMenu?: boolean | any[]
  floatingMenu?: boolean | any[]
  extensions?: any[]
  starterkitOptions?: any
  mentions?: ConfigureMentionOptions
  tags?: any[]
  uploadFunction?: (file: File) => Promise<UploadedFile>
  uploadArgs?: object
}

export interface TextEditorEmits {
  change: [content: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  transaction: [editor: object]
}
