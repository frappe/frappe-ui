<template>
  <div
    v-if="show"
    class="table-border-menu absolute z-40 rounded-lg border bg-white shadow-xl p-0.5"
    :style="{
      top: position.top + 'px',
      left: position.left + 'px',
      transform:
        axis === 'column' || cellInfo?.isMultiCellSelection
          ? 'translateX(-50%)'
          : undefined,
    }"
    @click.stop
  >
    <div class="flex items-center gap-1">
      <Button
        v-for="item in menuObj"
        :key="item.action"
        :tooltip="item.tooltip"
        @click="$emit(item.action)"
        class="!size-6"
        variant="ghost"
      >
        <template #icon>
          <component :is="item.icon" class="text-ink-gray-6 size-3.5" />
        </template>
      </Button>

      <Button
        @click="$emit('mergeCells')"
        variant="ghost"
        v-if="canMergeCells"
        class="!size-6"
        tooltip="Merge Cells"
      >
        <template #icon>
          <LucideMerge class="text-ink-gray-6 size-3.5" />
        </template>
      </Button>

      <Popover>
        <template #target="{ togglePopover }">
          <Button
            class="!size-6"
            @click="togglePopover()"
            variant="ghost"
            tooltip="Color"
          >
            <template #icon>
              <LucidePalette class="text-ink-gray-6 size-3.5" />
            </template>
          </Button>
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
                :style="color.style"
                @click="
                  handleBackgroundColor(
                    color.name === 'Default' ? null : color.name.toLowerCase(),
                  )
                "
                :title="color.name"
              ></button>
            </div>
            <div class="mt-2 text-sm text-ink-gray-7">Border Color</div>
            <div class="mt-1 grid grid-cols-6 gap-1">
              <button
                v-for="color in borderColors"
                :key="'border-' + color.name"
                :aria-label="color.name"
                class="h-5 w-5 rounded bg-white"
                :class="color.borderClass"
                @click="
                  handleBorderColor(
                    color.name === 'Default'
                      ? 'transparent'
                      : color.name.toLowerCase(),
                  )
                "
                :title="color.name"
              ></button>
            </div>
          </div>
        </template>
      </Popover>
      <Popover>
        <template #target="{ togglePopover }">
          <Button
            class="!size-6"
            @click="togglePopover()"
            variant="ghost"
            tooltip="Border Width"
          >
            <template #icon>
              <LucideFrame class="text-ink-gray-6 size-3.5" />
            </template>
          </Button>
        </template>
        <template #body-main>
          <div
            class="p-2"
            @mousedown.stop
            @click.stop
            @pointerdown.stop
            @touchstart.stop
          >
            <FormControl
              :type="'number'"
              :ref_for="true"
              size="sm"
              variant="subtle"
              placeholder="1px"
              :disabled="false"
              label="Border Width"
              :min="1"
              :max="20"
              v-model="borderWidth"
            />
          </div>
        </template>
      </Popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import Popover from '../../../Popover/Popover.vue'
import LucideArrowUp from '~icons/lucide/arrow-up'
import LucideArrowDown from '~icons/lucide/arrow-down'
import LucideArrowLeft from '~icons/lucide/arrow-left'
import LucideArrowRight from '~icons/lucide/arrow-right'
import LucideTrash from '~icons/lucide/trash-2'
import LucideMerge from '~icons/lucide/merge'
import LucideHeader from '~icons/lucide/panel-top'
import LucidePalette from '~icons/lucide/palette'
import LucideFrame from '~icons/lucide/frame'
import { computed, ref, watch } from 'vue'

interface TableBorderMenuProps {
  show: boolean
  axis: 'row' | 'column' | null
  position: { top: number; left: number }
  cellInfo: {
    element: HTMLElement | null
    rowIndex: number
    colIndex: number
    isFirstRow: boolean
    isIndividualCell: boolean
    isMultiCellSelection?: boolean
  } | null
  canMergeCells: boolean
}

const props = defineProps<TableBorderMenuProps>()

type MenuAction =
  | 'addRowBefore'
  | 'addRowAfter'
  | 'deleteRow'
  | 'addColumnBefore'
  | 'addColumnAfter'
  | 'deleteColumn'
  | 'toggleHeader'

interface MenuItem {
  icon: any
  action: MenuAction
  tooltip: string
}

const menuObjRow: MenuItem[] = [
  { icon: LucideArrowUp, action: 'addRowBefore', tooltip: 'Add Row Before' },
  { icon: LucideArrowDown, action: 'addRowAfter', tooltip: 'Add Row After' },
  { icon: LucideHeader, action: 'toggleHeader', tooltip: 'Make Header' },
  { icon: LucideTrash, action: 'deleteRow', tooltip: 'Delete Row' },
]
const menuObjColumn: MenuItem[] = [
  {
    icon: LucideArrowLeft,
    action: 'addColumnBefore',
    tooltip: 'Add Column Before',
  },
  {
    icon: LucideArrowRight,
    action: 'addColumnAfter',
    tooltip: 'Add Column After',
  },
  { icon: LucideHeader, action: 'toggleHeader', tooltip: 'Make Header' },
  { icon: LucideTrash, action: 'deleteColumn', tooltip: 'Delete Column' },
]

const menuObjIndividual: MenuItem[] = [
  { icon: LucideHeader, action: 'toggleHeader', tooltip: 'Make Header' },
]

const menuObjMultiCell: MenuItem[] = [
  { icon: LucideArrowUp, action: 'addRowBefore', tooltip: 'Add Row Before' },
  { icon: LucideArrowDown, action: 'addRowAfter', tooltip: 'Add Row After' },
  {
    icon: LucideArrowLeft,
    action: 'addColumnBefore',
    tooltip: 'Add Column Before',
  },
  {
    icon: LucideArrowRight,
    action: 'addColumnAfter',
    tooltip: 'Add Column After',
  },
  { icon: LucideHeader, action: 'toggleHeader', tooltip: 'Make Header' },
]

const menuObj = computed(() => {
  if (props.axis === 'row') {
    return menuObjRow
  } else if (props.axis === 'column') {
    return menuObjColumn
  } else if (props.cellInfo?.isMultiCellSelection) {
    return menuObjMultiCell
  } else {
    return menuObjIndividual
  }
})
const emit = defineEmits<{
  (e: MenuAction | 'mergeCells'): void
  (e: 'setBackgroundColor', color: string | null): void
  (e: 'setBorderColor', color: string | null): void
  (e: 'setBorderWidth', width: number): void
}>()

const borderWidth = ref(1)

watch(borderWidth, (newWidth: number) => {
  if (newWidth && newWidth > 0) {
    emit('setBorderWidth', newWidth)
  }
})

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
  {
    name: 'Red',
    borderClass: 'border-2 border-red-600 dark:border-dark-red-400',
  },
  {
    name: 'Orange',
    borderClass: 'border-2 border-orange-600 dark:border-dark-orange-400',
  },
  {
    name: 'Yellow',
    borderClass: 'border-2 border-yellow-600 dark:border-dark-yellow-400',
  },
  {
    name: 'Green',
    borderClass: 'border-2 border-green-600 dark:border-dark-green-400',
  },
  {
    name: 'Teal',
    borderClass: 'border-2 border-teal-600 dark:border-dark-teal-400',
  },
  {
    name: 'Cyan',
    borderClass: 'border-2 border-cyan-600 dark:border-dark-cyan-400',
  },
  {
    name: 'Blue',
    borderClass: 'border-2 border-blue-600 dark:border-dark-blue-400',
  },
  {
    name: 'Purple',
    borderClass: 'border-2 border-purple-600 dark:border-dark-purple-400',
  },
  {
    name: 'Pink',
    borderClass: 'border-2 border-pink-600 dark:border-dark-pink-400',
  },
  {
    name: 'Gray',
    borderClass: 'border-2 border-gray-600 dark:border-dark-gray-400',
  },
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
