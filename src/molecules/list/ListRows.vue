<template>
  <template v-if="!virtualEnabled">
    <template v-for="(item, index) in items" :key="getItemValue(item, index)">
      <slot :item="item" :index="index" :value="getItemValue(item, index)" />
    </template>
  </template>
  <div v-else ref="anchor" v-bind="wrapperProps" role="presentation">
    <template v-for="row in rows" :key="getItemValue(row.data, row.index)">
      <slot
        :item="row.data"
        :index="row.index"
        :value="getItemValue(row.data, row.index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useListContext } from './list-context'
import { useVirtualRows } from './useVirtualRows'
import type { ListVirtualOptions } from './types'

const props = defineProps<{
  /** Items to iterate — one default-slot render per item. */
  items: T[]

  /**
   * How to derive a row's identity. A string reads that property off the item;
   * a function computes it. Drives the render `:key`, the header select-all
   * universe, and the scoped `value` slot prop. Defaults to the item's `name`,
   * then `id`, then the index.
   */
  rowKey?: string | ((item: T, index: number) => PropertyKey)

  /**
   * Window the rows (vueuse useVirtualList) so only rows near the viewport
   * mount. `itemHeight` defaults to the List's `rowHeight`; the scroll
   * container is the nearest scrollable ancestor.
   */
  virtual?: boolean | ListVirtualOptions
}>()

defineSlots<{
  default?: (props: { item: T; index: number; value: string }) => unknown
}>()

const context = useListContext()

const itemHeight = computed(() => {
  const fromOptions =
    typeof props.virtual === 'object' ? props.virtual.itemHeight : undefined
  return fromOptions ?? context?.rowHeight.value
})

const virtualEnabled = computed(() => {
  if (!props.virtual) return false
  if (!itemHeight.value) {
    console.warn(
      '[frappe-ui] <ListRows virtual> needs a row height — set `rowHeight` on <List> or pass `virtual.itemHeight`.',
    )
    return false
  }
  return true
})

const { rows, wrapperProps, anchor } = useVirtualRows(
  () => (virtualEnabled.value ? props.items : []),
  {
    enabled: () => virtualEnabled.value,
    itemHeight: () => itemHeight.value ?? 0,
    overscan:
      typeof props.virtual === 'object' ? props.virtual.overscan : undefined,
  },
)

// Feed the full selectable universe to the List so the header select-all knows
// every row's value — even the virtualized ones that aren't mounted. Uses the
// same `getItemValue` as the render `:key` and scoped `value` slot prop, so
// row identity has one source.
watch(
  () => props.items,
  (items) => {
    context?.setAllValues(items.map((item, i) => getItemValue(item, i)))
  },
  { immediate: true },
)
onBeforeUnmount(() => context?.setAllValues([]))

function getItemValue(item: T, index: number) {
  return String(getItemKey(item, index))
}

function getItemKey(item: T, index: number): PropertyKey {
  if (props.rowKey !== undefined) {
    const key =
      typeof props.rowKey === 'function'
        ? props.rowKey(item, index)
        : isRecord(item)
          ? (item as Record<string, unknown>)[props.rowKey]
          : undefined
    return isPropertyKey(key) ? key : index
  }
  if (!isRecord(item)) return index
  const key = item.name ?? item.id
  return isPropertyKey(key) ? key : index
}

function isRecord(value: unknown): value is { id?: unknown; name?: unknown } {
  return value !== null && typeof value === 'object'
}

function isPropertyKey(value: unknown): value is PropertyKey {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol'
  )
}
</script>
