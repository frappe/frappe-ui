// The blocks and marks the design shows that frappe-ui's RichTextKit does
// not carry: sub- and superscript, an audio player, callouts, expand/collapse
// and a multi-column layout, and the comment mark the toolbar's comment
// button lays on a selection. Each is a small tiptap extension on top of the
// kit, so everything else — text, lists, links, images, tables, code, colour,
// highlight, mentions, embeds — stays the library's.
import { Mark, Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { FontFamily, FontSize, LineHeight } from '@tiptap/extension-text-style'
import {
  Attachment as KitAttachment,
  Link as KitLink,
  Table,
  TableRow as KitTableRow,
  TableCell,
  TableHeader,
  TableNavigation,
  TableCellColor,
  TableSelectionOverlay,
} from '../../../src/molecules/editor'
import AttachmentNodeView from './AttachmentNodeView.vue'
import { buildOpenRteLinkEditor } from './rteLinkPopup'
import AudioNodeView from './AudioNodeView.vue'
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
      /** carry the block the cursor is in one place up or down */
      moveDetails: (dir: -1 | 1) => ReturnType
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

// ---- audio: a block with the file's player — play, a slider, 0:15 / 32:48,
// volume and ⋯ — over a hidden <audio>; it serialises as <audio src title>
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
  renderHTML: ({ HTMLAttributes }) => ['audio', HTMLAttributes],
  addNodeView() {
    return VueNodeViewRenderer(AudioNodeView, {
      // tiptap keeps a press to itself only when the target is the <button>
      // element; a press on the glyph inside it would go to ProseMirror,
      // which selects the node and takes focus — and a menu that just opened
      // closes again. Anything inside a control is the player's alone.
      stopEvent: ({ event }) =>
        !!(event.target as HTMLElement).closest?.(
          'button, [role="slider"], [role="menu"]',
        ),
    })
  },
  addCommands() {
    return {
      setAudio:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options }),
    }
  },
})

// ---- attachment: the kit's node — its schema, upload and drop pipeline —
// drawn as the file's row (31457:33634) instead of the kit's chip. The kit
// is configured without its own copy, so this one stands in.
//
// A row, not a chip: the kit's node is inline, so a dragged chip could land
// in the middle of a sentence. Here it is a block, carried between blocks
// by the document's grip (RteBlockHandle) as every block is.
export const Attachment = KitAttachment.extend({
  inline: false,
  group: 'block',
  addNodeView() {
    // tiptap's own stopEvent keeps a press to itself only when the target
    // is a <button>-like element — the row is an <a>, and a press on it
    // would go to ProseMirror, which selects the node. This one keeps the
    // row's presses.
    return VueNodeViewRenderer(AttachmentNodeView, {
      stopEvent: ({ event }) => {
        const target = event.target as HTMLElement
        const { type } = event
        if (type.startsWith('drag') || type === 'drop') {
          // the link's own native drag is no drag of the row: without this
          // the browser would carry the URL, and a drop would paste it as
          // text
          if (type === 'dragstart') event.preventDefault()
          return false
        }
        return !!target.closest?.('a, button')
      },
    })
  },
})

// ---- link: the kit's mark and its plugins, with the file's card
// (31823:54797) in place of the library's popup. `openLinkEditor` is what
// the Link buttons and ⌘K run, so overriding the one command covers all.
export const Link = KitLink.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      openLinkEditor: buildOpenRteLinkEditor(this.type),
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
  // Alt+↑ / Alt+↓ move the block, as the grip does with the pointer
  addKeyboardShortcuts() {
    return {
      'Alt-ArrowUp': () => this.editor.commands.moveDetails(-1),
      'Alt-ArrowDown': () => this.editor.commands.moveDetails(1),
    }
  },
  addCommands() {
    return {
      moveDetails:
        (dir) =>
        ({ state, tr, dispatch }) => {
          const { $from } = state.selection
          let depth = $from.depth
          while (depth > 0 && $from.node(depth).type.name !== this.name) depth--
          if (depth === 0) return false
          const node = $from.node(depth)
          const pos = $from.before(depth)
          const parent = $from.node(depth - 1)
          const index = $from.index(depth - 1)
          const other = dir < 0 ? index - 1 : index + 1
          if (other < 0 || other >= parent.childCount) return false
          const sibling = parent.child(other)
          if (!dispatch) return true
          const offset = $from.pos - pos
          // lift the block out, then set it down past its neighbour
          tr.delete(pos, pos + node.nodeSize)
          const at = dir < 0 ? pos - sibling.nodeSize : pos + sibling.nodeSize
          tr.insert(at, node)
          tr.setSelection(
            state.selection.constructor.near(tr.doc.resolve(at + offset)),
          )
          tr.scrollIntoView()
          return true
        },
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

// ---- table: the library's table stack, its row carrying the file's border
// option (32157:9144 › Row selection › Border options): top, right, bottom,
// left or none, drawn by the page's table CSS off `data-border`; unset, the
// row keeps the file's grid.
export type RowBorder = 'top' | 'right' | 'bottom' | 'left' | 'none'
export const TableRow = KitTableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      border: {
        default: null as RowBorder | null,
        parseHTML: (el) => el.getAttribute('data-border'),
        renderHTML: (attrs) =>
          attrs.border ? { 'data-border': attrs.border } : {},
      },
    }
  },
})

export const playgroundExtensions = [
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableNavigation,
  TableCellColor,
  TableSelectionOverlay,
  FontFamily,
  FontSize,
  LineHeight,
  Subscript,
  Superscript,
  Link,
  Attachment,
  Audio,
  Callout,
  Column,
  Columns,
  DetailsSummary,
  DetailsContent,
  Details,
  CommentMark,
]
