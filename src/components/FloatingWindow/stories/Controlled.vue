<script setup lang="ts">
import { ref } from 'vue'
import { FloatingWindow, TabButtons, Textarea, type WindowMode } from 'frappe-ui'

const mode = ref<WindowMode>('docked')

// Icons echo the window's title-bar controls: pinned in place when docked,
// maximize when floating, minus when minimized.

const note = ref('')
</script>

<template>
  <div class="flex w-[440px] flex-col gap-3">
    <!-- A segmented control reads the active mode as a raised pill, and stays
         in sync with the window's title-bar controls. The readout makes the
         binding visible even after the window detaches to the viewport corner. -->
    <div class="flex items-center justify-between">
      <span class="text-p-sm text-ink-gray-5">
        Mode:
        <span class="font-medium capitalize text-ink-gray-8">{{ mode }}</span>
      </span>
    </div>

    <FloatingWindow v-model:mode="mode" title="Quick note">
      <div class="flex h-full flex-col gap-2 p-3">
        <Textarea
          v-model="note"
          class="flex-1"
          placeholder="Jot something down, then switch the mode above..."
        />
        <p class="text-p-xs text-ink-gray-5">
          The segmented control above and the title-bar controls both update
          <code>mode</code>. Floating and minimized detach the window to the
          bottom-right corner of the viewport.
        </p>
      </div>
    </FloatingWindow>
  </div>
</template>
