<script setup lang="ts">
import { defineComponent } from 'vue'
import {
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxViewport,
} from 'reka-ui'
import ItemListRow from '../ItemListRow/ItemListRow.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import { isEmojiIconString, isLucideIconString } from '../../utils/iconString'
import type { MultiSelectItemSlotProps, MultiSelectSize } from './types'
import {
  EMPTY_VALUE_PREFIX,
  itemClasses,
  itemRootSizeClasses,
  toItemListSize,
} from './utils'
import type { NormalizedGroup, NormalizedOption } from './utils'

type SlotFns = Record<string, ((props?: any) => any) | undefined>

const props = defineProps<{
  groups: NormalizedGroup[]
  size: MultiSelectSize
  query: string
  selectedValues: string[]
  loading: boolean
  hideSearch: boolean
  emptyText: string
  showEmpty: boolean
  /** Parent's `useSlots()` result — forwarded so nested templates can dispatch. */
  slotFns: SlotFns
  /** All selectable options across groups; drives value ↔ internal-id mapping. */
  allOptions: NormalizedOption[]
}>()

// Defined once at setup so Vue sees a stable component reference across
// renders; passing the slot-fn inline would remount the wrapper every tick.
const ItemSlotRender = defineComponent({
  name: 'MultiSelectItemSlotRender',
  props: {
    render: { type: Function, required: true },
    slotProps: { type: Object, required: true },
  },
  setup(innerProps) {
    return () =>
      (innerProps.render as (p: any) => any)(innerProps.slotProps)
  },
})

function isItemSelected(item: NormalizedOption) {
  return props.selectedValues.includes(item.value)
}

function getItemSlotProps(item: NormalizedOption): MultiSelectItemSlotProps {
  return {
    item,
    query: props.query,
    selected: isItemSelected(item),
  }
}

function getDynamicItemSlotName(item: NormalizedOption) {
  return item.slot ? `item-${item.slot}` : undefined
}

function shouldUseDynamicItemSlot(item: NormalizedOption) {
  const slotName = getDynamicItemSlotName(item)
  return Boolean(slotName && props.slotFns[slotName])
}

function getGroupKey(group: NormalizedGroup, index: number) {
  return group.key ?? `${group.group || 'group'}-${index}`
}

function getInternalValue(item: NormalizedOption) {
  if (item.value !== '') return item.value
  return `${EMPTY_VALUE_PREFIX}${props.allOptions.indexOf(item)}`
}

function getItemTextValue(item: NormalizedOption) {
  return `${item.label} ${item.value}`.trim()
}

</script>

<template>
  <ComboboxViewport class="flex max-h-60 flex-col overflow-auto p-1">
    <div
      v-if="loading && hideSearch"
      data-slot="loading"
      class="flex items-center gap-2 px-2 py-1.5 text-base text-ink-gray-5"
    >
      <LoadingIndicator class="size-4" />
      <span>Loading...</span>
    </div>

    <template v-else>
      <div
        v-if="showEmpty"
        data-slot="empty"
        class="px-2 py-1.5 text-base text-ink-gray-5"
      >
        <component
          :is="ItemSlotRender"
          v-if="slotFns.empty"
          :render="slotFns.empty"
          :slot-props="{ query }"
        />
        <template v-else>{{ emptyText }}</template>
      </div>

      <template v-else>
        <template
          v-for="(group, groupIndex) in groups"
          :key="getGroupKey(group, groupIndex)"
        >
          <ComboboxGroup data-slot="group" class="flex flex-col">
            <ComboboxLabel
              v-if="group.group && !group.hideLabel"
              data-slot="group-label"
              class="flex h-7 items-center px-2 text-sm font-medium text-ink-gray-4"
            >
              <component
                :is="ItemSlotRender"
                v-if="slotFns['group-label']"
                :render="slotFns['group-label']"
                :slot-props="{ group }"
              />
              <template v-else>{{ group.group }}</template>
            </ComboboxLabel>

            <ComboboxItem
              v-for="item in group.options"
              :key="item.value"
              :value="getInternalValue(item)"
              :disabled="item.disabled"
              :text-value="getItemTextValue(item)"
              data-slot="item"
              :data-size="size"
              :data-state="isItemSelected(item) ? 'checked' : 'unchecked'"
              :class="[itemClasses, itemRootSizeClasses(size)]"
            >
              <!--
                Full-row takeover precedence:
                  1. item.slot matches a `#item-<slot>` template slot →
                     default row shell with the named slot filling the
                     label region (handled below). Per-item slot dispatch
                     is intentionally more specific than the generic
                     `#item` fallback.
                  2. global `#item` template slot
                  3. item.slots.item (or legacy function-form item.render)
                  4. default row shell
              -->
              <component
                :is="ItemSlotRender"
                v-if="slotFns.item && !shouldUseDynamicItemSlot(item)"
                :render="slotFns.item"
                :slot-props="getItemSlotProps(item)"
              />

              <component
                :is="ItemSlotRender"
                v-else-if="item.resolvedSlots.item"
                :render="item.resolvedSlots.item"
                :slot-props="getItemSlotProps(item)"
              />

              <ItemListRow
                v-else
                :size="toItemListSize(size)"
                :selected="isItemSelected(item)"
                :disabled="item.disabled"
              >
                <template #prefix>
                  <component
                    :is="ItemSlotRender"
                    v-if="slotFns['item-prefix']"
                    :render="slotFns['item-prefix']"
                    :slot-props="getItemSlotProps(item)"
                  />
                  <component
                    :is="ItemSlotRender"
                    v-else-if="item.resolvedSlots.prefix"
                    :render="item.resolvedSlots.prefix"
                    :slot-props="getItemSlotProps(item)"
                  />
                  <span
                    v-else-if="isLucideIconString(item.icon)"
                    :class="[item.icon, 'size-4 shrink-0 text-ink-gray-6']"
                    aria-hidden="true"
                  />
                  <span
                    v-else-if="isEmojiIconString(item.icon)"
                    class="inline-flex size-4 shrink-0 items-center justify-center text-base leading-none"
                    aria-hidden="true"
                    >{{ item.icon }}</span
                  >
                  <component
                    v-else-if="item.icon && typeof item.icon !== 'string'"
                    :is="item.icon"
                    class="size-4 shrink-0 text-ink-gray-6"
                  />
                </template>

                <template #label>
                  <component
                    :is="ItemSlotRender"
                    v-if="shouldUseDynamicItemSlot(item)"
                    :render="slotFns[getDynamicItemSlotName(item)!]!"
                    :slot-props="getItemSlotProps(item)"
                  />

                  <component
                    :is="ItemSlotRender"
                    v-else-if="slotFns['item-label']"
                    :render="slotFns['item-label']"
                    :slot-props="getItemSlotProps(item)"
                  />

                  <component
                    :is="ItemSlotRender"
                    v-else-if="slotFns['option']"
                    :render="slotFns['option']"
                    :slot-props="{ item }"
                  />

                  <component
                    :is="ItemSlotRender"
                    v-else-if="item.resolvedSlots.label"
                    :render="item.resolvedSlots.label"
                    :slot-props="getItemSlotProps(item)"
                  />

                  <div v-else class="min-w-0">
                    <div class="truncate">{{ item.label }}</div>
                    <div
                      v-if="item.description"
                      class="truncate text-p-sm text-ink-gray-5"
                    >
                      {{ item.description }}
                    </div>
                  </div>
                </template>

                <template #suffix>
                  <component
                    :is="ItemSlotRender"
                    v-if="slotFns['item-suffix']"
                    :render="slotFns['item-suffix']"
                    :slot-props="getItemSlotProps(item)"
                  />
                  <component
                    :is="ItemSlotRender"
                    v-else-if="item.resolvedSlots.suffix"
                    :render="item.resolvedSlots.suffix"
                    :slot-props="getItemSlotProps(item)"
                  />

                  <ComboboxItemIndicator
                    class="ml-1 inline-flex items-center justify-center"
                  >
                    <span class="lucide-check size-4" />
                  </ComboboxItemIndicator>
                </template>
              </ItemListRow>
            </ComboboxItem>
          </ComboboxGroup>
        </template>
      </template>
    </template>
  </ComboboxViewport>
</template>

<style scoped>
/*
 * The outer item row paints its own bg via data-[highlighted] /
 * data-[state=checked] utilities — including the combined hover+selected
 * state. Clear ItemListRow's own bg so the outer color always shows
 * through; text emphasis on selected stays.
 */
[data-slot='item'] [data-slot='item-list-row'] {
  background-color: transparent;
}
</style>
