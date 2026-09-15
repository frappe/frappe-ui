import { Extension, Node, type Extensions } from '@tiptap/core'
import type { Component, MaybeRefOrGetter } from 'vue'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Strike } from '@tiptap/extension-strike'
import { Text } from '@tiptap/extension-text'
import { Underline } from '@tiptap/extension-underline'
import { Gapcursor, UndoRedo } from '@tiptap/extensions'
import type { HeadingOptions } from '@tiptap/extension-heading'
import type { LinkOptions } from '@tiptap/extension-link'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import type { TableOptions } from '@tiptap/extension-table'
import type { TaskListOptions } from '@tiptap/extension-task-list'
import type { TypographyOptions } from '@tiptap/extension-typography'
import type { TextAlignOptions } from '@tiptap/extension-text-align'
import type { ImageExtensionOptions } from './extensions/image'
import type { ImageGroupOptions } from './extensions/image-group'
import type { VideoExtensionOptions } from './extensions/video'
import type { AttachmentExtensionOptions } from './extensions/attachment'
import type { ContentPasteOptions } from './extensions/content-paste'
import type { IframeOptions } from './extensions/iframe'
import type { ColorOptions } from './extensions/color'
import type { HighlightOptions } from './extensions/highlight'
import type { StyleClipboardOptions } from './extensions/copy-styles'
import type { SlashCommandsOptions } from './extensions/slash-commands/slash-commands-extension'
import {
  Placeholder,
  Link,
  StarterKit,
  Code,
  CodeBlock,
  Image,
  ImageGroup,
  ImageViewer,
  Video,
  Attachment,
  MediaDrop,
  ContentPaste,
  Emoji,
  Mention,
  Tag,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableNavigation,
  TableCellColor,
  TableSelectionOverlay,
  TaskList,
  TaskItem,
  Iframe,
  Toc,
  SlashCommands,
  TextStyle,
  Color,
  Highlight,
  Typography,
  TextAlign,
  StyleClipboard,
  EditorDropcursor,
  type StarterKitOptions,
  type MentionSuggestionItem,
  type TagSuggestionItem,
} from './extensions'

// A kit member: a partial config to apply, or `false` to remove the member.
type Member<O> = Partial<O> | false
/**
 * A member whose extension takes no options: `{}` keeps it, `false` removes
 * it. Any other key is a compile error, so a misspelled option cannot pass
 * silently.
 */
type FlagMember = Record<string, never> | false
/**
 * The StarterKit configuration a kit accepts. `heading` is omitted: the kit's
 * own top-level `heading` member overwrites it, so setting it here does
 * nothing.
 */
type StarterKitMember = Omit<StarterKitOptions, 'heading'> | false
type MentionMember =
  | {
      items?: MaybeRefOrGetter<MentionSuggestionItem[]> | null
      nodeView?: Component
    }
  | false
type TagMember =
  | { items?: MaybeRefOrGetter<TagSuggestionItem[]> | null }
  | false
/**
 * `{}` keeps the built-in slash menu. `{ items }` replaces it with the given
 * command list. `false` removes the menu.
 */
type SlashCommandsMember = SlashCommandsOptions | false

/**
 * Configure the frappe StarterKit as a kit's base bundle. The kit never
 * registers a `link`, `code`, or `codeBlock` member, so the frappe `Link`
 * mark and the frappe `Code` (backtick toggle) + `CodeBlock` (lowlight,
 * indent keymaps, language picker) extensions own those names with no
 * duplicate-name collision. `HeadingIds` rides alongside `heading` to assign
 * stable ids for the table-of-contents. `heading` is threaded explicitly so a
 * kit can expose it as a top-level member; setting it inside `starterKit` is
 * a compile error, because this line would overwrite it.
 */
function starterKitBase(
  starter: StarterKitMember,
  heading: Partial<HeadingOptions> | false,
): Extensions {
  if (starter === false) return []
  return [
    StarterKit.configure({
      ...starter,
      heading: heading as StarterKitOptions['heading'],
    }),
    Code,
    CodeBlock,
  ]
}

/** Push `ext.configure(option)` unless the member was removed with `false`. */
function pushMember(
  list: Extensions,
  ext: { configure: (o: any) => any },
  option: unknown,
) {
  if (option !== false) list.push(ext.configure(option ?? {}))
}

// ----------------------------------------------------------------------------
// CommentKit — comments, chat, replies
// ----------------------------------------------------------------------------

export interface CommentKitOptions {
  starterKit: StarterKitMember
  heading: Member<HeadingOptions>
  placeholder: Member<PlaceholderOptions>
  link: Member<LinkOptions>
  image: Member<ImageExtensionOptions>
  imageGroup: Member<ImageGroupOptions>
  imageViewer: FlagMember
  video: Member<VideoExtensionOptions>
  attachment: Member<AttachmentExtensionOptions>
  // Tables. Off by default for CommentKit (the lighter stack); RichTextKit turns
  // it on. Opt in with `CommentKit.configure({ table: {} })`.
  table: Member<TableOptions>
  contentPaste: Member<ContentPasteOptions>
  emoji: FlagMember
  mention: MentionMember
  tag: TagMember
}

const commentKitDefaults = (): CommentKitOptions => ({
  starterKit: {},
  heading: {},
  placeholder: {},
  link: {},
  image: {},
  imageGroup: {},
  imageViewer: {},
  video: {},
  attachment: {},
  table: false,
  contentPaste: {},
  emoji: {},
  mention: {},
  tag: {},
})

/** Shared comment-grade members, reused as the base of RichTextKit. */
function commentMembers(options: CommentKitOptions): Extensions {
  const list: Extensions = [
    ...starterKitBase(options.starterKit, options.heading),
  ]
  pushMember(list, Placeholder, options.placeholder)
  pushMember(list, Link, options.link)
  pushMember(list, Image, options.image)
  // ImageGroup nodes contain Image nodes, so it can't load without Image.
  if (options.image !== false) pushMember(list, ImageGroup, options.imageGroup)
  if (options.image !== false)
    pushMember(list, ImageViewer, options.imageViewer)
  pushMember(list, Video, options.video)
  pushMember(list, Attachment, options.attachment)
  // The single drop pipeline; only useful when there's a media or attachment
  // node to route to.
  if (
    options.image !== false ||
    options.video !== false ||
    options.attachment !== false
  )
    list.push(MediaDrop)
  // Table needs its row/cell/header companions; TableNavigation adds the
  // spreadsheet-style cell navigation. Shared so both kits get it (off by
  // default for CommentKit, on for RichTextKit).
  if (options.table !== false) {
    list.push(
      Table.configure(options.table),
      TableRow,
      TableCell,
      TableHeader,
      TableNavigation,
      TableCellColor,
      TableSelectionOverlay,
    )
  }
  pushMember(list, ContentPaste, options.contentPaste)
  pushMember(list, Emoji, options.emoji)
  pushMember(list, Mention, options.mention)
  pushMember(list, Tag, options.tag)
  return list
}

export const CommentKit = Extension.create<CommentKitOptions>({
  name: 'commentKit',
  addOptions() {
    return commentKitDefaults()
  },
  addExtensions() {
    return commentMembers(this.options)
  },
})

// ----------------------------------------------------------------------------
// RichTextKit — articles, docs, wiki (CommentKit + block/format extras)
// ----------------------------------------------------------------------------

export interface RichTextKitOptions extends CommentKitOptions {
  table: Member<TableOptions>
  taskList: Member<TaskListOptions>
  iframe: Member<IframeOptions>
  /**
   * The table-of-contents node. Off by default: add `toc: {}` when the editor
   * offers a table of contents.
   */
  toc: FlagMember
  slashCommands: SlashCommandsMember
  color: Member<ColorOptions>
  highlight: Member<HighlightOptions>
  typography: Member<TypographyOptions>
  textAlign: Member<TextAlignOptions>
  /**
   * Copy and paste formatting ("format painter"). Off by default: add
   * `styleClipboard: {}` when the editor offers a style-copy control.
   */
  styleClipboard: Member<StyleClipboardOptions>
}

export const RichTextKit = Extension.create<RichTextKitOptions>({
  name: 'richTextKit',
  addOptions() {
    return {
      ...commentKitDefaults(),
      table: {},
      taskList: {},
      iframe: {},
      // Opt-in: they add UI (a table-of-contents node, a format painter) that
      // most rich-text editors never expose.
      toc: false,
      slashCommands: {},
      color: {},
      highlight: {},
      typography: {},
      textAlign: {},
      styleClipboard: false,
    }
  },
  addExtensions() {
    const options = this.options
    // Table is handled by commentMembers (shared, on for RichTextKit via the
    // `table: {}` default below).
    const list: Extensions = commentMembers(options)

    // Task list needs its item companion.
    if (options.taskList !== false) {
      list.push(TaskList.configure(options.taskList), TaskItem)
    }
    pushMember(list, Iframe, options.iframe)
    pushMember(list, Toc, options.toc)
    // SlashCommands ships a built-in command registry; `{ items }` replaces
    // it and `false` removes the menu.
    pushMember(list, SlashCommands, options.slashCommands)
    // Color works on top of the TextStyle mark — register both together.
    if (options.color !== false) {
      list.push(TextStyle, Color.configure(options.color))
    }
    pushMember(list, Highlight, options.highlight)
    pushMember(list, Typography, options.typography)
    pushMember(list, TextAlign, options.textAlign)
    pushMember(list, StyleClipboard, options.styleClipboard)
    return list
  },
})

// ----------------------------------------------------------------------------
// InlineKit — single-line rich text (titles, names)
// ----------------------------------------------------------------------------

/**
 * The eight StarterKit members InlineKit reads. Each accepts only `false`:
 * InlineKit registers the extension with its stock configuration or not at
 * all, so an options object would be silently ignored.
 */
export interface InlineStarterKitOptions {
  bold?: false
  italic?: false
  strike?: false
  underline?: false
  code?: false
  dropcursor?: false
  gapcursor?: false
  undoRedo?: false
}

export interface InlineKitOptions {
  starterKit: InlineStarterKitOptions | false
  placeholder: Member<PlaceholderOptions>
  link: Member<LinkOptions>
}

/**
 * A document that holds exactly one block, which makes the editor single-line:
 * Enter can't split into a second block (the schema rejects it), so it's a no-op.
 */
const OneLineDocument = Node.create({
  name: 'doc',
  topNode: true,
  content: 'block',
})

export const InlineKit = Extension.create<InlineKitOptions>({
  name: 'inlineKit',
  addOptions() {
    return {
      starterKit: {},
      placeholder: {},
      link: {},
    }
  },
  addExtensions() {
    const options = this.options
    const list: Extensions = []
    if (options.starterKit !== false) {
      list.push(
        OneLineDocument,
        Text,
        Paragraph,
      )
      if (options.starterKit.bold !== false) list.push(Bold)
      if (options.starterKit.italic !== false) list.push(Italic)
      if (options.starterKit.strike !== false) list.push(Strike)
      if (options.starterKit.underline !== false) list.push(Underline)
      if (options.starterKit.code !== false) list.push(Code)
      if (options.starterKit.dropcursor !== false) list.push(EditorDropcursor)
      if (options.starterKit.gapcursor !== false) list.push(Gapcursor)
      if (options.starterKit.undoRedo !== false) list.push(UndoRedo)
    }
    pushMember(list, Placeholder, options.placeholder)
    pushMember(list, Link, options.link)
    return list
  },
})
