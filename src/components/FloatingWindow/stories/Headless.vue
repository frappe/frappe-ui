<script setup lang="ts">
import { ref } from 'vue'
import { useFloatingWindow, Button } from 'frappe-ui'

const panel = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

// The composable owns geometry, the mode state machine, dragging, resizing,
// and persistence. The markup below is entirely yours.
const { mode, style, dock, float, minimize, expandFromTray, startResize } =
  useFloatingWindow(panel, handle, { initialWidth: 360, initialHeight: 300 })

const activity = [
  { id: 1, who: 'Erica', what: 'closed ticket #482', when: '2m ago' },
  { id: 2, who: 'Mohit', what: 'commented on #479', when: '18m ago' },
  { id: 3, who: 'You', what: 'assigned #501 to Priya', when: '1h ago' },
  { id: 4, who: 'Priya', what: 'reopened #466', when: '3h ago' },
]
</script>

<template>
  <div
    ref="panel"
    class="flex w-[360px] flex-col rounded-lg border border-outline-gray-2 bg-surface-elevation-1"
    :class="mode === 'docked' ? '' : 'shadow-2xl'"
    :style="style"
  >
    <div
      ref="handle"
      class="flex select-none items-center justify-between border-b border-outline-gray-1 px-3 py-2"
      :class="mode === 'floating' ? 'cursor-move' : ''"
    >
      <span class="text-p-sm font-medium text-ink-gray-8">Activity</span>
      <div class="flex items-center gap-1">
        <Button variant="ghost" @click="mode === 'docked' ? float() : dock()">
          {{ mode === 'docked' ? 'Pop out' : 'Dock' }}
        </Button>
        <Button
          v-if="mode === 'minimized'"
          variant="ghost"
          @click="expandFromTray"
        >
          Expand
        </Button>
        <Button v-else variant="ghost" @click="minimize">Minimize</Button>
      </div>
    </div>

    <ul
      v-show="mode !== 'minimized'"
      class="min-h-0 flex-1 divide-y divide-outline-gray-1 overflow-auto"
    >
      <li
        v-for="item in activity"
        :key="item.id"
        class="flex items-baseline justify-between gap-3 px-3 py-2 text-p-sm"
      >
        <span class="text-ink-gray-7">
          <span class="font-medium text-ink-gray-8">{{ item.who }}</span>
          {{ item.what }}
        </span>
        <span class="shrink-0 text-p-xs text-ink-gray-4">{{ item.when }}</span>
      </li>
    </ul>

    <div
      v-if="mode === 'floating'"
      class="absolute bottom-0 right-0 size-4 cursor-nwse-resize"
      @pointerdown.prevent="startResize"
    />
  </div>
</template>
