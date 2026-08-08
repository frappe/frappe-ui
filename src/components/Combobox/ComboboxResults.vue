<script setup lang="ts">
import {
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxViewport,
} from 'reka-ui'
import ItemListRow from '../ItemListRow/ItemListRow.vue'
import { LoadingIndicator } from '../LoadingIndicator'
import OptionIcon from '../shared/selection/OptionIcon.vue'
import { createItemSlotRender } from '../shared/selection/createItemSlotRender'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import type {
  ComboboxItemSlotProps,
  ComboboxOptionValue,
  ComboboxSize,
} from './types'
import {
  EMPTY_SELECTABLE_VALUE_PREFIX,
  isCustomOption,
  isSelectableOption,
  itemClasses,
  itemRootSizeClasses,
  toItemListSize,
} from './utils'
import type {
  NormalizedCustomOption,
  NormalizedGroup,
  NormalizedItem,
  NormalizedSelectableOption,
} from './utils'

type SlotFns = Record<string, ((props?: any) => any) | undefined>

const props = withDefaults(
  defineProps<{
    groups: NormalizedGroup[]
    size: ComboboxSize
    query: string
    model: ComboboxOptionValue | null
    loading: boolean
    emptyText: string
    showEmpty: boolean
    /** Parent's `useSlots()` result — forwarded so nested templates can dispatch. */
    slotFns: SlotFns
    /** All selectable items across groups; drives value ↔ internal-id mapping. */
    allSelectableOptions: NormalizedSelectableOption[]
  }>(),
  {},
)

const emit = defineEmits<{
  selectCustom: [item: NormalizedCustomOption, event: Event]
}>()

const ItemSlotRender = createItemSlotRender('ComboboxItemSlotRender')

function isItemSelected(item: NormalizedItem) {
  return isSelectableOption(item) && item.value === props.model
}

function getItemSlotProps(item: NormalizedItem): ComboboxItemSlotProps {
  return {
    item,
    query: props.query,
    selected: isItemSelected(item),
  }
}

function getDynamicItemSlotName(item: NormalizedItem) {
  return item.slot ? `item-${item.slot}` : undefined
}

function shouldUseDynamicItemSlot(item: NormalizedItem) {
  const slotName = getDynamicItemSlotName(item)
  return Boolean(slotName && props.slotFns[slotName])
}

function getGroupKey(group: NormalizedGroup, index: number) {
  return group.key ?? `${group.group || 'group'}-${index}`
}

function getItemKey(item: NormalizedItem) {
  return isSelectableOption(item) ? item.value : item.key
}

const { toInternal: getSelectableInternalValue } = useEmptyValueMapping(
  () => props.allSelectableOptions,
  EMPTY_SELECTABLE_VALUE_PREFIX,
)

function getComboboxItemValue(item: NormalizedItem) {
  return isSelectableOption(item) ? getSelectableInternalValue(item) : item.key
}

function getItemTextValue(item: NormalizedItem) {
  return isSelectableOption(item)
    ? `${item.label} ${item.value}`.trim()
    : item.label
}

function handleSelect(item: NormalizedItem, event: Event) {
  if (isCustomOption(item)) emit('selectCustom', item, event)
}
</script>

<template>
  <ComboboxViewport class="flex max-h-60 flex-col overflow-auto p-1">
    <div
      v-if="loading"
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
              class="flex h-7 items-center px-2 text-sm-medium text-ink-gray-4"
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
              :key="getItemKey(item)"
              :value="getComboboxItemValue(item)"
              :disabled="item.disabled"
              :text-value="getItemTextValue(item)"
              data-slot="item"
              :data-size="size"
              :data-state="
                isSelectableOption(item)
                  ? isItemSelected(item)
                    ? 'checked'
                    : 'unchecked'
                  : undefined
              "
              :class="[itemClasses, itemRootSizeClasses(size)]"
              @select="handleSelect(item, $event)"
            >
              <!--
                Full-row takeover precedence:
                  1. item.slot matches a `#item-<slot>` template slot →
                     default row shell with the named slot filling the
                     label region (handled below). Per-item slot dispatch
                     is intentionally more specific than the generic
                     `#item` fallback.
                  2. global `#item` template slot
                  3. item.slots.item
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
                  <!--
                    Auto-render `item.icon`: `lucide-*` strings go through
                    the Tailwind plugin; emoji/symbol strings render as
                    text; component values render directly. Consumer slots
                    above still win.
                  -->
                  <OptionIcon v-else-if="item.icon" :icon="item.icon" />
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
                    v-if="isSelectableOption(item)"
                    class="ml-1 inline-flex items-center justify-center"
                  >
                    <span class="lucide-check size-4 text-ink-gray-6" />
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
