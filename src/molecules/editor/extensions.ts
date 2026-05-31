import { Extension, type Editor } from '@tiptap/core'
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

// Typed accessor for the Placeholder extension's storage, if it's loaded.
function placeholderStorage(
  editor: Editor | null | undefined,
): PlaceholderStorage | undefined {
  return (editor?.storage as Record<string, unknown> | undefined)
    ?.placeholder as PlaceholderStorage | undefined
}

/**
 * Placeholder with frappe-ui's storage-threading: when not given an explicit
 * `placeholder`, it reads its text from its own storage, which `setPlaceholder`
 * (below) writes from `<TextEditor>`'s reactive `placeholder` prop (see spec §2).
 * An explicit `Placeholder.configure({ placeholder })` replaces the reader and wins.
 */
export const Placeholder = PlaceholderExtension.extend({
  addStorage() {
    return { ...(this.parent?.() ?? {}), text: null as string | null }
  },
}).configure({
  placeholder: ({ editor }) => placeholderStorage(editor)?.text ?? '',
})

/**
 * Set the placeholder text on a live editor and refresh its decoration. The whole
 * mechanism lives here, next to the extension, so `<TextEditor>` never reaches into
 * editor storage or ProseMirror transactions. No-op when the Placeholder extension
 * isn't loaded (or a consumer supplied an explicit `placeholder`, which replaces the
 * storage reader). `<TextEditor>` calls this from its `placeholder` prop watcher.
 */
export function setPlaceholder(
  editor: Editor | null | undefined,
  text: string | null,
): void {
  const storage = placeholderStorage(editor)
  if (!editor || !storage || storage.text === text) return
  storage.text = text
  // Placeholder decorations recompute only on a state change; dispatch an empty
  // (no-step) transaction to force a refresh. No steps → no doc change → the
  // editor's `update` / `change` events don't fire.
  editor.view?.dispatch(editor.state.tr)
}

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

// Upload-aware extensions share one engine-level upload function. `useEditor`
// writes it to `editor.storage.upload.uploadFunction`; each extension reads it at
// use-time via `resolveUploadOptions(editor, this.options)` (image-extension.ts),
// with a per-extension `.configure({ uploadFunction })` winning. There is no
// onCreate option-copy: tiptap v3 froze `extension.options` into an immutable
// getter, so the only reliable read is at use-time from the shared storage.
export const Image = ImageExtension
export const ImageGroup = ImageGroupExtension
export const ImageViewer = ImageViewerExtension
export const Video = VideoExtension
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
export const ContentPaste = ContentPasteExtension
export const StyleClipboard = StyleClipboardExtension
