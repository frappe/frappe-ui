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
    <TableBorderMenuContainer />
    <slot name="top" :editor />
    <slot name="editor" :editor="editor">
      <EditorContent :editor="editor" class="prose prose-sm" />
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
import Typography from '@tiptap/extension-typography'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { ImageExtension } from './extensions/image'
import ImageViewerExtension from './image-viewer-extension'
import { VideoExtension } from './video-extension'
import { IframeExtension } from './extensions/iframe'
import LinkExtension from './link-extension'
import { TextStyle } from '@tiptap/extension-text-style'
import NamedColorExtension from './extensions/color'
import NamedHighlightExtension from './extensions/highlight'
import StyleClipboardExtension from './extensions/copy-styles'
import improvedList from './extensions/list-extension'
import TableExtension from './extensions/tables/table-extension'
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
import TableCellExtension from './extensions/tables/table-cell-extension'
import TableHeaderExtension from './extensions/tables/table-header-extension'
import TableRowExtension from './extensions/tables/table-row-extension'
import TableBorderMenuContainer from './extensions/tables/TableBorderMenuContainer.vue'
import { TableCommandsExtension } from './extensions/tables/table-selection-extension'

function defaultUploadFunction(file: File) {
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
        'prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:relative prose-th:relative prose-th:bg-surface-gray-2',
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
        table: false,
        link: false, // Disable link in StarterKit since we use LinkExtension separately
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

      TableExtension.configure({
        resizable: false,
      }),
      TableCellExtension,
      TableHeaderExtension,
      TableRowExtension,
	    TableCommandsExtension,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
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
      StyleClipboardExtension,
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
@import './style.css';
</style>
