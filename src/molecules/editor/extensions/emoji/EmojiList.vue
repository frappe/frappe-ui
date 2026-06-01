<template>
  <SuggestionList
    ref="suggestionList"
    :items="items"
    :command="(item) => onItemSelect(item as EmojiItem)"
    item-class="py-2"
    :show-no-results="true"
  >
    <template #default="{ item }">
      <span class="mr-2">{{ item.emoji }}</span>
      <span>{{ item.name }}</span>
    </template>
  </SuggestionList>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import SuggestionList from '../suggestion/SuggestionList.vue'
import type { Editor, Range } from '@tiptap/core'
import type { SuggestionListExpose } from '@molecules/editor/extensions/shared/suggestion-types'
import { forwardKeyDown } from '@molecules/editor/composables/useSuggestionList'
import type { EmojiItem } from './emoji-extension'

const props = defineProps({
  items: {
    type: Array as PropType<EmojiItem[]>,
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
    type: Function as PropType<(item: EmojiItem) => void>,
    required: true,
  },
})

const suggestionList = ref<SuggestionListExpose | null>(null)

const onItemSelect = (item: EmojiItem) => {
  if (item) props.command(item)
}

defineExpose({
  onKeyDown: forwardKeyDown(suggestionList),
})
</script>
