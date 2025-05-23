<template>
  <div
    class="relative w-full"
    :class="$attrs.class"
    :style="$attrs.style"
    v-if="editor"
    @mousemove="handleEditorMouseMove"
    ref="editorContainer"
  >
    <TextEditorBubbleMenu :buttons="bubbleMenu" :options="bubbleMenuOptions" />
    <TextEditorFixedMenu
      class="w-full overflow-x-auto rounded-t-lg border border-outline-gray-modals"
      :buttons="fixedMenu"
    />
    <TextEditorFloatingMenu :buttons="floatingMenu" />
    <slot name="top" />
    <slot name="editor" :editor="editor">
      <editor-content :editor="editor" />
    </slot>
    <slot name="bottom" />
    <TableCellActionHandle
      v-if="showActionHandle"
      :position="actionHandlePosition"
      :axis="actionHandleAxis"
      @click="showTableActionMenu"
    />
    <TableCellActionHandle
      v-if="showColumnActionDots"
      class="column-action-handle"
      :position="columnActionPosition"
      :axis="'column'"
      @click="showTableActionMenu('column')"
    />
    <TableCellActionHandle
      v-if="showRowActionDots"
      class="row-action-handle"
      :position="rowActionPosition"
      :axis="'row'"
      @click="showTableActionMenu('row')"
    />
    <TableActionMenu
      v-if="showMenu"
      :editor="editor"
      :position="menuPosition"
      :axis="menuAxis"
      :cell-info="activeCellInfo"
      @close="hideTableActionMenu"
    />
  </div>
</template>

<script lang="ts">
import { normalizeClass, computed } from 'vue'
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { ImageExtension } from './extensions/image'
import ImageViewerExtension from './image-viewer-extension'
import VideoExtension from './video-extension'
import LinkExtension from './link-extension'
import Typography from '@tiptap/extension-typography'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { Color } from '@tiptap/extension-color'
import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockComponent from './CodeBlockComponent.vue'
import configureMention from './mention'
import TextEditorFixedMenu from './TextEditorFixedMenu.vue'
import TextEditorBubbleMenu from './TextEditorBubbleMenu.vue'
import TextEditorFloatingMenu from './TextEditorFloatingMenu.vue'
import EmojiExtension from './extensions/emoji/emoji-extension'
import SlashCommands from './extensions/slash-commands/slash-commands-extension'
import { detectMarkdown, markdownToHTML } from '../../utils/markdown'
import { DOMParser } from 'prosemirror-model'
import { TagNode, TagExtension } from './extensions/tag/tag-extension'
import { Heading } from './extensions/heading/heading'
import TableCellActionHandle from './TableCellActionHandle.vue'
import TableActionMenu from './TableActionMenu.vue'

const lowlight = createLowlight(common)

export default {
  name: 'TextEditor',
  inheritAttrs: false,
  components: {
    EditorContent,
    TextEditorFixedMenu,
    TextEditorBubbleMenu,
    TextEditorFloatingMenu,
    TableCellActionHandle,
    TableActionMenu,
  },
  props: {
    content: {
      type: String,
      default: null,
    },
    placeholder: {
      type: [String, Function],
      default: '',
    },
    editorClass: {
      type: [String, Array, Object],
      default: '',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    bubbleMenu: {
      type: [Boolean, Array],
      default: false,
    },
    bubbleMenuOptions: {
      type: Object,
      default: () => ({}),
    },
    fixedMenu: {
      type: [Boolean, Array],
      default: false,
    },
    floatingMenu: {
      type: [Boolean, Array],
      default: false,
    },
    extensions: {
      type: Array,
      default: () => [],
    },
    starterkitOptions: {
      type: Object,
      default: () => ({}),
    },
    mentions: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
    uploadFunction: {
      type: Function,
      default: () => null,
    },
  },
  emits: ['change', 'focus', 'blur'],
  expose: ['editor'],
  provide() {
    return {
      editor: computed(() => this.editor),
    }
  },
  data() {
    return {
      editor: null,
      showActionHandle: false,
      actionHandlePosition: { top: 0, left: 0 },
      actionHandleAxis: 'row', // 'row' or 'column'
      showMenu: false,
      menuPosition: { top: 0, left: 0 },
      menuAxis: 'row',
      hoveredCellInfo: null, // { element, pos, node, rowIndex, colIndex, isFirstRow, isFirstCol }
      showColumnActionDots: false,
      showRowActionDots: false,
      columnActionPosition: { top: 0, left: 0 },
      columnCellInfo: null,
      rowActionPosition: { top: 0, left: 0 },
      rowCellInfo: null,
      activeCellInfo: null,
    }
  },
  watch: {
    content(val) {
      let currentHTML = this.editor.getHTML()
      if (currentHTML !== val) {
        this.editor.commands.setContent(val)
      }
    },
    editable(value) {
      this.editor.setEditable(value)
    },
    editorProps: {
      deep: true,
      handler(value) {
        if (this.editor) {
          this.editor.setOptions({
            editorProps: value,
          })
        }
      },
    },
  },
  mounted() {
    this.editor = new Editor({
      content: this.content || null,
      editorProps: this.editorProps,
      editable: this.editable,
      extensions: [
        StarterKit.configure({
          ...this.starterkitOptions,
          codeBlock: false,
          heading: false,
        }),
        Heading.configure({
          ...(typeof this.starterkitOptions?.heading === 'object' &&
          this.starterkitOptions.heading !== null
            ? this.starterkitOptions.heading
            : {}),
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Typography,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        CodeBlockLowlight.extend({
          addNodeView() {
            return VueNodeViewRenderer(CodeBlockComponent)
          },
        }).configure({ lowlight }),
        ImageExtension.configure({
          uploadFunction: this.uploadFunction,
        }),
        ImageViewerExtension,
        VideoExtension.configure({
          uploadFunction: this.uploadFunction,
        }),
        LinkExtension.configure({
          openOnClick: false,
        }),
        Placeholder.configure({
          placeholder:
            typeof this.placeholder === 'function'
              ? this.placeholder
              : () => this.placeholder,
        }),
        configureMention(this.mentions),
        EmojiExtension,
        SlashCommands,
        TagNode,
        TagExtension.configure({
          tags: () => this.tags,
        }),
        ...(this.extensions || []),
      ],
      onUpdate: ({ editor }) => {
        this.$emit('change', editor.getHTML())
        this.hideTableActionMenu()
        this.hideActionHandle()
      },
      onFocus: ({ editor, event }) => {
        this.$emit('focus', event)
      },
      onBlur: ({ editor, event }) => {
        this.$emit('blur', event)
        setTimeout(() => {
          if (!this.showMenu) {
            this.hideActionHandle()
          }
        }, 100)
      },
    })
  },
  beforeUnmount() {
    this.editor.destroy()
    this.editor = null
  },
  computed: {
    editorProps() {
      return {
        attributes: {
          class: normalizeClass([
            'prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2',
            'scrollable-tables',
            this.editorClass,
          ]),
        },
        clipboardTextParser: (text, $context) => {
          if (!detectMarkdown(text)) return
          if (
            !confirm(
              'Do you want to convert markdown content to HTML before pasting?',
            )
          )
            return

          let dom = document.createElement('div')
          dom.innerHTML = markdownToHTML(text)
          let parser =
            this.editor.view.someProp('clipboardParser') ||
            this.editor.view.someProp('domParser') ||
            DOMParser.fromSchema(this.editor.schema)
          return parser.parseSlice(dom, {
            preserveWhitespace: true,
            context: $context,
          })
        },
      }
    },
  },
  methods: {
    handleEditorMouseMove(event) {
      if (!this.editor || !this.editable || this.showMenu) {
        if (!this.showMenu) this.hideActionHandle()
        return
      }

      const view = this.editor.view
      const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
      if (!pos) return

      const directDom = view.domAtPos(pos.pos)
      let cell =
        directDom?.node.nodeType === Node.ELEMENT_NODE
          ? directDom.node
          : directDom?.node.parentElement

      while (
        cell &&
        cell.tagName !== 'TD' &&
        cell.tagName !== 'TH' &&
        cell.closest('.ProseMirror')
      ) {
        cell = cell.parentElement
      }

      if (cell && (cell.tagName === 'TD' || cell.tagName === 'TH')) {
        const cellPos = this.getCellPosition(cell)
        const table = cell.closest('table')

        if (!table) {
          this.hideActionHandleIfNeeded(event)
          return
        }

        const editorContainerRect =
          this.$refs.editorContainer.getBoundingClientRect()

        const topmostCell = this.getTopmostCellInColumn(table, cellPos.colIndex)
        const leftmostCell = this.getLeftmostCellInRow(table, cellPos.rowIndex)

        if (topmostCell) {
          const topmostRect = topmostCell.getBoundingClientRect()
          this.showColumnActionDots = true
          this.columnActionPosition = {
            top: topmostRect.top - editorContainerRect.top,
            left:
              topmostRect.left -
              editorContainerRect.left +
              topmostRect.width / 2,
          }
          this.columnCellInfo = {
            element: topmostCell,
            axis: 'column',
            ...this.getCellPosition(topmostCell),
            hoveredColIndex: cellPos.colIndex,
            originalHoveredCell: cell,
          }
        }

        if (leftmostCell) {
          const leftmostRect = leftmostCell.getBoundingClientRect()
          this.showRowActionDots = true
          this.rowActionPosition = {
            top:
              leftmostRect.top -
              editorContainerRect.top +
              leftmostRect.height / 2,
            left: leftmostRect.left - editorContainerRect.left,
          }
          this.rowCellInfo = {
            element: leftmostCell,
            axis: 'row',
            ...this.getCellPosition(leftmostCell),
            hoveredRowIndex: cellPos.rowIndex,
            originalHoveredCell: cell,
          }
        }

        this.hoveredCellInfo = {
          element: cell,
          ...cellPos,
        }

        return
      } else {
        this.hideActionHandleIfNeeded(event)
      }
    },
    getTopmostCellInColumn(table, colIndex) {
      const rows = table.querySelectorAll('tr')
      if (rows.length === 0) return null

      const firstRow = rows[0]
      const cells = Array.from(firstRow.children)
      return cells[colIndex] || null
    },
    getLeftmostCellInRow(table, rowIndex) {
      const rows = table.querySelectorAll('tr')
      if (rowIndex >= rows.length) return null

      const targetRow = rows[rowIndex]
      const cells = Array.from(targetRow.children)
      return cells[0] || null
    },
    hideActionHandleIfNeeded(event) {
      if (this.showColumnActionDots || this.showRowActionDots) {
        const columnHandleEl = this.$el.querySelector('.column-action-handle')
        const rowHandleEl = this.$el.querySelector('.row-action-handle')
        if (
          (columnHandleEl && columnHandleEl.contains(event.target)) ||
          (rowHandleEl && rowHandleEl.contains(event.target))
        ) {
          return
        }
      }
      this.hideActionHandle()
    },
    hideActionHandle() {
      this.showActionHandle = false
      this.showColumnActionDots = false
      this.showRowActionDots = false
      this.hoveredCellInfo = null
      this.columnCellInfo = null
      this.rowCellInfo = null
    },
    focusCellForMenu(cellInfo) {
      if (!cellInfo || !cellInfo.element) {
        return false
      }

      const targetElement = cellInfo.originalHoveredCell || cellInfo.element
      if (!targetElement) return false

      const view = this.editor.view
      try {
        let pos = view.posAtDOM(targetElement, 0)
        if (pos === null || pos === undefined || pos < 0) {
          const rect = targetElement.getBoundingClientRect()
          const coords = view.posAtCoords({
            left: rect.left + 1,
            top: rect.top + 1,
          })
          if (coords) {
            pos = coords.pos
          }
        }

        if (pos !== null && pos !== undefined && pos >= 0) {
          this.editor.commands.setTextSelection(pos)
          this.editor.commands.focus()
          return true
        } else {
          return false
        }
      } catch (error) {
        this.editor.commands.focus()
        return false
      }
    },
    showTableActionMenu(type) {
      const cellInfo =
        type === 'column' ? this.columnCellInfo : this.rowCellInfo
      const position =
        type === 'column' ? this.columnActionPosition : this.rowActionPosition

      if (!cellInfo) {
        return
      }

      this.focusCellForMenu(cellInfo)

      const editorContainerRect =
        this.$refs.editorContainer.getBoundingClientRect()

      if (type === 'row') {
        this.menuPosition = {
          top: position.top,
          left: position.left + 20,
        }
      } else {
        this.menuPosition = {
          top: position.top + 20,
          left: position.left,
        }
      }
      this.menuAxis = type
      this.activeCellInfo = cellInfo
      this.showMenu = true
    },
    hideTableActionMenu() {
      this.showMenu = false
      this.activeCellInfo = null
    },
    getCellPosition(cellElement) {
      const table = cellElement.closest('table')
      if (!table)
        return {
          rowIndex: -1,
          colIndex: -1,
          isFirstRow: false,
          isFirstCol: false,
        }

      const row = cellElement.closest('tr')
      const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(row)
      const colIndex = Array.from(row.children).indexOf(cellElement)

      return {
        rowIndex,
        colIndex,
        isFirstRow: rowIndex === 0,
        isFirstCol: colIndex === 0,
        cellElement,
      }
    },
  },
}
</script>
<style>
.ProseMirror {
  outline: none;
  caret-color: var(--ink-gray-9);
  word-break: break-word;
}

/* Firefox */
.ProseMirror-focused:focus-visible {
  outline: none;
}

/* Placeholder */
.ProseMirror:not(.ProseMirror-focused) p.is-editor-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--ink-gray-4);
  pointer-events: none;
  height: 0;
}

.ProseMirror-selectednode video,
img.ProseMirror-selectednode {
  outline: 2px solid var(--outline-gray-2);
}

/* Mentions */
.mention {
  font-weight: 600;
  box-decoration-break: clone;
}

/* Table styles */
.prose table p {
  margin: 0;
}

/* Prosemirror specific table styles */
.ProseMirror table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  background: theme('colors.blue.200');
  opacity: 0.3;
}

.ProseMirror table .column-resize-handle {
  position: absolute;
  right: -1px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: theme('colors.blue.200');
  pointer-events: none;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.ProseMirror mark {
  border-radius: 3px;
  padding: 0 2px;
}
.tag-item,
.tag-suggestion-active {
  background-color: var(--surface-gray-1, #f8f8f8);
  color: inherit;
  border: 1px solid transparent;
  padding: 0px 2px;
  border-radius: 4px;
  font-size: 1em;
  white-space: nowrap;
  cursor: default;
}

.tag-item.ProseMirror-selectednode {
  border-color: var(--outline-gray-3, #c7c7c7);
}

.tag-suggestion-active {
  background-color: var(--surface-gray-2, #f3f3f3);
}

.scrollable-tables table {
  table-layout: auto !important;
  width: 100%;
  min-width: 100%;
  max-width: none;
  overflow-x: auto;
  display: block;
  border-collapse: separate;
  border-spacing: 0;
}

.scrollable-tables table thead,
.scrollable-tables table tbody,
.scrollable-tables table tfoot {
  display: table;
  width: 100%;
  table-layout: auto;
}

.scrollable-tables table tr {
  display: table-row;
}

.scrollable-tables table th,
.scrollable-tables table td {
  display: table-cell;
  white-space: nowrap;
  min-width: 120px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scrollable-tables table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  background: theme('colors.blue.200');
  opacity: 0.3;
}

.scrollable-tables table .column-resize-handle {
  position: absolute;
  right: -1px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: theme('colors.blue.200');
  pointer-events: none;
}

@media (max-width: 768px) {
  .scrollable-tables table th,
  .scrollable-tables table td {
    min-width: 100px;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .scrollable-tables table th,
  .scrollable-tables table td {
    min-width: 80px;
    max-width: 150px;
  }
}
</style>
