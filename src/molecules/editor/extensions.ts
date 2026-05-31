import { Extension } from '@tiptap/core'
import type { Component } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import StarterKitExtension from '@tiptap/starter-kit'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import HeadingExtension from '@tiptap/extension-heading'
import { LinkExtension } from './extensions/link'
import CodeExtension from '@tiptap/extension-code'
import CodeBlockExtension from '@tiptap/extension-code-block'
import {
  Table as TiptapTable,
  TableRow,
  TableCell,
  TableHeader,
} from '@tiptap/extension-table'
import TaskListExtension from '@tiptap/extension-task-list'
import TaskItemExtension from '@tiptap/extension-task-item'
import TypographyExtension from '@tiptap/extension-typography'
import TextAlignExtension from '@tiptap/extension-text-align'
import { TextStyle as TextStyleExtension } from '@tiptap/extension-text-style'
import ColorExtension from '@tiptap/extension-color'
import HighlightExtension from '@tiptap/extension-highlight'
import { ImageExtension } from './extensions/image'
import { ImageGroup as ImageGroupExtension } from './extensions/image-group/image-group-extension'
import ImageViewerExtension from './extensions/image-viewer-extension'
import { VideoExtension } from './extensions/video-extension'
import { IframeExtension } from './extensions/iframe'
import {
  MentionExtension,
  type MentionSuggestionItem,
} from './extensions/mention/mention-extension'
import { TagExtension, TagNode, type TagSuggestionItem } from './extensions/tag'
import EmojiExtension from './extensions/emoji/emoji-extension'
import { SlashCommands } from './extensions/slash-commands/slash-commands-extension'
import { TocNodeExtension } from './extensions/toc-node'
import { ContentPasteExtension } from './extensions/content-paste-extension'
import StyleClipboardExtension from './extensions/copy-styles'
export {
  SuggestionExtension,
  type SuggestionExtensionOptions,
  type SuggestionRange,
} from './SuggestionExtension'
export type { MentionSuggestionItem, TagSuggestionItem }

export const StarterKit = StarterKitExtension

type PlaceholderStorage = { text: string | null }

/**
 * Placeholder with frappe-ui's storage-threading: when not given an explicit
 * `placeholder`, it reads its text from `editor.storage.placeholder.text`, which
 * `<TextEditor>` writes from its reactive `placeholder` prop (see spec §2). An
 * explicit `Placeholder.configure({ placeholder })` replaces the reader and wins.
 */
export const Placeholder = PlaceholderExtension.extend({
  addStorage() {
    return { ...(this.parent?.() ?? {}), text: null }
  },
}).configure({
  placeholder: ({ editor }) => {
    const storage = (editor.storage as Record<string, any>).placeholder as
      | PlaceholderStorage
      | undefined
    return storage?.text ?? ''
  },
})

export const Heading = HeadingExtension
// frappe-ui's link: inline edit popup, Mod-k shortcut, smart paste handling, and
// boundary clearing. Already defaults openOnClick:false / autolink:true.
export const Link = LinkExtension
export const Code = CodeExtension
export const CodeBlock = CodeBlockExtension
export const Table = TiptapTable.configure({ resizable: true })
export { TableRow, TableCell, TableHeader }
export const TaskList = TaskListExtension
export const TaskItem = TaskItemExtension.configure({ nested: true })
export const Typography = TypographyExtension
export const TextAlign = TextAlignExtension.configure({
  types: ['heading', 'paragraph'],
})
export const TextStyle = TextStyleExtension
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
      if (!this.options.uploadFunction && !uploadStorage)
        warnMissingUploadOnce(name)
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

/**
 * Tag bundles the inline tag node with the `#` suggestion. Inert until
 * configured: with no `items`, only the node loads (so existing tags in content
 * still render). `Tag.configure({ items })` wires the live `#` suggestion.
 */
const TagComposite = Extension.create<{
  items: MaybeRefOrGetter<TagSuggestionItem[]> | null
}>({
  name: 'tag',
  addOptions() {
    return { items: null }
  },
  addExtensions() {
    const extensions: any[] = [TagNode]
    if (this.options.items != null) {
      extensions.push(TagExtension.configure({ tags: this.options.items }))
    }
    return extensions
  },
})
export const Tag = TagComposite

export const Emoji = EmojiExtension
export { SlashCommands }
export const Toc = TocNodeExtension
export const ContentPaste = uploadAware('ContentPaste', ContentPasteExtension)
export const StyleClipboard = StyleClipboardExtension
