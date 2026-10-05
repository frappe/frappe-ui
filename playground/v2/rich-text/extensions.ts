// The blocks and marks the design shows that frappe-ui's RichTextKit does
// not carry: sub- and superscript, an audio player, callouts, expand/collapse
// and a multi-column layout, and the comment mark the toolbar's comment
// button lays on a selection. Each is a small tiptap extension on top of the
// kit, so everything else — text, lists, links, images, tables, code, colour,
// highlight, mentions, embeds — stays the library's.
import { Mark, Node, mergeAttributes } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { imageEngine } from '../../../src/molecules/editor/extensions/image/image-engine'
import { resolveUploadOptions } from '../../../src/molecules/editor/extensions/shared/media-upload-engine'
import { openImageSourcePopup } from './rteImagePopup'
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
import RteImageSlotView from './RteImageSlot.vue'

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
      /**
       * `count` columns where the selection is: the row it sits in re-counted
       * — columns added empty, or the extra ones folded into the last kept —
       * and a new row of them anywhere else
       */
      setColumns: (count?: number) => ReturnType
      /** the share of the row each column of the row at `pos` has */
      setColumnWidths: (pos: number, widths: number[]) => ReturnType
    }
    rteImageSlot: {
      /** lay an empty image slot down, to be filled by file or by link */
      insertImageSlot: () => ReturnType
      /** a row of empty slots, one per column — one column is a bare slot */
      insertImageColumns: (count?: number) => ReturnType
    }
    rteDetails: {
      insertDetails: () => ReturnType
      /**
       * the block the caret is in made a toggle list, its text the summary
       * — or, already a toggle's summary, made plain blocks again
       */
      setToggleList: () => ReturnType
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
      // the share of the row each column has, as the bar between two of
      // them sets it (RteColumnResizer); none means equal shares. Drawn
      // as the grid's own template, so the row needs no script to keep it.
      widths: {
        default: null,
        parseHTML: (el) => {
          const raw = el.getAttribute('data-widths')
          if (!raw) return null
          const widths = raw.split(',').map(Number)
          const count = Number(el.getAttribute('data-count') ?? widths.length)
          return widths.length === count &&
            widths.every((w) => Number.isFinite(w) && w > 0)
            ? widths
            : null
        },
        renderHTML: (attrs) => {
          const widths = attrs.widths as number[] | null
          if (!widths) return {}
          return {
            'data-widths': widths.map((w) => w.toFixed(4)).join(','),
            style: `grid-template-columns: ${widths
              .map((w) => `minmax(0, ${w.toFixed(4)}fr)`)
              .join(' ')}`,
          }
        },
      },
      // a row of pictures is ruled differently from a row of prose: the
      // file sets its cells 16 apart with nothing drawn between them
      media: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-media') === 'true',
        renderHTML: (attrs) => (attrs.media ? { 'data-media': 'true' } : {}),
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
      setColumnWidths:
        (pos: number, widths: number[]) =>
        ({ state, tr, dispatch }) => {
          const row = state.doc.nodeAt(pos)
          if (
            !row ||
            row.type !== this.type ||
            widths.length !== row.childCount
          )
            return false
          if (dispatch)
            tr.setNodeMarkup(pos, undefined, { ...row.attrs, widths })
          return true
        },
      setColumns:
        (count = 2) =>
        ({ state, tr, dispatch, commands }) => {
          const { $from } = state.selection
          let depth = 0
          for (let d = $from.depth; d > 0; d--)
            if ($from.node(d).type.name === 'columns') {
              depth = d
              break
            }
          if (!depth) return commands.insertColumns(count)

          const row = $from.node(depth)
          if (row.childCount === count) return true
          if (!dispatch) return true

          const column = state.schema.nodes.column
          const columns = row.content.content.slice(0, count)
          if (count > row.childCount) {
            // grown: the new columns stand empty on the right
            for (let i = row.childCount; i < count; i++)
              columns.push(column.createAndFill()!)
          } else {
            // shrunk: what the dropped columns held goes to the end of
            // the last column kept, in order, so nothing is lost
            const last = columns[count - 1]
            let content = last.content
            for (let i = count; i < row.childCount; i++)
              content = content.append(row.child(i).content)
            columns[count - 1] = last.copy(content)
          }

          const from = $from.before(depth)
          // a re-counted row starts from equal shares again
          const next = row.type.create(
            { ...row.attrs, count, widths: null },
            columns,
          )
          tr.replaceWith(from, from + row.nodeSize, next)

          // the caret stays on its text: untouched in a kept column, and
          // carried along with the text folded into the last one
          const index = $from.index(depth)
          let pos = $from.pos
          if (index >= count) {
            // the start of the last kept column's content, plus what came
            // before this column's text in the fold, plus the caret's offset
            let start = from + 1
            for (let i = 0; i < count - 1; i++) start += row.child(i).nodeSize
            let before = row.child(count - 1).content.size
            for (let i = count; i < index; i++)
              before += row.child(i).content.size
            pos = start + 1 + before + ($from.pos - $from.start(depth + 1))
          }
          tr.setSelection(TextSelection.near(tr.doc.resolve(pos)))
          return true
        },
    }
  },
})

// ---- the image slot: the empty row the file lays down before a picture
// exists (32243:108985). It stands in the document until it is filled, and
// filling it is the one gesture — a file off the disk or a link to one —
// RteImageSlot's card asks for. A row of slots inside a media columns node
// is the file's columns-wise upload: every cell takes its own picture, and
// an untouched cell keeps showing its Add Image.
export const ImageSlot = Node.create({
  name: 'imageSlot',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  parseHTML: () => [{ tag: 'div[data-type="image-slot"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-type': 'image-slot' }),
  ],
  addNodeView() {
    return VueNodeViewRenderer(RteImageSlotView)
  },
  addCommands() {
    return {
      insertImageSlot:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
      // one slot per column; a single column is no grid at all, so it is
      // just the slot across the document
      insertImageColumns:
        (count = 2) =>
        ({ commands }) =>
          count < 2
            ? commands.insertContent({ type: this.name })
            : commands.insertContent({
                type: 'columns',
                attrs: { count, media: true },
                content: Array.from({ length: count }, () => ({
                  type: 'column',
                  content: [{ type: this.name }],
                })),
              }),
      // the library's picker goes to the disk the moment it is called. The
      // file asks first, so every way in — /image, the + menu, the toolbar
      // — lays the slot down and lets the card do the asking.
      selectAndUploadImage:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
      // and so does Replace on a picture's menu: the card floats beside the
      // picture, and what it answers takes the picture's place — a file by
      // the library's upload, a link straight in — with the caption, the
      // alignment and the cell it stands in kept.
      replaceImage:
        (pos: number, file?: File) =>
        ({ editor }) => {
          const node = editor.state.doc.nodeAt(pos)
          if (!node || node.type.name !== 'image') return false
          if (file) {
            void imageEngine.uploadReplace(
              file,
              editor,
              pos,
              resolveUploadOptions({ editor }),
              node.attrs,
            )
            return true
          }
          openImageSourcePopup(editor, pos, {
            file: (at, chosen) => editor.commands.replaceImage(at, chosen),
            link: (at, image) => {
              const live = editor.state.doc.nodeAt(at)
              if (!live || live.type.name !== 'image') return
              editor.view.dispatch(
                editor.state.tr.setNodeMarkup(at, undefined, {
                  ...live.attrs,
                  ...image,
                  uploadId: null,
                  loading: false,
                  error: null,
                }),
              )
            },
          })
          return true
        },
    }
  },
  // A row of pictures keeps every cell either filled or offering: a cell
  // whose picture goes — deleted from its menu, dragged to another cell,
  // its upload cancelled — gets its slot back, and a cell a picture lands
  // in gives its slot up. Said once here, so no way of moving a picture
  // has to remember it.
  addProseMirrorPlugins() {
    const slot = this.type
    const blankParagraph = (n: PMNode) =>
      n.type.name === 'paragraph' && n.content.size === 0
    return [
      new Plugin({
        key: new PluginKey('rteImageSlots'),
        appendTransaction: (transactions, _old, state) => {
          if (!transactions.some((tr) => tr.docChanged)) return null
          const edits: { from: number; to: number; slot?: boolean }[] = []
          state.doc.descendants((row, rowPos) => {
            if (row.type.name !== 'columns') return true
            if (!row.attrs.media) return false
            row.forEach((column, offset) => {
              // the first position inside the column
              const start = rowPos + 1 + offset + 1
              let picture = false
              column.descendants((n) => {
                if (n.type.name === 'image') picture = true
                return !picture
              })
              let slots = 0
              column.forEach((child) => {
                if (child.type === slot) slots++
              })
              if (picture) {
                column.forEach((child, at) => {
                  if (child.type === slot)
                    edits.push({
                      from: start + at,
                      to: start + at + child.nodeSize,
                    })
                })
              } else if (slots) {
                column.forEach((child, at) => {
                  if (blankParagraph(child))
                    edits.push({
                      from: start + at,
                      to: start + at + child.nodeSize,
                    })
                })
              } else {
                let blank = true
                column.forEach((child) => {
                  if (!blankParagraph(child)) blank = false
                })
                if (blank)
                  edits.push({
                    from: start,
                    to: start + column.content.size,
                    slot: true,
                  })
              }
            })
            return false
          })
          if (!edits.length) return null
          const tr = state.tr
          for (const e of edits.sort((a, b) => b.from - a.from)) {
            if (e.slot) tr.replaceWith(e.from, e.to, slot.create())
            else tr.delete(e.from, e.to)
          }
          return tr
        },
      }),
    ]
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
      // the select's "Toggle list", a block style like a heading is: the
      // line the caret is in becomes a toggle's summary, open, with an
      // empty line to fill under it; picked again on a summary, the toggle
      // comes apart — the summary a paragraph, what it held set down after
      setToggleList:
        () =>
        ({ state, tr, dispatch }) => {
          const { schema } = state
          const { $from } = state.selection
          const summaryType = schema.nodes.detailsSummary
          const contentType = schema.nodes.detailsContent
          const paragraph = schema.nodes.paragraph

          // on a summary: unwrap the toggle
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type !== summaryType) continue
            const details = $from.node(d - 1)
            const pos = $from.before(d - 1)
            if (!dispatch) return true
            const blocks = [
              paragraph.create(null, details.child(0).content),
              ...(details.child(1)?.content.content ?? []),
            ]
            tr.replaceWith(pos, pos + details.nodeSize, blocks)
            tr.setSelection(
              TextSelection.near(
                tr.doc.resolve(pos + 1 + ($from.pos - $from.start(d))),
              ),
            )
            return true
          }

          // elsewhere: the caret's text block becomes a toggle's summary
          const depth = $from.depth
          const block = $from.node(depth)
          if (!block.isTextblock) return false
          if (!dispatch) return true
          const pos = $from.before(depth)
          const details = this.type.create({ open: true }, [
            summaryType.create(null, block.content),
            contentType.create(null, paragraph.create()),
          ])
          tr.replaceWith(pos, pos + block.nodeSize, details)
          tr.setSelection(
            TextSelection.near(
              tr.doc.resolve(pos + 2 + ($from.pos - $from.start(depth))),
            ),
          )
          return true
        },
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
  ImageSlot,
  DetailsSummary,
  DetailsContent,
  Details,
  CommentMark,
]
