<template>
  <div class="p-2" @click.stop>
    <div class="grid grid-cols-6 gap-0.5 w-[120px] mx-auto">
      <div
        v-for="row in maxRows"
        :key="`row-${row}`"
        class="contents"
      >
        <button
          v-for="col in maxCols"
          :key="`cell-${row}-${col}`"
          class="h-4 w-4 border border-outline-gray-2 cursor-pointer transition-all duration-150 ease-in-out"
          :class="{
            'transition-all duration-250 ease-in-out bg-surface-gray-3 border-outline-gray-3': row <= hoveredRows && col <= hoveredCols,
           
          }"
          @mouseenter="hoveredRows = row; hoveredCols = col"
          @mouseleave="hoveredRows = 0; hoveredCols = 0"
          @click="selectSize(row, col)"
        />
      </div>
    </div>
    <div class="text-center text-xs text-ink-gray-7 font-medium py-1 min-h-5">
      {{ hoveredRows || selectedRows }} × {{ hoveredCols || selectedCols }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor?: Editor
  onClick?: (option: any) => void
  close?: () => void
}>()

const injectedEditor = inject<{ value: Editor | null }>('editor', { value: null })
const editor = props.editor || injectedEditor.value

const maxRows = 6
const maxCols = 6
const selectedRows = ref(3)
const selectedCols = ref(3)
const hoveredRows = ref(0)
const hoveredCols = ref(0)

const selectSize = (rows: number, cols: number) => {
  selectedRows.value = rows
  selectedCols.value = cols
  
  if (props.onClick) {
    props.onClick({ rows, cols })
  } else if (editor) {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run()
  }
  
  if (props.close) {
    props.close()
  }
}

</script>


