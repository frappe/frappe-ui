<template>
  <div id="content" class="flex w-full flex-1 flex-col overflow-x-auto">
    <div class="flex w-max min-w-full flex-col overflow-y-hidden">
      <div
        id="list-header"
        class="mx-2 flex items-center space-x-4 border-b py-2"
      >
        <Checkbox
          class="cursor-pointer duration-300"
          :modelValue="state.allRowsSelected"
          @click.stop="state.toggleAllRows(!allRowsSelected)"
        />
        <div
          v-for="column in props.columns"
          :key="column"
          class="flex-1 text-sm text-gray-600"
          :class="column.class"
        >
          {{ column.label }}
        </div>
      </div>
      <div id="list-rows" class="h-full overflow-y-auto">
        <template v-for="row in props.rows" :key="row.name">
          <slot name="list-row" :row="row">
            <ListRow as="div" :row="row">
              <ListRowItem v-for="column in props.columns" :key="column.name">
                {{ row[column.name] }}
              </ListRowItem>
            </ListRow>
          </slot>
        </template>
      </div>
      <transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="transform opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="transform opacity-0"
      >
        <div
          v-if="state.selections.size"
          class="fixed inset-x-0 bottom-6 mx-auto w-max text-base"
        >
          <div
            class="flex w-[596px] items-center space-x-3 rounded-lg bg-white px-4 py-2 shadow-2xl"
          >
            <div
              class="flex flex-1 items-center space-x-3 border-r border-gray-300 text-gray-900"
            >
              <Checkbox
                :modelValue="true"
                :disabled="true"
                class="text-gray-900"
              />
              <div>{{ state.selectedText }}</div>
            </div>
            <div class="flex items-center space-x-1">
              <Button
                class="text-gray-700"
                :disabled="state.allRowsSelected"
                :class="state.allRowsSelected ? 'cursor-not-allowed' : ''"
                variant="ghost"
                @click="state.toggleAllRows(true)"
              >
                Select all
              </Button>
              <Button
                icon="x"
                variant="ghost"
                @click="state.toggleAllRows(false)"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup>
import { computed, provide, reactive } from 'vue'
import Button from '../Button.vue'
import Checkbox from '../Checkbox.vue'
import ListRow from './ListRow.vue'
import ListRowItem from './ListRowItem.vue'

const props = defineProps({
  columns: { type: Array, default: [] },
  rows: { type: Array, default: [] },
})

const state = reactive({
  selections: new Set(),
  allRowsSelected: computed(() => state.selections.size === props.rows.length),
  selectedText: computed(() => {
    return state.selections.size > 1
      ? `${state.selections.size} items selected`
      : `${state.selections.size} item selected`
  }),
})
provide('list', state)

state.toggleAllRows = () => {
  return state.allRowsSelected
    ? state.selections.clear()
    : props.rows.forEach((row) => state.selections.add(row.name))
}

state.toggleSelection = (name) => {
  if (state.selections.has(name)) {
    state.selections.delete(name)
  } else {
    state.selections.add(name)
  }
}
</script>
