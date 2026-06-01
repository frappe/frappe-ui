<template>
  <SuggestionList
    ref="suggestionList"
    :items="props.items"
    :command="(item) => onItemSelect(item as CommandItem)"
    container-class="min-w-48"
    item-class="h-7"
    :show-no-results="true"
  >
    <template #default="{ item }">
      <span v-if="item.icon" :class="[item.icon, 'mr-2 h-4 w-4']" />
      <div v-else class="mr-2 h-4 w-4"></div>
      <span>{{ item.title }}</span>
    </template>
  </SuggestionList>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import SuggestionList from '../suggestion/SuggestionList.vue'
import type { Editor, Range } from '@tiptap/core'
import type { SuggestionListExpose } from '@molecules/editor/extensions/shared/suggestion-types'
import { forwardKeyDown } from '@molecules/editor/composables/useSuggestionList'
import type { CommandItem } from './slash-commands-extension'

const props = defineProps({
  items: {
    type: Array as PropType<CommandItem[]>,
    required: true,
  },
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  range: {
    type: Object as PropType<Range>,
    required: true,
  },
  command: {
    type: Function as PropType<(item: CommandItem) => void>,
    required: true,
  },
  query: String,
})

const suggestionList = ref<SuggestionListExpose | null>(null)

const onItemSelect = (item: CommandItem) => {
  if (item) props.command(item)
}

defineExpose({
  onKeyDown: forwardKeyDown(suggestionList),
})
</script>
