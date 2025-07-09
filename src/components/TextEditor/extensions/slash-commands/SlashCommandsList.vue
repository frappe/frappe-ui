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
      <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4" />
      <div v-else class="mr-2 h-4 w-4"></div>
      <span>{{ item.title }}</span>
    </template>
  </SuggestionList>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import SuggestionList from '../suggestion/SuggestionList.vue'
import type { Editor, Range } from '@tiptap/core'
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

const suggestionList = ref<InstanceType<typeof SuggestionList> | null>(null)

const onItemSelect = (item: CommandItem) => {
  if (item) {
    props.command(item)
  }
}

const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  return suggestionList.value?.onKeyDown({ event }) ?? false
}

defineExpose({
  onKeyDown,
})
</script>
