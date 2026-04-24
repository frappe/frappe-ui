<script setup lang="ts">
import { computed, useSlots } from 'vue'
import ItemListRow from './ItemListRow.vue'
import type {
  ItemListEmits,
  ItemListGroup,
  ItemListItem,
  ItemListProps,
  ItemListSlots,
} from './types'

const props = withDefaults(defineProps<ItemListProps>(), {
  items: () => [],
  groups: () => [],
  size: 'sm',
  emptyText: 'No items',
})

const emit = defineEmits<ItemListEmits>()
const slots = useSlots()

function normalizeItems(items: ItemListItem[] = []) {
  return items.filter(Boolean)
}

const normalizedGroups = computed<ItemListGroup[]>(() => {
  if (props.groups.length) {
    return props.groups
      .map((group) => ({
        ...group,
        items: normalizeItems(group.items),
      }))
      .filter((group) => group.items.length)
  }

  const items = normalizeItems(props.items)

  if (!items.length) {
    return []
  }

  return [
    {
      key: 'default',
      hideLabel: true,
      items,
    },
  ]
})

const hasItems = computed(() => normalizedGroups.value.length > 0)

// `lucide-*` strings route through the shared Tailwind plugin's
// mask-based utility class (see tailwind/lucideIconsPlugin.js).
function isLucideIconString(icon: unknown): icon is string {
  return typeof icon === 'string' && icon.startsWith('lucide-')
}

function getItemSlotName(item: ItemListItem) {
  return item.slot ? `item-${item.slot}` : undefined
}

function handleItemClick(item: ItemListItem) {
  if (item.disabled) return
  emit('item-click', item)
}

defineSlots<ItemListSlots>()
</script>

<template>
  <div data-slot="item-list" :data-size="size" class="flex flex-col">
    <template v-if="hasItems">
      <div
        v-for="(group, groupIndex) in normalizedGroups"
        :key="group.key ?? `${group.group ?? 'group'}-${groupIndex}`"
        data-slot="group"
        class="flex flex-col"
      >
        <div
          v-if="group.group && !group.hideLabel"
          data-slot="group-label"
          class="flex h-7 items-center px-2 text-sm font-medium text-ink-gray-4"
        >
          <slot name="group-label" v-bind="{ group }">
            {{ group.group }}
          </slot>
        </div>

        <button
          v-for="(item, itemIndex) in group.items"
          :key="item.value ?? item.label ?? itemIndex"
          type="button"
          data-slot="item"
          :data-state="item.active ? 'active' : 'inactive'"
          :data-disabled="item.disabled ? '' : undefined"
          :data-size="size"
          :disabled="item.disabled"
          class="w-full text-left enabled:hover:[&>[data-slot=item-list-row]]:bg-surface-gray-2 enabled:active:[&>[data-slot=item-list-row]]:bg-surface-gray-3"
          @click="handleItemClick(item)"
        >
          <slot v-if="$slots.item" name="item" v-bind="{ item, group }" />
          <ItemListRow
            v-else
            :size="size"
            :active="item.active"
            :selected="item.selected"
            :disabled="item.disabled"
          >
            <template
              v-if="$slots['item-prefix'] || item.icon"
              #prefix
            >
              <slot v-if="$slots['item-prefix']" name="item-prefix" v-bind="{ item, group }" />
              <span
                v-else-if="isLucideIconString(item.icon)"
                :class="[item.icon, 'size-4 shrink-0 text-ink-gray-6']"
                aria-hidden="true"
              />
              <component
                v-else-if="item.icon && typeof item.icon !== 'string'"
                :is="item.icon"
                class="size-4 shrink-0 text-ink-gray-6"
              />
            </template>

            <template #label>
              <slot
                v-if="getItemSlotName(item) && slots[getItemSlotName(item)!]"
                :name="getItemSlotName(item)!"
                v-bind="{ item, group }"
              />
              <slot v-else name="item-label" v-bind="{ item, group }">
                <div class="min-w-0">
                  <div class="truncate text-left">{{ item.label }}</div>
                  <div
                    v-if="item.description"
                    class="truncate text-p-sm text-ink-gray-5"
                  >
                    {{ item.description }}
                  </div>
                </div>
              </slot>
            </template>

            <template v-if="$slots['item-suffix']" #suffix>
              <slot name="item-suffix" v-bind="{ item, group }" />
            </template>
          </ItemListRow>
        </button>
      </div>
    </template>

    <div v-else data-slot="empty">
      <slot name="empty">
        <div class="px-2 py-1.5 text-base text-ink-gray-5">
          {{ emptyText }}
        </div>
      </slot>
    </div>

    <div v-if="$slots.footer" data-slot="footer">
      <slot name="footer" />
    </div>
  </div>
</template>
