<template>
  <EditorPopover
    v-if="items.length || showNoResults"
    dialog-label="Suggestions"
    :autofocus="false"
    :trapped="false"
    :loop="false"
    :content-class="[
      'relative max-h-[300px] min-w-40 overflow-y-auto rounded-lg p-1 text-base',
      containerClass,
    ]"
  >
    <template v-if="items.length">
      <SuggestionListItem
        v-for="(item, index) in items"
        :key="index"
        :ref="(el) => setItemRef(el, index)"
        :item="item"
        :selected="index === selectedIndex"
        :item-class="itemClass"
        @select="selectItem(index)"
        @hover="selectedIndex = index"
      >
        <template #default="{ item: slotItem }">
          <slot :item="slotItem" :index="index">
            <span>{{
              slotItem.display || slotItem.title || slotItem.name
            }}</span>
          </slot>
        </template>
      </SuggestionListItem>
    </template>
    <div v-else class="px-3 py-1.5 text-sm text-ink-gray-5">No results</div>
  </EditorPopover>
</template>

<script setup lang="ts">
import {
  ref,
  toRef,
  nextTick,
  onBeforeUpdate,
  type PropType,
  type ComponentPublicInstance,
} from 'vue'
import type { BaseSuggestionItem } from '#molecules/editor/extensions/shared/suggestion-types'
import { useSuggestionList } from '#molecules/editor/composables/useSuggestionList'
import SuggestionListItem from './SuggestionListItem.vue'
import EditorPopover from '#molecules/editor/components/EditorPopover.vue'

const props = defineProps({
  items: {
    type: Array as PropType<BaseSuggestionItem[]>,
    required: true,
  },
  command: {
    type: Function as PropType<(item: BaseSuggestionItem) => void>,
    required: true,
  },
  containerClass: {
    type: String,
    default: '',
  },
  itemClass: {
    type: String,
    default: '',
  },
  showNoResults: {
    type: Boolean,
    default: false,
  },
})

const itemRefs = ref<HTMLElement[]>([])

const { selectedIndex, onKeyDown } = useSuggestionList<BaseSuggestionItem>(
  toRef(props, 'items'),
  (item) => props.command(item),
)

onBeforeUpdate(() => {
  itemRefs.value = []
})

function setItemRef(
  el: Element | ComponentPublicInstance | null,
  index: number,
): void {
  const node =
    (el as ComponentPublicInstance | null)?.$el ?? (el as Element | null)
  if (node instanceof HTMLElement) itemRefs.value[index] = node
}

function selectItem(index: number): void {
  const item = props.items[index]
  if (item) props.command(item)
}

function scrollIntoView(): void {
  nextTick(() => {
    itemRefs.value[selectedIndex.value]?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeyDownWithScroll(payload: { event: KeyboardEvent }): boolean {
  const handled = onKeyDown(payload)
  if (handled && payload.event.key !== 'Enter') scrollIntoView()
  return handled
}

defineExpose({
  onKeyDown: onKeyDownWithScroll,
})
</script>
