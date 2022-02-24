<template>
  <div class="inline-flex px-1 py-1 bg-white">
    <div class="inline-flex items-center gap-1">
      <template v-for="button in menuButtons" :key="button.label">
        <div
          class="border-l w-[2px] h-4"
          v-if="button.type === 'separator'"
        ></div>
        <button
          v-else
          class="flex p-1 text-gray-800 transition-colors rounded"
          :class="button.isActive() ? 'bg-gray-100' : 'hover:bg-gray-100'"
          @click="button.action"
          :title="button.label"
        >
          <FeatherIcon v-if="button.icon" :name="button.icon" class="w-4" />
          <span class="inline-block h-4 text-sm leading-4 min-w-[1rem]" v-else>
            {{ button.text }}
          </span>
        </button>
      </template>
    </div>
  </div>
</template>
<script>
import { FeatherIcon } from 'frappe-ui'
export default {
  name: 'TipTapMenu',
  props: ['editor'],
  components: { FeatherIcon },
  computed: {
    menuButtons() {
      return [
        {
          label: 'Paragraph',
          icon: 'type',
          action: () => this.editor.chain().focus().setParagraph().run(),
          isActive: () => this.editor.isActive('paragraph'),
        },
        {
          label: 'Heading 2',
          text: 'H2',
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 2 }),
        },
        {
          label: 'Heading 3',
          text: 'H3',
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 3 }),
        },
        {
          type: 'separator',
        },
        {
          label: 'Bold',
          icon: 'bold',
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive('bold'),
        },
        {
          label: 'Italic',
          icon: 'italic',
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive('italic'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Bullet List',
          icon: 'list',
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive('bulletList'),
        },
        {
          label: 'Numbered List',
          text: '1.',
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
          isActive: () => this.editor.isActive('orderedList'),
        },
        {
          label: 'Blockquote',
          icon: 'chevron-right',
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive('blockquote'),
        },
        {
          label: 'Code',
          icon: 'code',
          action: () => this.editor.chain().focus().toggleCodeBlock().run(),
          isActive: () => this.editor.isActive('codeBlock'),
        },
        {
          label: 'Horizontal Rule',
          icon: 'minus',
          action: () => this.editor.chain().focus().setHorizontalRule().run(),
          isActive: () => false,
        },
        {
          type: 'separator',
        },
        {
          label: 'Undo',
          icon: 'corner-up-left',
          action: () => this.editor.chain().focus().undo().run(),
          isActive: () => false,
        },
        {
          label: 'Redo',
          icon: 'corner-up-right',
          action: () => this.editor.chain().focus().redo().run(),
          isActive: () => false,
        },
      ]
    },
  },
}
</script>
