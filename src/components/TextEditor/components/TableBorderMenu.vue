<template>
  <div
    v-if="show"
    class="table-border-menu absolute z-40 rounded-lg border border-gray-200 bg-white shadow-xl p-1"
    :style="{
      top: position.top + 'px',
      left: position.left + 'px',
    }"
    @click.stop
  >
    <div class="flex items-center gap-1">
      <template v-if="axis === 'row'">
        <button
          @click="emit('addRowBefore')"
          class="rounded px-2 py-1.5 text-sm flex flex-row items-center gap-1.5 hover:bg-gray-100 transition-colors"
          title="Add Row Before"
        >
          <LucideArrowUp class="w-3 h-3"/>
          <span>Row</span>
        </button>
        <button
          @click="emit('addRowAfter')"
          class="rounded px-2 py-1.5 text-sm flex flex-row items-center gap-1.5 hover:bg-gray-100 transition-colors"
          title="Add Row After"
        >
          <LucideArrowDown class="w-3 h-3"/>
          <span>Row</span>
        </button>
        <div class="mx-1 h-5 w-px bg-gray-300"></div>
        <button
          @click="emit('deleteRow')"
          class="rounded px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 flex flex-row items-center gap-1.5 transition-colors"
          title="Delete Row"
        >
          <LucideTrash class="w-3 h-3"/>
          <span>Row</span>
        </button>
      </template>

      <!-- Column operations -->
      <template v-else-if="axis === 'column'">
        <button
          @click="emit('addColumnBefore')"
          class="rounded px-2 py-1.5 text-sm flex flex-row items-center gap-1.5 hover:bg-gray-100 transition-colors"
          title="Add Column Before"
        >
          <LucideArrowLeft class="w-3 h-3"/>
          <span>Col</span>
        </button>
        <button
          @click="emit('addColumnAfter')"
          class="rounded px-2 py-1.5 text-sm flex flex-row items-center gap-1.5 hover:bg-gray-100 transition-colors"
          title="Add Column After"
        >
          <LucideArrowRight class="w-3 h-3"/>
          <span>Col</span>
        </button>
        <div class="mx-1 h-5 w-px bg-gray-300"></div>
        <button
          @click="emit('deleteColumn')"
          class="rounded px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 flex flex-row items-center gap-1.5 transition-colors"
          title="Delete Column"
        >
          <LucideTrash class="w-3 h-3"/>
          <span>Col</span>
        </button>
      </template>

      <div class="mx-1 h-5 w-px bg-gray-300"></div>
      <button
        @click="emit('mergeCells')"
        :disabled="!canMergeCells"
        class="rounded px-2 py-1.5 text-sm flex flex-row items-center gap-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Merge Cells"
      >
        <LucideMerge class="w-3 h-3"/>
        <span>Merge</span>
      </button>
      <div class="mx-1 h-5 w-px bg-gray-300"></div>
      <button
        @click="emit('toggleHeader')"
        class="rounded px-2 py-1.5 text-sm flex flex-row items-center gap-1.5 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-600': cellInfo?.isFirstRow }"
        title="Toggle Header Row"
      >
        <LucideHeader class="w-3 h-3"/>
        <span>Header</span>
      </button>

      <div class="mx-1 h-5 w-px bg-gray-300"></div>
      <Popover placement="bottom-start">
        <template #target="{ togglePopover }">
          <button
            @click="togglePopover()"
            class="rounded px-2 py-1.5 text-sm flex flex-row items-center gap-1.5 hover:bg-gray-100 transition-colors"
            title="Cell Colors"
          >
            <LucidePalette class="h-3 w-3"/>
            <span>Color</span>
          </button>
        </template>
        <template #body-main>
          <div class="p-2">
            <div class="text-sm text-ink-gray-7">Background Color</div>
            <div class="mt-1 grid grid-cols-6 gap-1">
              <button
                v-for="color in backgroundColors"
                :key="'bg-' + color.name"
                :aria-label="color.name"
                class="h-5 w-5 rounded border"
                :class="color.class"
                :style="color.style"
                @click="handleBackgroundColor(color.name === 'Default' ? null : color.name.toLowerCase())"
                :title="color.name"
              >
              </button>
            </div>
            <div class="mt-2 text-sm text-ink-gray-7">Border Color</div>
            <div class="mt-1 grid grid-cols-6 gap-1">
              <button
                v-for="color in borderColors"
                :key="'border-' + color.name"
                :aria-label="color.name"
                class="h-5 w-5 rounded bg-white"
                :class="color.borderClass"
                @click="handleBorderColor(color.name === 'Default' ? null : color.name.toLowerCase())"
                :title="color.name"
              >
              </button>
            </div>
          </div>
        </template>
      </Popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import Popover from '../../Popover/Popover.vue'
import { Tooltip } from '../../../index'
import LucideArrowUp from '~icons/lucide/arrow-up'
import LucideArrowDown from '~icons/lucide/arrow-down'
import LucideArrowLeft from '~icons/lucide/arrow-left'
import LucideArrowRight from '~icons/lucide/arrow-right'
import LucideTrash from '~icons/lucide/trash-2'
import LucideMerge from '~icons/lucide/merge'
import LucideHeader from '~icons/lucide/panel-top'
import LucidePalette from '~icons/lucide/palette'

interface TableBorderMenuProps {
  show: boolean
  axis: 'row' | 'column' | null
  position: { top: number; left: number }
  cellInfo: {
    element: HTMLElement | null
    rowIndex: number
    colIndex: number
    isFirstRow: boolean
  } | null
  canMergeCells: boolean
}

const props = defineProps<TableBorderMenuProps>()

const emit = defineEmits<{
  addRowBefore: []
  addRowAfter: []
  deleteRow: []
  addColumnBefore: []
  addColumnAfter: []
  deleteColumn: []
  mergeCells: []
  toggleHeader: []
  setBackgroundColor: [color: string | null]
  setBorderColor: [color: string | null]
}>()

const backgroundColors = [

  { name: 'Default', style: 'background: #fff;' },
  { name: 'Red', style: 'background: var(--table-bg-red);' },
  { name: 'Orange', style: 'background: var(--table-bg-orange);' },
  { name: 'Yellow', style: 'background: var(--table-bg-yellow);' },
  { name: 'Green', style: 'background: var(--table-bg-green);' },
  { name: 'Teal', style: 'background: var(--table-bg-teal);' },
  { name: 'Cyan', style: 'background: var(--table-bg-cyan);' },
  { name: 'Blue', style: 'background: var(--table-bg-blue);' },
  { name: 'Purple', style: 'background: var(--table-bg-purple);' },
  { name: 'Pink', style: 'background: var(--table-bg-pink);' },
  { name: 'Gray', style: 'background: var(--table-bg-gray);' },
]

const borderColors = [
  { name: 'Default', borderClass: 'border border-outline-gray-modals' },
  { name: 'Red', borderClass: 'border-2 border-red-600 dark:border-dark-red-400' },
  { name: 'Orange', borderClass: 'border-2 border-orange-600 dark:border-dark-orange-400' },
  { name: 'Yellow', borderClass: 'border-2 border-yellow-600 dark:border-dark-yellow-400' },
  { name: 'Green', borderClass: 'border-2 border-green-600 dark:border-dark-green-400' },
  { name: 'Teal', borderClass: 'border-2 border-teal-600 dark:border-dark-teal-400' },
  { name: 'Cyan', borderClass: 'border-2 border-cyan-600 dark:border-dark-cyan-400' },
  { name: 'Blue', borderClass: 'border-2 border-blue-600 dark:border-dark-blue-400' },
  { name: 'Purple', borderClass: 'border-2 border-purple-600 dark:border-dark-purple-400' },
  { name: 'Pink', borderClass: 'border-2 border-pink-600 dark:border-dark-pink-400' },
  { name: 'Gray', borderClass: 'border-2 border-gray-600 dark:border-dark-gray-400' },
]

function handleBackgroundColor(color: string | null) {
  emit('setBackgroundColor', color)
}

function handleBorderColor(color: string | null) {
  emit('setBorderColor', color)
}
</script>

<style scoped>
.table-border-menu {
  max-width: 90vw;
}
</style>
