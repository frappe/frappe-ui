<script setup lang="ts">
import { defineComponent } from 'vue'
import {
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxViewport,
} from 'reka-ui'
import LucideCheck from '~icons/lucide/check'
import ItemListRow from '../ItemList/ItemListRow.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import type {
  ComboboxItemSlotProps,
  ComboboxSize,
} from './types'
import {
  CREATE_OPTION_VALUE,
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
    model: string | null
    loading: boolean
    emptyText: string
    showCreateOption: boolean
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
  selectCreate: [event: Event]
}>()

// Defined once at setup so Vue sees a stable component reference across
// renders; passing the slot-fn inline would remount the wrapper every tick.
const ItemSlotRender = defineComponent({
  name: 'ComboboxItemSlotRender',
  props: {
    render: { type: Function, required: true },
    slotProps: { type: Object, required: true },
  },
  setup(innerProps) {
    return () =>
      (innerProps.render as (p: ComboboxItemSlotProps) => any)(
        innerProps.slotProps as ComboboxItemSlotProps,
      )
  },
})

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

function getLegacySlotProps(item: NormalizedItem) {
  return {
    ...getItemSlotProps(item),
    option: item,
    searchTerm: props.query,
  }
}

function getDynamicItemSlotName(item: NormalizedItem) {
  return item.slot ? `item-${item.slot}` : undefined
}

function getLegacyDirectSlotName(item: NormalizedItem) {
  return item.slotName
}

function shouldUseDynamicItemSlot(item: NormalizedItem) {
  const slotName = getDynamicItemSlotName(item)
  return Boolean(slotName && props.slotFns[slotName])
}

function shouldUseLegacyDirectSlot(item: NormalizedItem) {
  const slotName = getLegacyDirectSlotName(item)
  return Boolean(
    slotName && !shouldUseDynamicItemSlot(item) && props.slotFns[slotName],
  )
}

function getGroupKey(group: NormalizedGroup, index: number) {
  return group.key ?? `${group.group || 'group'}-${index}`
}

function getItemKey(item: NormalizedItem) {
  return isSelectableOption(item) ? item.value : item.key
}

function getSelectableInternalValue(item: NormalizedSelectableOption) {
  if (item.value !== '') return item.value

  return `${EMPTY_SELECTABLE_VALUE_PREFIX}${props.allSelectableOptions.indexOf(item)}`
}

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
      <ComboboxItem
        v-if="showCreateOption"
        :value="CREATE_OPTION_VALUE"
        data-slot="item"
        data-create="true"
        :data-size="size"
        :class="[itemClasses, itemRootSizeClasses(size)]"
        text-value="Create value"
        @select="emit('selectCreate', $event)"
      >
        <ItemListRow :size="toItemListSize(size)">
          <template #label>
            <div class="min-w-0 truncate">Create &quot;{{ query }}&quot;</div>
          </template>
        </ItemListRow>
      </ComboboxItem>

      <div
        v-else-if="showEmpty"
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
              class="flex h-7 items-center px-2 text-sm font-medium text-ink-gray-7"
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
                  3. item.slots.item (or legacy function-form item.render)
                  4. legacy per-item direct slot (`#<slotName>`)
                  5. default row shell
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

              <component
                :is="ItemSlotRender"
                v-else-if="shouldUseLegacyDirectSlot(item)"
                :render="slotFns[getLegacyDirectSlotName(item)!]"
                :slot-props="getLegacySlotProps(item)"
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
                </template>

                <template #label>
                  <component
                    :is="ItemSlotRender"
                    v-if="shouldUseDynamicItemSlot(item)"
                    :render="slotFns[getDynamicItemSlotName(item)!]"
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
                    <LucideCheck class="size-4" />
                  </ComboboxItemIndicator>
                </template>
              </ItemListRow>
            </ComboboxItem>
          </ComboboxGroup>
        </template>
      </template>
    </template>

    <div v-if="slotFns.footer" data-slot="footer">
      <component
        :is="ItemSlotRender"
        :render="slotFns.footer"
        :slot-props="{}"
      />
    </div>
  </ComboboxViewport>
</template>
