<template>
  <component
    :is="getLinkComponent()"
    :class="[
      roundedClass,
      isSelected || isActive ? 'bg-surface-gray-2' : '',
      isHoverable && !row.disabled ? 'cursor-pointer' : '',
      isHoverable && !row.disabled
        ? isSelected || isActive
          ? 'hover:bg-surface-gray-3'
          : 'hover:bg-surface-menu-bar'
        : '',
      row.disabled ? 'pointer-events-none' : '',
    ]"
    class="flex flex-col transition-all duration-300 ease-in-out"
    v-bind="{
      ...getLinkBindings(),
      onClick: onRowClick,
      ...(row.disabled
        ? { 'aria-disabled': 'true', tabindex: -1 }
        : {}),
    }"
  >
    <component
      :is="list.options.getRowRoute ? 'template' : 'button'"
      class="[all:unset] hover:[all:unset]"
    >
      <div
        class="grid items-center gap-4 px-2"
        :class="{
          'cursor-not-allowed': row.disabled,
          'opacity-50': row.disabled,
        }"
        :style="{
          height: rowHeight,
          gridTemplateColumns: getGridTemplateColumns(
            list.columns,
            list.options.selectable
          ),
        }"
      >
        <div
          v-if="list.options.selectable"
          class="w-fit pe-2 py-3 flex"
          @click.stop.prevent
          @dblclick.stop
        >
          <Checkbox
            :modelValue="isSelected"
            :disabled="row.disabled"
            class="cursor-pointer duration-300"
            @click.stop="handleCheckboxClick"
          />
        </div>

        <div
          v-for="(column, i) in list.columns"
          :key="column.key"
          :class="[
            alignmentMap[column.align],
            i == 0 ? 'text-ink-gray-9' : 'text-ink-gray-7',
            'overflow-x-hidden',
          ]"
        >
          <slot v-bind="{ idx: i, column, item: row[column.key], isActive }">
            <component
              v-if="list.slots.cell"
              :is="list.slots.cell"
              v-bind="{
                column,
                row,
                item: row[column.key],
                align: column.align,
              }"
            />
            <ListRowItem
              v-else
              :column="column"
              :row="row"
              :item="row[column.key]"
              :align="column.align"
            />
          </slot>
        </div>
      </div>

      <div
        v-if="!isLastRow"
        class="h-px border-t"
        :class="
          roundedClass === 'rounded' || roundedClass?.includes?.('rounded-b')
            ? 'mx-2 border-outline-gray-1'
            : 'border-t-[--surface-gray-2]'
        "
      />
    </component>
  </component>
</template>

<script setup>
import Checkbox from '../Checkbox/Checkbox.vue'
import ListRowItem from './ListRowItem.vue'
import { alignmentMap, getGridTemplateColumns } from './utils'
import { computed, inject } from 'vue'

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
})

const list = inject('list')

const rowRoute = computed(
  () =>
    list.value.options.getRowRoute && list.value.options.getRowRoute(props.row)
)

const isExternalRoute = computed(() => {
  if (!rowRoute.value) return false
  return typeof rowRoute.value === 'string' && rowRoute.value.startsWith('http')
})

const getLinkComponent = () => {
  if (!rowRoute.value || props.row.disabled) return 'div'
  return isExternalRoute.value ? 'a' : 'router-link'
}

const getLinkBindings = () => {
  if (!rowRoute.value || props.row.disabled) return {}
  return isExternalRoute.value
    ? {
        href: rowRoute.value,
      }
    : { to: rowRoute.value }
}

const isLastRow = computed(() => {
  if (!list.value.rows?.length) return false
  return (
    list.value.rows[list.value.rows.length - 1][list.value.rowKey] ===
    props.row[list.value.rowKey]
  )
})

const isSelected = computed(() => {
  return list.value.selections.has(props.row[list.value.rowKey])
})

const isActive = computed(
  () =>
    list.value.options.enableActive &&
    list.value.activeRow.value === props.row.name
)

const isHoverable = computed(() => {
  return list.value.options.getRowRoute || list.value.options.onRowClick
})

const rowHeight = computed(() => {
  if (typeof list.value.options.rowHeight === 'number') {
    return `${list.value.options.rowHeight}px`
  }
  return list.value.options.rowHeight
})

const roundedClass = computed(() => {
  if (!isSelected.value) return 'rounded'

  const selections = [...list.value.selections]
  let groups = list.value.rows[0]?.group
    ? list.value.rows.map((k) => k.rows)
    : [list.value.rows]

  for (let rows of groups) {
    let currentIndex = rows.findIndex((k) => k == props.row)
    if (currentIndex === -1) continue

    let atBottom = !selections.includes(rows[currentIndex + 1]?.name)
    let atTop = !selections.includes(rows[currentIndex - 1]?.name)

    return (atBottom ? 'rounded-b ' : '') + (atTop ? 'rounded-t' : '')
  }
})

const onRowClick = (event) => {
  if (props.row.disabled) return

  if (list.value.options.onRowClick)
    list.value.options.onRowClick(props.row, event)

  if (list.value.activeRow.value === props.row.name) {
    list.value.activeRow.value = null
  } else {
    list.value.activeRow.value = props.row.name
  }
}

const handleCheckboxClick = (event) => {
  if (props.row.disabled) return

  const value = props.row[list.value.rowKey]

  if (event.shiftKey && !list.value.selections.has(value)) {
    const lastSelected = Array.from(list.value.selections).pop()

    const rows = list.value.rows.find((k) => k.group)
      ? list.value.rows.reduce((acc, curr) => acc.concat(curr.rows), [])
      : list.value.rows

    const lastIndex = rows.findIndex(
      (k) => lastSelected === k[list.value.rowKey]
    )
    const curIndex = rows.findIndex((k) => value === k[list.value.rowKey])

    const start = Math.min(lastIndex, curIndex)
    const end = Math.max(lastIndex, curIndex)

    for (let i = start; i <= end; i++) {
      if (rows[i].disabled) continue
      list.value.selections.add(rows[i][list.value.rowKey])
    }
  } else {
    if (props.row.disabled) return
    list.value.toggleRow(value)
  }
}
</script>
