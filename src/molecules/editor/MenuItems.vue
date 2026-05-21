<script setup lang="ts">
import type { CommandMenuItem, MenuItem } from './menu'
import type { Editor } from './useEditor'

const props = defineProps<{
  editor: Editor | null
  buttons: MenuItem[]
}>()

function isGroup(item: MenuItem): item is Extract<MenuItem, { type: 'group' }> {
  return 'type' in item && item.type === 'group'
}

function isSeparator(item: MenuItem): item is { type: 'separator' } {
  return 'type' in item && item.type === 'separator'
}

function run(item: CommandMenuItem) {
  if (props.editor && !item.isDisabled?.(props.editor)) {
    item.action(props.editor)
  }
}
</script>

<template>
  <template v-for="(item, index) in buttons" :key="`${'label' in item ? item.label : item.type}-${index}`">
    <span
      v-if="isSeparator(item)"
      data-slot="menu-separator"
      class="mx-1 h-5 w-px bg-gray-200"
      aria-hidden="true"
    />
    <div v-else-if="isGroup(item)" data-slot="menu-group" class="flex items-center gap-1">
      <span class="px-2 text-sm font-medium text-gray-700">{{ item.label }}</span>
      <button
        v-for="groupItem in item.items"
        :key="groupItem.label"
        type="button"
        class="rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-gray-100"
        :aria-label="groupItem.label"
        :aria-pressed="editor ? groupItem.isActive?.(editor) === true : false"
        :disabled="!editor || groupItem.isDisabled?.(editor) === true"
        @click="run(groupItem)"
      >
        <component :is="groupItem.icon" v-if="groupItem.icon" />
        <span v-else>{{ groupItem.label }}</span>
      </button>
    </div>
    <button
      v-else
      type="button"
      class="rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-gray-100"
      :aria-label="item.label"
      :aria-pressed="editor ? item.isActive?.(editor) === true : false"
      :disabled="!editor || item.isDisabled?.(editor) === true"
      @click="run(item)"
    >
      <component :is="item.icon" v-if="item.icon" />
      <span v-else>{{ item.label }}</span>
    </button>
  </template>
</template>
