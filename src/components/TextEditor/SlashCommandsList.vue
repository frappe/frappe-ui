<template>
  <SuggestionList
    ref="suggestionList"
    :items="items"
    :command="command"
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
import { ref, type PropType, type Component } from 'vue'
import SuggestionList, { type SuggestionItem } from './SuggestionList.vue'

interface CommandItem extends SuggestionItem {
  title: string
  icon?: Component
}

const props = defineProps({
  items: {
    type: Array as PropType<CommandItem[]>,
    required: true,
  },
  command: {
    type: Function as PropType<(item: SuggestionItem) => void>,
    required: true,
  },
})

const suggestionList = ref<InstanceType<typeof SuggestionList> | null>(null)

const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  return suggestionList.value?.onKeyDown({ event }) ?? false
}

defineExpose({
  onKeyDown,
})
</script>
