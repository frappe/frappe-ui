<template>
  <div
    v-if="editor"
    class="relative w-full"
    :class="attrsClass"
    :style="attrsStyle"
  >
    <TextEditorBubbleMenu :buttons="bubbleMenu" :options="bubbleMenuOptions" />
    <TextEditorFixedMenu
      class="w-full overflow-x-auto rounded-t-lg border border-outline-gray-modals"
      :buttons="fixedMenu"
    />
    <TextEditorFloatingMenu :buttons="floatingMenu" />
    <slot name="top" />
    <slot name="editor" :editor="editor">
      <EditorContent :editor="editor" />
    </slot>
    <slot name="bottom" />
  </div>
</template>

<script setup lang="ts">
import {
  normalizeClass,
  normalizeStyle,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  provide,
  ref,
  useAttrs,
} from 'vue'

defineOptions({ inheritAttrs: false })

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
import NamedColorExtension from './extensions/color'
import NamedHighlightExtension from './extensions/highlight'
import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockComponent from './CodeBlockComponent.vue'
import configureMention from './mention'
import TextEditorFixedMenu from './TextEditorFixedMenu.vue'
import TextEditorBubbleMenu from './TextEditorBubbleMenu.vue'
import TextEditorFloatingMenu from './TextEditorFloatingMenu.vue'
import EmojiExtension from './extensions/emoji/emoji-extension'
import SlashCommands from './extensions/slash-commands/slash-commands-extension'
import { MarkdownPasteExtension } from './extensions/markdown-paste-extension'
import { TagNode, TagExtension } from './extensions/tag/tag-extension'
import { Heading } from './extensions/heading/heading'
import { ImageGroup } from './extensions/image-group/image-group-extension'
import { useFileUpload } from '../../utils/useFileUpload'
import { TextEditorEmits, TextEditorProps } from './types'

const lowlight = createLowlight(common)

function defaultUploadFunction(file: File) {
  // useFileUpload is frappe specific
  let fileUpload = useFileUpload()
  return fileUpload.upload(file)
}

const props = withDefaults(defineProps<TextEditorProps>(), {
  content: null,
  placeholder: '',
  editorClass: '',
  editable: true,
  bubbleMenu: false,
  bubbleMenuOptions: () => ({}),
  fixedMenu: false,
  floatingMenu: false,
  extensions: () => [],
  starterkitOptions: () => ({}),
  mentions: () => [],
  tags: () => [],
})

const emit = defineEmits<TextEditorEmits>()

const editor = ref<Editor | null>(null)

const attrs = useAttrs()
const attrsClass = computed(() => normalizeClass(attrs.class))
const attrsStyle = computed(() => normalizeStyle(attrs.style))

const editorProps = computed(() => {
  return {
    attributes: {
      class: normalizeClass([
        'prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2',
        props.editorClass,
      ]),
    },
  }
})

watch(
  () => props.content,
  (val) => {
    if (editor.value) {
      let currentHTML = editor.value.getHTML()
      if (currentHTML !== val) {
        editor.value.commands.setContent(val)
      }
    }
  },
)

watch(
  () => props.editable,
  (value) => {
    if (editor.value) {
      editor.value.setEditable(value)
    }
  },
)

watch(
  editorProps,
  (value) => {
    if (editor.value) {
      editor.value.setOptions({
        editorProps: value,
      })
    }
  },
  { deep: true },
)

onMounted(() => {
  editor.value = new Editor({
    content: props.content || null,
    editorProps: editorProps.value,
    editable: props.editable,
    extensions: [
      StarterKit.configure({
        ...props.starterkitOptions,
        codeBlock: false,
        heading: false,
      }),
      Heading.configure({
        ...(typeof props.starterkitOptions?.heading === 'object' &&
        props.starterkitOptions.heading !== null
          ? props.starterkitOptions.heading
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
      NamedColorExtension,
      NamedHighlightExtension,
      CodeBlockLowlight.extend({
        addNodeView() {
          return VueNodeViewRenderer(CodeBlockComponent)
        },
      }).configure({ lowlight }),
      ImageExtension.configure({
        uploadFunction: props.uploadFunction || defaultUploadFunction,
      }),
      ImageGroup.configure({
        uploadFunction: props.uploadFunction || defaultUploadFunction,
      }),
      ImageViewerExtension,
      VideoExtension.configure({
        uploadFunction: props.uploadFunction || defaultUploadFunction,
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder:
          typeof props.placeholder === 'function'
            ? props.placeholder
            : () => props.placeholder as string,
      }),
      configureMention(props.mentions),
      EmojiExtension,
      SlashCommands,
      TagNode,
      TagExtension.configure({
        tags: () => props.tags,
      }),
      MarkdownPasteExtension.configure({
        enabled: true,
        showConfirmation: true,
        uploadFunction: props.uploadFunction || defaultUploadFunction,
      }),
      ...(props.extensions || []),
    ],
    onUpdate: ({ editor }) => {
      emit('change', editor.getHTML())
    },
    onFocus: ({ editor, event }) => {
      emit('focus', event)
    },
    onBlur: ({ editor, event }) => {
      emit('blur', event)
    },
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
    editor.value = null
  }
})

provide(
  'editor',
  computed(() => editor.value),
)

defineExpose({
  editor,
})
</script>

<style>
@import './extensions/color/color-styles.css';
@import './extensions/highlight/highlight-styles.css';

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
</style>
