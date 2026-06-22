<script setup lang="ts">
import { ref } from 'vue'
import { FloatingWindow, TabButtons, Textarea, type WindowMode } from 'frappe-ui'

const mode = ref<WindowMode>('docked')

// Icons mirror the window's own title-bar controls: pin for docked, pop-out for
// floating, minus for minimized.
const modeOptions = [
  { label: 'Docked', value: 'docked', iconLeft: 'lucide-pin' },
  { label: 'Floating', value: 'floating', iconLeft: 'lucide-external-link' },
  { label: 'Minimized', value: 'minimized', iconLeft: 'lucide-minus' },
]
const note = ref('')
</script>

<template>
  <div class="flex w-[440px] flex-col gap-3">
    <!-- A segmented control reads the active mode as a raised pill, and stays
         in sync with the window's title-bar controls. -->
    <TabButtons v-model="mode" :options="modeOptions" />

    <FloatingWindow v-model:mode="mode" title="Quick note" :initial-height="360">
      <div class="flex h-full flex-col gap-2 p-3">
        <Textarea
          v-model="note"
          class="flex-1"
          placeholder="Jot something down, then switch the mode above..."
        />
        <p class="text-p-xs text-ink-gray-5">
          The segmented control above and the title-bar controls both update
          <code>mode</code>.
        </p>
      </div>
    </FloatingWindow>
  </div>
</template>
