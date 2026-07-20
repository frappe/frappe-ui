<template>
  <div>
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
        <template
          v-for="(group, groupIndex) in groupedItems"
          :key="group.label ?? groupIndex"
        >
          <!-- Same idiom as the Dropdown group label (`dropdownClasses.groupLabel`). -->
          <div
            v-if="group.label"
            class="flex h-7 items-center px-2 text-sm-medium text-ink-gray-4"
          >
            {{ group.label }}
          </div>
          <SuggestionListItem
            v-for="{ item, index } in group.entries"
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
      </template>
      <div v-else class="px-3 py-1.5 text-sm text-ink-gray-5">No results</div>
    </EditorPopover>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRef,
  computed,
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

/**
 * Display-only grouping: split the flat filtered list into consecutive runs of
 * `item.group`, keeping each item's ORIGINAL index so selection/keyboard state
 * (which is flat) maps 1:1 onto rendered items. `filterByQuery` preserves
 * source order, so a group's items stay adjacent and empty groups simply never
 * appear. Items without a `group` render headerless.
 */
const groupedItems = computed(() => {
  type Entry = { item: BaseSuggestionItem; index: number }
  const groups: Array<{ label?: string; entries: Entry[] }> = []
  props.items.forEach((item, index) => {
    const label = typeof item.group === 'string' ? item.group : undefined
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.entries.push({ item, index })
    else groups.push({ label, entries: [{ item, index }] })
  })
  return groups
})

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
