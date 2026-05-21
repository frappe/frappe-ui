import { Extension } from '@tiptap/core'
import StarterKitExtension from '@tiptap/starter-kit'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import HeadingExtension from '@tiptap/extension-heading'
import LinkExtension from '@tiptap/extension-link'
import CodeExtension from '@tiptap/extension-code'
import CodeBlockExtension from '@tiptap/extension-code-block'
import { Table as TiptapTable, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import TaskListExtension from '@tiptap/extension-task-list'
import TaskItemExtension from '@tiptap/extension-task-item'
import TypographyExtension from '@tiptap/extension-typography'
import TextAlignExtension from '@tiptap/extension-text-align'
import ColorExtension from '@tiptap/extension-color'
import HighlightExtension from '@tiptap/extension-highlight'
import { ImageExtension } from './extensions/image'
import { ImageGroup as ImageGroupExtension } from './extensions/image-group/image-group-extension'
import ImageViewerExtension from './extensions/image-viewer-extension'
import { VideoExtension } from './extensions/video-extension'
import { IframeExtension } from './extensions/iframe'
import { MentionExtension } from './extensions/mention'
import { TagExtension } from './extensions/tag'
import EmojiExtension from './extensions/emoji/emoji-extension'
import { SlashCommands } from './extensions/slash-commands/slash-commands-extension'
import { TocNodeExtension } from './extensions/toc-node'
import { ContentPasteExtension } from './extensions/content-paste-extension'
import StyleClipboardExtension from './extensions/copy-styles'
export { SuggestionExtension, type SuggestionExtensionOptions, type SuggestionRange } from './SuggestionExtension'

export const StarterKit = StarterKitExtension
export const Placeholder = PlaceholderExtension
export const Heading = HeadingExtension
export const Link = LinkExtension.configure({ openOnClick: false })
export const Code = CodeExtension
export const CodeBlock = CodeBlockExtension
export const Table = TiptapTable.configure({ resizable: true })
export { TableRow, TableCell, TableHeader }
export const TaskList = TaskListExtension
export const TaskItem = TaskItemExtension.configure({ nested: true })
export const Typography = TypographyExtension
export const TextAlign = TextAlignExtension.configure({ types: ['heading', 'paragraph'] })
export const Color = ColorExtension
export const Highlight = HighlightExtension

const warnedMissingUpload = new Set<string>()

function warnMissingUploadOnce(name: string) {
  if (warnedMissingUpload.has(name)) return
  warnedMissingUpload.add(name)
  console.warn(
    `[frappe-ui/editor] ${name} needs an uploadFunction. Pass useEditor({ uploadFunction }) or ${name}.configure({ uploadFunction }). Upload will be skipped.`,
  )
}

function uploadAware(name: string, base = Extension.create({ name })) {
  const config = {
    addOptions() {
      return { ...(this.parent?.() ?? {}), uploadFunction: null }
    },
    onCreate() {
      this.parent?.()
      const uploadStorage = this.editor?.storage?.upload
      const storageUploadFunction = uploadStorage?.uploadFunction
      if (!this.options.uploadFunction && storageUploadFunction) {
        this.options.uploadFunction = storageUploadFunction
      }
      if (!this.options.uploadFunction && !uploadStorage) warnMissingUploadOnce(name)
    },
    addStorage() {
      return { uploadFunction: this.options.uploadFunction }
    },
  }

  if (typeof (base as any).extend === 'function') {
    return (base as any).extend(config)
  }

  return { ...(base as any), name, ...config }
}

export const Image = uploadAware('Image', ImageExtension)
export const ImageGroup = uploadAware('ImageGroup', ImageGroupExtension)
export const ImageViewer = ImageViewerExtension
export const Video = uploadAware('Video', VideoExtension)
export const Iframe = IframeExtension
export const Mention = MentionExtension
export const Tag = TagExtension
export const Emoji = EmojiExtension
export { SlashCommands }
export const Toc = TocNodeExtension
export const ContentPaste = uploadAware('ContentPaste', ContentPasteExtension)
export const StyleClipboard = StyleClipboardExtension

