<template>
  <SuggestionList
    ref="suggestionList"
    :items="items"
    :command="selectItem"
    item-class="py-2"
  >
    <template #default="{ item }">
      <span class="mr-2">{{ item.emoji }}</span>
      <span>{{ item.name }}</span>
    </template>
  </SuggestionList>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import SuggestionList, { type SuggestionItem } from './SuggestionList.vue'

interface EmojiItem extends SuggestionItem {
  name: string
  emoji: string
}

const props = defineProps({
  items: {
    type: Array as PropType<EmojiItem[]>,
    required: true,
  },
  command: {
    type: Function as PropType<(params: { emoji: string }) => void>,
    required: true,
  },
})

const suggestionList = ref<InstanceType<typeof SuggestionList> | null>(null)

const selectItem = (item: SuggestionItem) => {
  if (item) {
    props.command({ emoji: item.emoji })
  }
}

const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  return suggestionList.value?.onKeyDown({ event }) ?? false
}

defineExpose({
  onKeyDown,
})
</script>
