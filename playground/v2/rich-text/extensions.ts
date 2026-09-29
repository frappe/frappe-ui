// The blocks and marks the design shows that frappe-ui's RichTextKit does
// not carry: sub- and superscript, an audio player, callouts, expand/collapse
// and a multi-column layout, and the comment mark the toolbar's comment
// button lays on a selection. Each is a small tiptap extension on top of the
// kit, so everything else — text, lists, links, images, tables, code, colour,
// highlight, mentions, embeds — stays the library's.
import { Mark, Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { FontFamily, FontSize, LineHeight } from '@tiptap/extension-text-style'
import DetailsNodeView from './DetailsNodeView.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    rteSubscript: {
      toggleSubscript: () => ReturnType
    }
    rteSuperscript: {
      toggleSuperscript: () => ReturnType
    }
    rteAudio: {
      setAudio: (options: { src: string; title?: string }) => ReturnType
    }
    rteCallout: {
      setCallout: (options?: { emoji?: string }) => ReturnType
    }
    rteColumns: {
      insertColumns: (count?: number) => ReturnType
    }
    rteDetails: {
      insertDetails: () => ReturnType
    }
    rteComment: {
      setComment: (id: string) => ReturnType
      unsetComment: () => ReturnType
    }
  }
}

export { FontFamily, FontSize, LineHeight }

// ---- sub / superscript: the ⋯ overflow's two items
export const Subscript = Mark.create({
  name: 'subscript',
  excludes: 'superscript',
  parseHTML: () => [{ tag: 'sub' }],
  renderHTML: ({ HTMLAttributes }) => ['sub', HTMLAttributes, 0],
  addCommands() {
    return {
      toggleSubscript:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    }
  },
  addKeyboardShortcuts() {
    return { 'Mod-,': () => this.editor.commands.toggleSubscript() }
  },
})

export const Superscript = Mark.create({
  name: 'superscript',
  excludes: 'subscript',
  parseHTML: () => [{ tag: 'sup' }],
  renderHTML: ({ HTMLAttributes }) => ['sup', HTMLAttributes, 0],
  addCommands() {
    return {
      toggleSuperscript:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    }
  },
  addKeyboardShortcuts() {
    return { 'Mod-.': () => this.editor.commands.toggleSuperscript() }
  },
})

// ---- audio: a block with the browser's player, as the file's 0:15 / 32:48 bar
export const Audio = Node.create({
  name: 'audio',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
    }
  },
  parseHTML: () => [
    {
      tag: 'audio[src]',
      getAttrs: (el) => ({
        src: (el as HTMLElement).getAttribute('src'),
        title: (el as HTMLElement).getAttribute('title'),
      }),
    },
  ],
  renderHTML: ({ HTMLAttributes }) => [
    'audio',
    mergeAttributes(HTMLAttributes, {
      controls: 'controls',
      preload: 'metadata',
      class: 'rte-audio',
    }),
  ],
  addCommands() {
    return {
      setAudio:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options }),
    }
  },
})

// ---- callout: a tinted block led by an emoji, as the file's Tip / Getting
// Started / Upcoming Release cards. The first line is its title.
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return {
      emoji: {
        default: '💡',
        parseHTML: (el) => el.getAttribute('data-emoji') ?? '💡',
        renderHTML: (attrs) => ({ 'data-emoji': attrs.emoji }),
      },
    }
  },
  parseHTML: () => [{ tag: 'div[data-type="callout"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }),
    0,
  ],
  addCommands() {
    return {
      setCallout:
        (options = {}) =>
        ({ commands }) =>
          commands.wrapIn(this.name, { emoji: options.emoji ?? '💡' }),
    }
  },
})

// ---- columns: two to four side by side, each a column of blocks
export const Column = Node.create({
  name: 'column',
  content: 'block+',
  isolating: true,
  parseHTML: () => [{ tag: 'div[data-type="column"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-type': 'column' }),
    0,
  ],
})

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2,4}',
  defining: true,
  addAttributes() {
    return {
      count: {
        default: 2,
        parseHTML: (el) => Number(el.getAttribute('data-count') ?? 2),
        renderHTML: (attrs) => ({ 'data-count': attrs.count }),
      },
    }
  },
  parseHTML: () => [{ tag: 'div[data-type="columns"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-type': 'columns' }),
    0,
  ],
  addCommands() {
    return {
      insertColumns:
        (count = 2) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { count },
            content: Array.from({ length: count }, () => ({
              type: 'column',
              content: [{ type: 'paragraph' }],
            })),
          }),
    }
  },
})

// ---- expand / collapse: a summary line with a chevron, and the content
// it folds away, as the file's ERPNext … Lending list
export const DetailsSummary = Node.create({
  name: 'detailsSummary',
  content: 'inline*',
  defining: true,
  selectable: false,
  isolating: true,
  parseHTML: () => [{ tag: 'summary' }],
  renderHTML: ({ HTMLAttributes }) => ['summary', HTMLAttributes, 0],
})

export const DetailsContent = Node.create({
  name: 'detailsContent',
  content: 'block+',
  defining: true,
  selectable: false,
  isolating: true,
  parseHTML: () => [{ tag: 'div[data-type="details-content"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-type': 'details-content' }),
    0,
  ],
})

export const Details = Node.create({
  name: 'details',
  group: 'block',
  content: 'detailsSummary detailsContent',
  defining: true,
  isolating: true,
  draggable: true,
  addAttributes() {
    return {
      open: {
        default: false,
        parseHTML: (el) => el.hasAttribute('open'),
        renderHTML: (attrs) => (attrs.open ? { open: 'open' } : {}),
      },
    }
  },
  parseHTML: () => [{ tag: 'details' }],
  renderHTML: ({ HTMLAttributes }) => ['details', HTMLAttributes, 0],
  addNodeView() {
    return VueNodeViewRenderer(DetailsNodeView)
  },
  addCommands() {
    return {
      insertDetails:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { open: true },
            content: [
              { type: 'detailsSummary' },
              {
                type: 'detailsContent',
                content: [{ type: 'paragraph' }],
              },
            ],
          }),
    }
  },
})

// ---- comment: the amber run the toolbar's comment button lays on a
// selection; the thread itself lives beside the editor
export const CommentMark = Mark.create({
  name: 'comment',
  inclusive: false,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-comment'),
        renderHTML: (attrs) => ({ 'data-comment': attrs.id }),
      },
    }
  },
  parseHTML: () => [{ tag: 'span[data-comment]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'span',
    mergeAttributes(HTMLAttributes, { class: 'rte-comment' }),
    0,
  ],
  addCommands() {
    return {
      setComment:
        (id) =>
        ({ commands }) =>
          commands.setMark(this.name, { id }),
      unsetComment:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    }
  },
})

export const playgroundExtensions = [
  FontFamily,
  FontSize,
  LineHeight,
  Subscript,
  Superscript,
  Audio,
  Callout,
  Column,
  Columns,
  DetailsSummary,
  DetailsContent,
  Details,
  CommentMark,
]
