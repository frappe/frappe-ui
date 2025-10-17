<template>
  <component
    :is="list.options.getRowRoute ? 'router-link' : 'div'"
    :class="[
      roundedClass,
      isSelected || isActive ? 'bg-surface-gray-2' : '',
      isHoverable ? 'cursor-pointer' : '',
      isHoverable
        ? isSelected || isActive
          ? 'hover:bg-surface-gray-3'
          : 'hover:bg-surface-menu-bar'
        : '',
    ]"
    class="flex flex-col transition-all duration-300 ease-in-out"
    v-bind="{
      to: list.options.getRowRoute ? list.options.getRowRoute(row) : undefined,
      onClick: onRowClick,
    }"
  >
    <component
      :is="list.options.getRowRoute ? 'template' : 'button'"
      class="[all:unset] hover:[all:unset]"
    >
      <div
        class="grid items-center space-x-4 px-2"
        :style="{
          height: rowHeight,
          gridTemplateColumns: getGridTemplateColumns(
            list.columns,
            list.options.selectable,
          ),
        }"
      >
        <div
          v-if="list.options.selectable"
          class="w-fit pr-2 py-3 flex"
          @click.stop.prevent
          @dblclick.stop
        >
          <Checkbox
            :modelValue="isSelected"
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
    list.value.activeRow.value === props.row.name,
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
  if (list.value.options.onRowClick)
    list.value.options.onRowClick(props.row, event)
  if (list.value.activeRow.value === props.row.name) {
    list.value.activeRow.value = null
  } else {
    list.value.activeRow.value = props.row.name
  }
}

const handleCheckboxClick = (event) => {
  const value = props.row[list.value.rowKey]
  if (event.shiftKey && !list.value.selections.has(value)) {
    const lastSelected = Array.from(list.value.selections).pop()
    const rows = list.value.rows.find((k) => k.group)
      ? list.value.rows.reduce((acc, curr) => acc.concat(curr.rows), [])
      : list.value.rows
    const lastIndex = rows.findIndex(
      (k) => lastSelected === k[list.value.rowKey],
    )
    const curIndex = rows.findIndex((k) => value === k[list.value.rowKey])
    const start = Math.min(lastIndex, curIndex)
    const end = Math.max(lastIndex, curIndex)
    for (let i = start; i <= end; i++) {
      list.value.selections.add(rows[i][list.value.rowKey])
    }
  } else {
    list.value.toggleRow(value)
  }
}
</script>
