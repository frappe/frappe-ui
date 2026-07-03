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
import { computed } from 'vue'
import { useListContext } from './list-context'
import { useVirtualRows } from './useVirtualRows'
import type { ListVirtualOptions } from './types'

const props = defineProps<{
  /** Items to iterate — one default-slot render per item. */
  items: T[]

  /**
   * Window the rows (vueuse useVirtualList) so only rows near the viewport
   * mount. `itemHeight` defaults to the List's `rowHeight`; the scroll
   * container is the nearest scrollable ancestor.
   */
  virtual?: boolean | ListVirtualOptions
}>()

defineSlots<{
  default(props: { item: T; index: number }): unknown
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

function getItemKey(item: T, index: number): PropertyKey {
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
