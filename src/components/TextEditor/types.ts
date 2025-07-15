import { type UploadedFile } from '../../utils/useFileUpload'

export interface TextEditorProps {
  content?: string | null
  placeholder?: string | (() => string)
  editorClass?: string | string[] | object
  editable?: boolean
  bubbleMenu?: boolean | any[]
  bubbleMenuOptions?: object
  fixedMenu?: boolean | any[]
  floatingMenu?: boolean | any[]
  extensions?: any[]
  starterkitOptions?: any
  mentions?: any[]
  tags?: any[]
  uploadFunction?: (file: File) => Promise<UploadedFile>
}

export interface TextEditorEmits {
  change: [content: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}
