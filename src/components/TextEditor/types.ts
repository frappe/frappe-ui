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
  /** Initial editor content (HTML/string). `null` renders an empty editor */
  content?: string | null

  /** Placeholder text or dynamic placeholder resolver */
  placeholder?: string | (() => string)

  /** Custom classes applied to the editor root */
  editorClass?: string | string[] | object

  /** Toggles editability of the editor */
  editable?: boolean

  /** Autofocus the editor on mount */
  autofocus?: boolean

  /** Enables bubble menu or provides custom bubble menu items */
  bubbleMenu?: boolean | any[]

  /** Configuration options for the bubble menu */
  bubbleMenuOptions?: object

  /** Enables fixed menu or provides custom fixed menu items */
  fixedMenu?: boolean | any[]

  /** Enables floating menu or provides custom floating menu items */
  floatingMenu?: boolean | any[]

  /** Custom TipTap extensions */
  extensions?: any[]

  /** Options passed to TipTap StarterKit */
  starterkitOptions?: any

  /** Mention extension configuration */
  mentions?: ConfigureMentionOptions

  /** Tag / hashtag configuration */
  tags?: any[] | null

  /** Async file upload handler (used for images, files, etc.) */
  uploadFunction?: (file: File) => Promise<UploadedFile>

  /** Extra arguments passed to the upload function */
  uploadArgs?: object
}

export interface TextEditorEmits {
  /** Fired whenever editor content changes */
  change: [content: string]

  /** Fired when the editor gains focus */
  focus: [event: FocusEvent]

  /** Fired when the editor loses focus */
  blur: [event: FocusEvent]

  /** Fired on every editor transaction */
  transaction: [editor: object]
}
