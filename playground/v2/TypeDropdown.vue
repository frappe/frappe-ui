<script setup lang="ts">
// Figma: espresso-2.0 › 35114:119645 — a label and a dropdown sharing one
// pill, every value read from the file:
//   the track is fully round, on surface-gray-1, padded 12 · 4 · 4 · 4
//   with a 32px gap; the label is 14/500 ink-gray-7
//   the knob is a round white (elevation-2) button carrying the sm
//   elevation, padded 14 across, its 14/500 ink-gray-7 label 8px from the
//   design's own 16px small-down chevron
// Size is the one departure: 36 / 28 tall and padded 12 on the left,
// rather than the file's 44 / 36 and 20, so this sits exactly like the
// List page's picker.
import { computed } from 'vue'
import { Dropdown } from '../../src'
import chevron from './assets/popover/small-down.svg?raw'

const props = defineProps<{ label: string; options: readonly string[] }>()
const model = defineModel<string>({ required: true })

const items = computed(() =>
  props.options.map((o) => ({
    label: o,
    // the chosen row stays ticked while the menu is open
    selected: o === model.value,
    onClick: () => (model.value = o),
  })),
)
</script>

<template>
  <div
    class="flex h-9 items-center gap-8 rounded-full bg-surface-gray-1 py-1 pl-3 pr-1"
  >
    <span class="shrink-0 text-base-medium text-ink-gray-7">{{ label }}</span>
    <Dropdown :options="items" align="end" :offset="8">
      <button
        type="button"
        class="flex h-7 items-center gap-2 rounded-full bg-surface-elevation-2 px-3.5 text-base-medium text-ink-gray-7 shadow-sm transition-transform active:scale-[0.98]"
        :aria-label="label"
      >
        {{ model }}
        <span class="size-4 shrink-0" v-html="chevron" />
      </button>
    </Dropdown>
  </div>
</template>
