<template>
  <template v-if="!virtualEnabled">
    <template v-for="(item, index) in items" :key="getItemKey(item, index)">
      <slot :item="item" :index="index" />
    </template>
  </template>
  <div v-else ref="anchor" v-bind="wrapperProps" role="presentation">
    <template v-for="row in rows" :key="getItemKey(row.data, row.index)">
      <slot :item="row.data" :index="row.index" />
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
   * How to derive a row's identity — the value that must match each
   * `<ListRow :value>`. A string reads that property off the item; a function
   * computes it. Drives both the render `:key` and the header select-all
   * universe, so the two can't drift. Defaults to the item's `name`, then `id`,
   * then the index. Set this when a row's `:value` isn't the item's name/id.
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
  default?: (props: { item: T; index: number }) => unknown
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
// same `getItemKey` as the render `:key`, so `rowKey` keeps both in lockstep.
// `getItemKey` can yield a number (e.g. a numeric `id`), but the selection
// contract — `ListRow.value` and `v-model:selection` — is string-typed, so
// coerce here; otherwise a numeric universe never matches the string selection
// and the header checkbox silently stays empty.
watch(
  () => props.items,
  (items) => {
    context?.setAllValues(items.map((item, i) => String(getItemKey(item, i))))
  },
  { immediate: true },
)
onBeforeUnmount(() => context?.setAllValues([]))

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
