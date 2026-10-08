<template>
  <div>
    <EditorPopover
      v-if="items.length || showNoResults"
      dialog-label="Suggestions"
      variant="menu"
      :autofocus="false"
      :trapped="false"
      :loop="false"
      :content-class="[
        'relative max-h-[300px] min-w-40 divide-y divide-outline-elevation-2 overflow-y-auto rounded-6 text-base',
        containerClass,
      ]"
    >
      <!-- Laid out as the Dropdown's menu is (`menuClasses`): each group in
           its own 6px-padded block, a hairline between groups, the label in
           the group label's idiom — and marked with the same data-slots
           (group, item, item-prefix) the Dropdown's markup carries. -->
      <template v-if="items.length">
        <div
          v-for="(group, groupIndex) in groupedItems"
          :key="group.label ?? groupIndex"
          data-slot="group"
          :class="menuClasses.group"
        >
          <div v-if="group.label" :class="menuClasses.groupLabel">
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
                  slotItem.display ||
                  slotItem.label ||
                  slotItem.title ||
                  slotItem.name
                }}</span>
              </slot>
            </template>
          </SuggestionListItem>
        </div>
      </template>
      <div v-else :class="menuClasses.group">
        <div class="px-2 py-1.5 text-base text-ink-gray-5">No results</div>
      </div>
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
import { menuClasses } from '#components/Menu/utils'

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
