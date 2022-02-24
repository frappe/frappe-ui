<template>
  <div class="relative w-full pt-6" v-if="editor">
    <BubbleMenu
      v-if="showBubbleMenu"
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <Menu
        :editor="editor"
        class="border border-gray-100 rounded-md shadow-sm"
      />
    </BubbleMenu>

    <Menu
      v-if="showMenu"
      class="absolute top-0 left-0 right-0 border rounded-t-lg border-gray-50 border-b-gray-100"
      :editor="editor"
    />
    <editor-content
      :editor="editor"
      :class="$attrs.class || 'prose-sm prose'"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Menu from './Menu.vue'

export default {
  name: 'TextEditor',
  inheritAttrs: false,
  components: {
    EditorContent,
    BubbleMenu,
    Menu,
  },
  props: [
    'content',
    'placeholder',
    'editorClass',
    'showMenu',
    'showBubbleMenu',
  ],
  emits: ['change'],
  expose: ['editor'],
  data() {
    return {
      editor: null,
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.content || '<p></p>',
      editorProps: {
        attributes: {
          class: ['prose-p:my-1', this.editorClass].join(' '),
        },
      },
      extensions: [
        StarterKit,
        Image,
        Placeholder.configure({
          placeholder: this.placeholder || 'Write something...',
        }),
      ],
      onUpdate: ({ editor }) => {
        this.$emit('change', editor.getHTML())
      },
    })
  },
  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>
<style>
.ProseMirror:not(.ProseMirror-focused) p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: theme('colors.gray.500');
  pointer-events: none;
  height: 0;
}
</style>
