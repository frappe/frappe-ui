<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'
import EditorPopover from '../EditorPopover.vue'

/**
 * "Pick N×M" hover grid for inserting a table. Pointer users sweep the grid;
 * keyboard users grow/shrink the size with arrows and confirm with Enter.
 */
const MAX_COLS = 8
const MAX_ROWS = 6

const props = defineProps<{
  onPick: (size: { rows: number; cols: number }) => void
}>()

const rows = ref(3)
const cols = ref(3)
const grid = useTemplateRef<HTMLElement>('grid')

// Self-managed focus (EditorPopover gets autofocus=false): the grid div is the
// keyboard surface; FocusScope's first-tabbable scan would land elsewhere.
onMounted(() => void nextTick(() => grid.value?.focus()))

function setSize(r: number, c: number) {
  rows.value = r
  cols.value = c
}

function pick(r: number, c: number) {
  props.onPick({ rows: r, cols: c })
}

function onKeydown(event: KeyboardEvent) {
  const step: Record<string, [number, number]> = {
    ArrowDown: [1, 0],
    ArrowUp: [-1, 0],
    ArrowRight: [0, 1],
    ArrowLeft: [0, -1],
  }
  const delta = step[event.key]
  if (delta) {
    event.preventDefault()
    rows.value = Math.min(Math.max(rows.value + delta[0], 1), MAX_ROWS)
    cols.value = Math.min(Math.max(cols.value + delta[1], 1), MAX_COLS)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    pick(rows.value, cols.value)
  }
}
</script>

<template>
  <EditorPopover
    dialog-label="Insert table"
    content-class="rounded-md p-2.5"
    :autofocus="false"
  >
    <div data-slot="table-size-picker">
      <div
        ref="grid"
        tabindex="0"
        role="grid"
        :aria-label="`Table size, ${rows} rows by ${cols} columns`"
        class="grid w-max gap-1 outline-none"
        :style="{ gridTemplateColumns: `repeat(${MAX_COLS}, minmax(0, 1fr))` }"
        @keydown="onKeydown"
      >
        <template v-for="r in MAX_ROWS" :key="r">
          <button
            v-for="c in MAX_COLS"
            :key="c"
            type="button"
            tabindex="-1"
            class="size-4 rounded-sm border"
            :class="
              r <= rows && c <= cols
                ? 'border-outline-gray-3 bg-surface-gray-4'
                : 'border-outline-gray-2 bg-surface-gray-1'
            "
            :aria-label="`${r} × ${c}`"
            @pointerenter="setSize(r, c)"
            @focus="setSize(r, c)"
            @click="pick(r, c)"
          />
        </template>
      </div>
      <div class="mt-2 text-center text-sm text-ink-gray-7">
        {{ rows }} × {{ cols }}
      </div>
    </div>
  </EditorPopover>
</template>
