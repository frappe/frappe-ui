<template>
  <div
    v-if="editor"
    class="relative w-full"
    :class="attrsClass"
    :style="attrsStyle"
    v-bind="attrsWithoutClassStyle"
    ref="rootRef"
  >
    <TextEditorBubbleMenu :buttons="bubbleMenu" :options="bubbleMenuOptions" />
    <TextEditorFixedMenu
      class="w-full overflow-x-auto rounded-t-lg border border-outline-gray-modals"
      :buttons="fixedMenu"
    />
    <TextEditorFloatingMenu :buttons="floatingMenu" />
    <slot name="top" :editor />
    <slot name="editor" :editor="editor">
      <EditorContent :editor="editor" />
    </slot>
    <slot name="bottom" :editor />
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
  useTemplateRef,
} from 'vue'

defineOptions({ inheritAttrs: false })

import { Editor, EditorContent } from '@tiptap/vue-3'
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
import { IframeExtension } from './extensions/iframe'
import LinkExtension from './link-extension'
import Typography from '@tiptap/extension-typography'
import TextStyle from '@tiptap/extension-text-style'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import NamedColorExtension from './extensions/color'
import NamedHighlightExtension from './extensions/highlight'
import improvedList from './extensions/list-extension'

import { MentionExtension } from './extensions/mention'
import TextEditorFixedMenu from './TextEditorFixedMenu.vue'
import TextEditorBubbleMenu from './TextEditorBubbleMenu.vue'
import TextEditorFloatingMenu from './TextEditorFloatingMenu.vue'
import EmojiExtension from './extensions/emoji/emoji-extension'
import SlashCommands from './extensions/slash-commands/slash-commands-extension'
import { ContentPasteExtension } from './extensions/content-paste-extension'
import { TagNode, TagExtension } from './extensions/tag/tag-extension'
import { Heading } from './extensions/heading/heading'
import { ImageGroup } from './extensions/image-group/image-group-extension'
import { ExtendedCode, ExtendedCodeBlock } from './extensions/code-block'
import { useFileUpload } from '../../utils/useFileUpload'
import { TextEditorEmits, TextEditorProps } from './types'

function defaultUploadFunction(file: File) {
  // useFileUpload is frappe specific
  let fileUpload = useFileUpload()
  return fileUpload.upload(file, props.uploadArgs || {})
}

const props = withDefaults(defineProps<TextEditorProps>(), {
  content: null,
  placeholder: '',
  editorClass: '',
  editable: true,
  autofocus: false,
  bubbleMenu: false,
  bubbleMenuOptions: () => ({}),
  fixedMenu: false,
  floatingMenu: false,
  extensions: () => [],
  starterkitOptions: () => ({}),
  mentions: null,
  tags: () => [],
})

const emit = defineEmits<TextEditorEmits>()

const editor = ref<Editor | null>(null)

const attrs = useAttrs()
const attrsClass = computed(() => normalizeClass(attrs.class))
const attrsStyle = computed(() => normalizeStyle(attrs.style))
const attrsWithoutClassStyle = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
})

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
    autofocus: props.autofocus,
    extensions: [
      StarterKit.configure({
        ...props.starterkitOptions,
        code: false,
        codeBlock: false,
        heading: false,
      }).extend({
        addKeyboardShortcuts() {
          return {
            Backspace: () => improvedList(this.editor),
          }
        },
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
      TaskList,
      TaskItem.configure({
        nested: true,
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
      ExtendedCode,
      ExtendedCodeBlock,
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
      IframeExtension,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder:
          typeof props.placeholder === 'function'
            ? props.placeholder
            : () => props.placeholder as string,
      }),
      props.mentions &&
        MentionExtension.configure(
          Array.isArray(props.mentions)
            ? { mentions: props.mentions }
            : {
                mentions: props.mentions.mentions,
                component: props.mentions.component,
              },
        ),
      EmojiExtension,
      SlashCommands,
      TagNode,
      TagExtension.configure({
        tags: () => props.tags,
      }),
      ContentPasteExtension.configure({
        enabled: true,
        uploadFunction: props.uploadFunction || defaultUploadFunction,
      }),
      ...(props.extensions || []),
    ],
    onUpdate: ({ editor }) => {
      emit('change', editor.getHTML())
    },
    onTransaction: ({ editor }) => {
      emit('transaction', editor)
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

const rootRef = useTemplateRef('rootRef')
defineExpose({
  editor,
  rootRef,
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

.ProseMirror ul[data-type='taskList'] {
  list-style: none;
  padding: 0;

  li {
    align-items: flex-start;
    display: flex;
    margin: 0;

    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      margin-top: 0.25rem;
      height: 1lh;
      display: flex;
      align-items: center;
      user-select: none;
    }

    > div {
      flex: 1 1 auto;
      margin-bottom: 0;

      > p {
        margin: 0.25rem 0;
      }
    }
  }
  ul[data-type='taskList'] {
    margin: 0;
  }

  input[type='checkbox'] {
    cursor: pointer;
    width: 14px;
    height: 14px;
    border-radius: 4px;
    color: theme('colors.gray.900');
  }
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
