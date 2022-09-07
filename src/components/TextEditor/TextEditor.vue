<template>
  <div class="relative w-full" :class="$attrs.class" v-if="editor">
    <BubbleMenu
      v-if="bubbleMenuButtons"
      class="bubble-menu rounded-md shadow-sm"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <Menu
        :editor="editor"
        class="rounded-md border border-gray-100 shadow-lg"
        :buttons="bubbleMenuButtons"
      />
    </BubbleMenu>

    <Menu
      v-if="fixedMenuButtons"
      class="w-full overflow-x-auto rounded-t-lg border border-gray-200"
      :editor="editor"
      :buttons="fixedMenuButtons"
    />

    <FloatingMenu
      v-if="floatingMenuButtons"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
      class="flex"
    >
      <button
        v-for="button in floatingMenuButtons"
        :key="button.label"
        class="flex rounded p-1 text-gray-800 transition-colors"
        :class="button.isActive(editor) ? 'bg-gray-100' : 'hover:bg-gray-100'"
        @click="() => button.action(editor)"
        :title="button.label"
      >
        <component v-if="button.icon" :is="button.icon" class="h-4 w-4" />
        <span class="inline-block h-4 min-w-[1rem] text-sm leading-4" v-else>
          {{ button.text }}
        </span>
      </button>
    </FloatingMenu>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from './image-extension'
import Link from '@tiptap/extension-link'
import configureMention from './mention'
import Menu from './Menu.vue'
import commands from './commands'
import { normalizeClass } from 'vue'

export default {
  name: 'TextEditor',
  inheritAttrs: false,
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    Menu,
  },
  props: {
    content: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
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
  },
  emits: ['change'],
  expose: ['editor'],
  data() {
    return {
      editor: null,
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
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Image,
        Link,
        Placeholder.configure({
          showOnlyWhenEditable: false,
          placeholder: () => {
            return this.placeholder
          },
        }),
        configureMention(this.mentions),
        ...(this.extensions || []),
      ],
      onUpdate: ({ editor }) => {
        this.$emit('change', editor.getHTML())
      },
    })
  },
  beforeUnmount() {
    this.editor.destroy()
  },
  computed: {
    fixedMenuButtons() {
      if (!this.fixedMenu) return false

      let buttons
      if (Array.isArray(this.fixedMenu)) {
        buttons = this.fixedMenu
      } else {
        buttons = [
          [
            'Heading 1',
            'Heading 2',
            'Heading 3',
            'Heading 4',
            'Heading 5',
            'Heading 6',
          ],
          'Paragraph',
          'Separator',
          'Bold',
          'Italic',
          'Separator',
          'Bullet List',
          'Numbered List',
          'Separator',
          'Align Left',
          'Align Center',
          'Align Right',
          'Separator',
          'Image',
          'Blockquote',
          'Code',
          'Horizontal Rule',
          [
            'InsertTable',
            'AddColumnBefore',
            'AddColumnAfter',
            'DeleteColumn',
            'AddRowBefore',
            'AddRowAfter',
            'DeleteRow',
            'MergeCells',
            'SplitCell',
            'ToggleHeaderColumn',
            'ToggleHeaderRow',
            'ToggleHeaderCell',
            'DeleteTable',
          ],
          'Separator',
          'Undo',
          'Redo',
        ]
      }
      return buttons.map(createEditorButton)
    },
    bubbleMenuButtons() {
      if (!this.bubbleMenu) return false

      let buttons
      if (Array.isArray(this.bubbleMenu)) {
        buttons = this.bubbleMenu
      } else {
        buttons = [
          'Paragraph',
          'Heading 2',
          'Heading 3',
          'Separator',
          'Bold',
          'Italic',
          'Link',
          'Separator',
          'Bullet List',
          'Numbered List',
          'Separator',
          'Image',
          'Blockquote',
          'Code',
          [
            'InsertTable',
            'AddColumnBefore',
            'AddColumnAfter',
            'DeleteColumn',
            'AddRowBefore',
            'AddRowAfter',
            'DeleteRow',
            'MergeCells',
            'SplitCell',
            'ToggleHeaderColumn',
            'ToggleHeaderRow',
            'ToggleHeaderCell',
            'DeleteTable',
          ],
        ]
      }
      return buttons.map(createEditorButton)
    },
    floatingMenuButtons() {
      if (!this.floatingMenu) return false

      let buttons
      if (Array.isArray(this.floatingMenu)) {
        buttons = this.floatingMenu
      } else {
        buttons = [
          'Paragraph',
          'Heading 2',
          'Heading 3',
          'Bullet List',
          'Numbered List',
          'Blockquote',
          'Code',
          'Horizontal Rule',
        ]
      }
      return buttons.map(createEditorButton)
    },
    editorProps() {
      return {
        attributes: {
          class: normalizeClass([
            'prose prose-p:my-1 prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-gray-300 prose-th:border-gray-300 prose-td:relative prose-th:relative prose-th:bg-gray-100',
            this.editorClass,
          ]),
        },
      }
    },
  },
}

function createEditorButton(option) {
  if (option instanceof Array) {
    return option.map(createEditorButton)
  }
  if (typeof option == 'object') {
    return option
  }
  return commands[option]
}
</script>
<style>
/* Placeholder */
.ProseMirror:not(.ProseMirror-focused) p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: theme('colors.gray.500');
  pointer-events: none;
  height: 0;
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
</style>
