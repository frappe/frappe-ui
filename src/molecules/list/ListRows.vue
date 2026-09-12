<template>
  <template v-if="!virtualEnabled">
    <template v-for="(item, index) in items" :key="getItemValue(item, index)">
      <slot
        :item="item"
        :index="index"
        :value="getItemValue(item, index)"
        :selected="isSelected(item, index)"
        :active="isActive(item, index)"
      />
    </template>
  </template>
  <div v-else ref="anchor" v-bind="wrapperProps" role="presentation">
    <template v-for="row in rows" :key="getItemValue(row.data, row.index)">
      <slot
        :item="row.data"
        :index="row.index"
        :value="getItemValue(row.data, row.index)"
        :selected="isSelected(row.data, row.index)"
        :active="isActive(row.data, row.index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts" generic="T">
import {
  computed,
  onBeforeUnmount,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from 'vue'
import { useListContext } from './list-context'
import { useVirtualRows } from './useVirtualRows'

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
   * Window the rows so only rows near the viewport mount. Height comes from
   * the parent List's `rowHeight`; the scroll container is the nearest
   * scrollable ancestor.
   */
  virtual?: boolean

  /**
   * Explicit scroll viewport, such as ScrollArea's `viewportElement`.
   * Defaults to the nearest scrollable ancestor when null or undefined.
   */
  scrollContainer?: MaybeRefOrGetter<HTMLElement | null | undefined>

  /** Rows rendered beyond the visible window on each side. Default: `6`. */
  overscan?: number
}>()

defineSlots<{
  /** One render per item. `active` and `selected` are independent row states. */
  default?: (props: {
    item: T
    index: number
    value: string
    selected: boolean
    active: boolean
  }) => unknown
}>()

const context = useListContext()

const rowHeight = computed(() => context?.rowHeight.value)

const virtualEnabled = computed(() => {
  if (!props.virtual) return false
  if (!rowHeight.value) {
    console.warn(
      '[frappe-ui] <ListRows virtual> needs a row height. Set `rowHeight` on <List>.',
    )
    return false
  }
  return true
})

const { rows, wrapperProps, anchor } = useVirtualRows(
  () => (virtualEnabled.value ? props.items : []),
  {
    enabled: () => virtualEnabled.value,
    rowHeight: () => rowHeight.value ?? 0,
    scrollContainer: () => toValue(props.scrollContainer),
    overscan: () => props.overscan ?? 6,
  },
)

// Feed the full selectable universe to the List so the header select-all knows
// every row's value — even the virtualized ones that aren't mounted. Uses the
// same `getItemValue` as the render `:key` and scoped `value` slot prop, so
// row identity has one source.
//
// Deriving it through a computed keeps the two in step: the watcher then tracks
// what identity is actually made of — the array's entries, the active `rowKey`,
// and the item fields that key reads — so a push, a splice, a swapped entry, a
// renamed id or a different `rowKey` all move the universe. Watching
// `props.items` alone only sees the array swapped for another one, and an item
// field nothing reads for identity stays untracked: this is not a deep watch.
const itemValues = computed(() =>
  props.items.map((item, i) => getItemValue(item, i)),
)
watch(itemValues, (values) => context?.setAllValues(values), {
  immediate: true,
})
onBeforeUnmount(() => context?.setAllValues([]))

function getItemValue(item: T, index: number) {
  return String(getItemKey(item, index))
}

function isSelected(item: T, index: number) {
  return Boolean(
    context?.selectable.value && context.isSelected(getItemValue(item, index)),
  )
}

function isActive(item: T, index: number) {
  return Boolean(
    context?.activatable.value && context.isActive(getItemValue(item, index)),
  )
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
