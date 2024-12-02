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
      class="flex rounded p-1 text-ink-gray-8 transition-colors"
      :class="
        button.isActive(editor)
          ? 'bg-surface-gray-2'
          : 'hover:bg-surface-gray-2'
      "
      @click="() => button.action(editor)"
      :title="button.label"
    >
      <component v-if="button.icon" :is="button.icon" class="h-4 w-4" />
      <span class="inline-block h-4 min-w-[1rem] text-sm leading-4" v-else>
        {{ __(button.text) }}
      </span>
    </button>
  </FloatingMenu>
</template>
<script setup>
import { __ } from '../../utils/translation'
import { FloatingMenu } from '@tiptap/vue-3'
import { createEditorButton } from './utils'
import { computed, inject } from 'vue'

const props = defineProps({
  buttons: {
    type: Array,
    default: null,
  },
})

const editor = inject('editor')

const floatingMenuButtons = computed(() => {
  if (!props.buttons) return false

  let buttons
  if (Array.isArray(props.buttons)) {
    buttons = props.buttons
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
})
</script>
