<template>
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
</template>
<script>
import { FloatingMenu } from '@tiptap/vue-3'
import { createEditorButton } from './utils'

export default {
  name: 'TextEditorFloatingMenu',
  props: ['buttons'],
  components: { FloatingMenu },
  inject: ['editor'],
  computed: {
    floatingMenuButtons() {
      if (!this.buttons) return false

      let buttons
      if (Array.isArray(this.buttons)) {
        buttons = this.buttons
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
  },
}
</script>
