import { Extension, Node, type Extensions } from '@tiptap/core'
import type { Component, MaybeRefOrGetter } from 'vue'
import StarterKit, { type StarterKitOptions } from '@tiptap/starter-kit'
import type { HeadingOptions } from '@tiptap/extension-heading'
import type { LinkOptions } from '@tiptap/extension-link'
import {
  Placeholder,
  Link,
  Code,
  CodeBlock,
  HeadingIds,
  Image,
  ImageGroup,
  ImageViewer,
  Video,
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
  type MentionSuggestionItem,
  type TagSuggestionItem,
} from './extensions'

// A kit member: a partial config to apply, or `false` to remove the member.
type Member<O> = Partial<O> | false
type CustomMember = Record<string, any> | false
type MentionMember =
  | {
      items?: MaybeRefOrGetter<MentionSuggestionItem[]> | null
      component?: Component
    }
  | false
type TagMember =
  | { items?: MaybeRefOrGetter<TagSuggestionItem[]> | null }
  | false

/**
 * Configure tiptap's StarterKit as a kit's base bundle. We always disable its
 * built-in `link` mark so the frappe `Link` member (with our defaults) owns it,
 * avoiding a duplicate-name collision. The same applies to `code`/`codeBlock`:
 * StarterKit's stock versions are disabled and replaced by the frappe `Code`
 * (backtick toggle) + `CodeBlock` (lowlight, indent keymaps, language picker)
 * extensions. `HeadingIds` rides alongside `heading` to assign stable ids for
 * the table-of-contents. `heading` is threaded explicitly so a kit can expose
 * it as a top-level member.
 */
function starterKitBase(
  starter: Partial<StarterKitOptions> | false,
  heading: Partial<HeadingOptions> | false,
): Extensions {
  if (starter === false) return []
  return [
    StarterKit.configure({
      link: false,
      code: false,
      codeBlock: false,
      ...starter,
      heading: heading as StarterKitOptions['heading'],
    }),
    Code,
    CodeBlock,
    // Stable heading ids only matter when headings exist.
    ...(heading === false ? [] : [HeadingIds]),
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
  starterKit: Partial<StarterKitOptions> | false
  heading: Member<HeadingOptions>
  placeholder: CustomMember
  link: Member<LinkOptions>
  image: CustomMember
  imageGroup: CustomMember
  imageViewer: CustomMember
  video: CustomMember
  // Tables. Off by default for CommentKit (the lighter stack); RichTextKit turns
  // it on. Opt in with `CommentKit.configure({ table: {} })`.
  table: CustomMember
  contentPaste: CustomMember
  emoji: CustomMember
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
  // The single drop pipeline; only useful when there's a media node to route to.
  if (options.image !== false || options.video !== false) list.push(MediaDrop)
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
  table: CustomMember
  taskList: CustomMember
  iframe: CustomMember
  toc: CustomMember
  slashCommands: CustomMember
  color: CustomMember
  highlight: CustomMember
  typography: CustomMember
  textAlign: CustomMember
  styleClipboard: CustomMember
}

export const RichTextKit = Extension.create<RichTextKitOptions>({
  name: 'richTextKit',
  addOptions() {
    return {
      ...commentKitDefaults(),
      table: {},
      taskList: {},
      iframe: {},
      toc: {},
      slashCommands: {},
      color: {},
      highlight: {},
      typography: {},
      textAlign: {},
      styleClipboard: {},
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
    // SlashCommands ships a built-in command registry; `false` removes it.
    if (options.slashCommands !== false)
      list.push(SlashCommands.configure(options.slashCommands))
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

export interface InlineKitOptions {
  starterKit: Partial<StarterKitOptions> | false
  placeholder: CustomMember
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
        // Keep the inline marks; drop every block-level affordance plus the
        // built-in document/link (replaced above / by the Link member).
        StarterKit.configure({
          document: false,
          link: false,
          heading: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          listKeymap: false,
          blockquote: false,
          codeBlock: false,
          horizontalRule: false,
          hardBreak: false,
          trailingNode: false,
          ...options.starterKit,
        }),
      )
    }
    pushMember(list, Placeholder, options.placeholder)
    pushMember(list, Link, options.link)
    return list
  },
})
