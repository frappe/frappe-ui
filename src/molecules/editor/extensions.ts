import { Extension, type Editor, type Extensions } from '@tiptap/core'
import {
  Blockquote,
  type BlockquoteOptions,
} from '@tiptap/extension-blockquote'
import { Bold, type BoldOptions } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { HardBreak, type HardBreakOptions } from '@tiptap/extension-hard-break'
import {
  HorizontalRule,
  type HorizontalRuleOptions,
} from '@tiptap/extension-horizontal-rule'
import { Italic, type ItalicOptions } from '@tiptap/extension-italic'
import {
  BulletList,
  type BulletListOptions,
  ListItem,
  type ListItemOptions,
  ListKeymap,
  type ListKeymapOptions,
  OrderedList,
  type OrderedListOptions,
} from '@tiptap/extension-list'
import { Paragraph, type ParagraphOptions } from '@tiptap/extension-paragraph'
import { Strike, type StrikeOptions } from '@tiptap/extension-strike'
import { Text } from '@tiptap/extension-text'
import { Underline, type UnderlineOptions } from '@tiptap/extension-underline'
import {
  Dropcursor,
  type DropcursorOptions,
  Gapcursor,
  TrailingNode,
  type TrailingNodeOptions,
  UndoRedo,
  type UndoRedoOptions,
} from '@tiptap/extensions'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import HeadingExtension, {
  type HeadingOptions,
} from '@tiptap/extension-heading'
import HeadingIdsExtension from './extensions/heading/heading-ids'
import { LinkExtension } from './extensions/link'
// Custom code mark + lowlight code block (input rule, indent keymaps, language
// picker node view, shared backtick toggle) — replaces stock @tiptap code block.
import { ExtendedCode, ExtendedCodeBlock } from './extensions/code-block'
import {
  Table as TiptapTable,
  TableRow,
  TableCell as TiptapTableCell,
  TableHeader as TiptapTableHeader,
} from '@tiptap/extension-table'
import { columnResizing, tableEditing, TableView } from '@tiptap/pm/tables'
import {
  cellBackgroundAttributes,
  TableCellColor as TableCellColorExtension,
} from './extensions/table/table-cell-color'
import { TableSelectionOverlay as TableSelectionOverlayExtension } from './extensions/table/table-selection-overlay'
import TaskListExtension from '@tiptap/extension-task-list'
import TaskItemExtension from '@tiptap/extension-task-item'
import TypographyExtension from '@tiptap/extension-typography'
import TextAlignExtension from '@tiptap/extension-text-align'
import { TextStyle as TextStyleExtension } from '@tiptap/extension-text-style'
// Named color/highlight: store a palette name (not raw hex/rgb) and render as
// `var(--prose-color-*)` / `var(--prose-highlight-*)` so light/dark is CSS-driven.
import { NamedColorExtension } from './extensions/color'
import { NamedHighlightExtension } from './extensions/highlight'
import { ImageExtension } from './extensions/image'
import { ImageGroup as ImageGroupExtension } from './extensions/image-group'
import ImageViewerExtension from './extensions/image-viewer'
import { VideoExtension } from './extensions/video'
import { AttachmentExtension } from './extensions/attachment'
import { MediaDrop as MediaDropExtension } from './extensions/media-drop/media-drop-extension'
import { IframeExtension } from './extensions/iframe'
import {
  MentionExtension,
  type MentionSuggestionItem,
} from './extensions/mention/mention-extension'
import { TagComposite, type TagSuggestionItem } from './extensions/tag'
import EmojiExtension from './extensions/emoji/emoji-extension'
import { SlashCommands } from './extensions/slash-commands/slash-commands-extension'
import { TocNodeExtension } from './extensions/toc-node'
import { ContentPasteExtension } from './extensions/content-paste'
import StyleClipboardExtension from './extensions/copy-styles'
export {
  SuggestionExtension,
  type SuggestionExtensionOptions,
  type SuggestionRange,
} from './SuggestionExtension'
export type { MentionSuggestionItem, TagSuggestionItem }

type StarterKitMember<O> = Partial<O> | false

export interface StarterKitOptions {
  blockquote?: StarterKitMember<BlockquoteOptions>
  bold?: StarterKitMember<BoldOptions>
  bulletList?: StarterKitMember<BulletListOptions>
  code?: false
  codeBlock?: false
  document?: false
  dropcursor?: StarterKitMember<DropcursorOptions>
  gapcursor?: false
  hardBreak?: StarterKitMember<HardBreakOptions>
  heading?: StarterKitMember<HeadingOptions>
  horizontalRule?: StarterKitMember<HorizontalRuleOptions>
  italic?: StarterKitMember<ItalicOptions>
  link?: false
  listItem?: StarterKitMember<ListItemOptions>
  listKeymap?: StarterKitMember<ListKeymapOptions>
  orderedList?: StarterKitMember<OrderedListOptions>
  paragraph?: StarterKitMember<ParagraphOptions>
  strike?: StarterKitMember<StrikeOptions>
  text?: false
  trailingNode?: StarterKitMember<TrailingNodeOptions>
  underline?: StarterKitMember<UnderlineOptions>
  undoRedo?: StarterKitMember<UndoRedoOptions>
}

function pushConfigured<O>(
  list: Extensions,
  extension: { configure: (options?: Partial<O>) => any },
  option: StarterKitMember<O> | undefined,
) {
  if (option !== false) list.push(extension.configure(option ?? {}))
}

/**
 * Dropcursor with the design-system drop indicator: a 3px rounded gray bar
 * (rounded corners via `.editor-drop-cursor` in style.css) instead of the
 * default 1px black line.
 */
export const EditorDropcursor = Dropcursor.configure({
  width: 3,
  color: 'var(--surface-gray-10, #383838)',
  class: 'editor-drop-cursor',
})

export const StarterKit = Extension.create<StarterKitOptions>({
  name: 'frappeStarterKit',
  addOptions() {
    return {}
  },
  addExtensions() {
    const list: Extensions = []
    pushConfigured(list, Bold, this.options.bold)
    pushConfigured(list, Blockquote, this.options.blockquote)
    pushConfigured(list, BulletList, this.options.bulletList)
    if (this.options.document !== false) list.push(Document)
    pushConfigured(list, EditorDropcursor, this.options.dropcursor)
    if (this.options.gapcursor !== false) list.push(Gapcursor)
    pushConfigured(list, HardBreak, this.options.hardBreak)
    pushConfigured(list, HeadingExtension, this.options.heading)
    pushConfigured(list, UndoRedo, this.options.undoRedo)
    pushConfigured(list, HorizontalRule, this.options.horizontalRule)
    pushConfigured(list, Italic, this.options.italic)
    pushConfigured(list, ListItem, this.options.listItem)
    pushConfigured(list, ListKeymap, this.options.listKeymap)
    pushConfigured(list, OrderedList, this.options.orderedList)
    pushConfigured(list, Paragraph, this.options.paragraph)
    pushConfigured(list, Strike, this.options.strike)
    if (this.options.text !== false) list.push(Text)
    pushConfigured(list, Underline, this.options.underline)
    pushConfigured(list, TrailingNode, this.options.trailingNode)
    if (this.options.heading !== false) list.push(HeadingIds)
    return list
  },
})

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
 * (below) writes from `<Editor>`'s reactive `placeholder` prop (see spec §2).
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
 * mechanism lives here, next to the extension, so `<Editor>` never reaches into
 * editor storage or ProseMirror transactions. No-op when the Placeholder extension
 * isn't loaded (or a consumer supplied an explicit `placeholder`, which replaces the
 * storage reader). `<Editor>` calls this from its `placeholder` prop watcher.
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
/**
 * Stable heading ids — assigns a persistent `id`/`data-toc-id` to every heading
 * so the table-of-contents can resolve a heading element regardless of position
 * (and keep the active-heading highlight + anchor links stable across edits).
 * Registered alongside `Heading` in the kits; `collectHeadings` reads its ids.
 */
export const HeadingIds = HeadingIdsExtension
// frappe-ui's link: inline edit popup, Mod-k shortcut, smart paste handling, and
// boundary clearing. Already defaults openOnClick:false / autolink:true.
export const Link = LinkExtension
export const Code = ExtendedCode
export const CodeBlock = ExtendedCodeBlock
// Stock @tiptap gates `columnResizing` behind `resizable && editor.isEditable`,
// evaluated once at editor creation. That has three consequences we don't want:
// the plugin also owns the `.tableWrapper` scroll container (so read-only and
// born-read-only editors get a bare table that overflows its bounds), and
// `setEditable()` never reconfigures plugins (so toggling an existing comment
// into edit mode never installs resizing). `columnResizing` already no-ops its
// own pointer handlers when `!view.editable`, so installing it whenever
// `resizable` is set is safe in read-only and keeps the wrapper in every mode.
export const Table = TiptapTable.configure({ resizable: true }).extend({
  addProseMirrorPlugins() {
    return [
      ...(this.options.resizable
        ? [
            columnResizing({
              handleWidth: this.options.handleWidth,
              cellMinWidth: this.options.cellMinWidth,
              defaultCellMinWidth: this.options.cellMinWidth,
              View: this.options.View ?? TableView,
              lastColumnResizable: this.options.lastColumnResizable,
            }),
          ]
        : []),
      tableEditing({ allowTableNodeSelection: this.options.allowTableNodeSelection }),
    ]
  },
})
// Cell nodes carry a named `backgroundColor` attribute (rendered via
// `--prose-highlight-*`); see `extensions/table/table-cell-color`.
export const TableCell = TiptapTableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellBackgroundAttributes }
  },
})
export const TableHeader = TiptapTableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellBackgroundAttributes }
  },
})
export { TableRow }
// Spreadsheet-style cell navigation (active-cell highlight, Enter to edit, Esc
// to exit, arrow keys to move). Loaded alongside Table in the kits.
export { TableNavigation } from './extensions/table/table-navigation'
// First-class named cell background + text color commands, and the single-box
// multi-cell selection overlay. Both loaded alongside Table.
export const TableCellColor = TableCellColorExtension
export const TableSelectionOverlay = TableSelectionOverlayExtension
export const TaskList = TaskListExtension
export const TaskItem = TaskItemExtension.configure({ nested: true })
export const Typography = TypographyExtension
export const TextAlign = TextAlignExtension.configure({
  types: ['heading', 'paragraph'],
})
export const TextStyle = TextStyleExtension
export const Color = NamedColorExtension
export const Highlight = NamedHighlightExtension

// Upload-aware extensions share one engine-level upload function. `useEditor`
// writes it to `editor.storage.upload.uploadFunction`; each extension reads it at
// use-time via `resolveUploadOptions({ ...this.options, editor })` (shared
// media-upload-engine), with a per-extension `.configure({ uploadFunction })`
// winning. There is no onCreate option-copy: tiptap v3 froze `extension.options`
// into an immutable getter, so the only reliable read is at use-time from the
// shared storage.
export const Image = ImageExtension
export const ImageGroup = ImageGroupExtension
export const ImageViewer = ImageViewerExtension
export const Video = VideoExtension
// Inline file attachments (pdf, docx, zip, csv, …). Same shared upload function
// as image/video; renders a gray chip/link via AttachmentNodeView.
export const Attachment = AttachmentExtension
export const MediaDrop = MediaDropExtension
export const Iframe = IframeExtension
export const Mention = MentionExtension

/**
 * Tag bundles the inline tag node with the `#` suggestion. Inert until
 * configured: with no `items`, only the node loads (so existing tags in content
 * still render). `Tag.configure({ items })` wires the live `#` suggestion.
 * The single canonical implementation lives in `extensions/tag` (`TagComposite`);
 * this is just the public `Tag` alias.
 */
export const Tag = TagComposite

export const Emoji = EmojiExtension
export { SlashCommands }
export const Toc = TocNodeExtension
export const ContentPaste = ContentPasteExtension
export const StyleClipboard = StyleClipboardExtension
export type { MediaUploadRequestOptions } from './extensions/shared/media-upload-engine'
