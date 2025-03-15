<template>
  <component
    :is="list.options.getRowRoute ? 'router-link' : 'div'"
    :class="{ 'cursor-pointer': isHoverable }"
    class="flex flex-col transition-all duration-300 ease-in-out"
    v-bind="{
      to: list.options.getRowRoute ? list.options.getRowRoute(row) : undefined,
      onClick: list.options.onRowClick
        ? (e) => {
            if (e.metaKey) list.toggleRow(row[list.rowKey])
            list.options.onRowClick(row)
          }
        : (e) => (e.metaKey ? list.toggleRow(row[list.rowKey]) : null),
    }"
  >
    <component
      :is="list.options.getRowRoute ? 'template' : 'button'"
      class="[all:unset] hover:[all:unset]"
    >
      <div
        class="grid items-center space-x-4 px-2"
        :class="[
          roundedClass,
          isSelected ? 'bg-surface-gray-2' : '',
          isHoverable
            ? isSelected
              ? 'hover:bg-surface-gray-3'
              : 'hover:bg-surface-menu-bar'
            : '',
        ]"
        :style="{
          height: rowHeight,
          gridTemplateColumns: getGridTemplateColumns(
            list.columns,
            list.options.selectable
          ),
        }"
      >
        <Checkbox
          v-if="list.options.selectable"
          :modelValue="isSelected"
          @click.stop="list.toggleRow(row[list.rowKey])"
          class="cursor-pointer duration-300"
        />
        <div
          v-for="(column, i) in list.columns"
          :key="column.key"
          :class="[
            alignmentMap[column.align],
            i == 0 ? 'text-ink-gray-9' : 'text-ink-gray-7',
          ]"
        >
          <slot v-bind="{ idx: i, column, item: row[column.key] }">
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
        v-if="
          !isLastRow &&
          (roundedClass === 'rounded' || roundedClass?.includes?.('rounded-b'))
        "
        class="mx-2 h-px border-t border-outline-gray-1"
      />
    </component>
  </component>
</template>

<script setup>
import Checkbox from '../Checkbox.vue'
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
  const selections = [...list.value.selections]
  if (!isSelected.value) return 'rounded'
  let currentIndex = list.value.rows.findIndex((k) => k == props.row)
  let atBottom = !selections.includes(list.value.rows[currentIndex + 1]?.name)
  let atTop = !selections.includes(list.value.rows[currentIndex - 1]?.name)
  return (atBottom ? 'rounded-b ' : '') + (atTop ? 'rounded-t' : '')
})
</script>
