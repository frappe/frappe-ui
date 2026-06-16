<template>
  <!--
    Teleport to <body> in every detached mode so the panel escapes any host
    layout's overflow/stacking contexts. `disabled` keeps it in-flow while
    docked. Teleport moves the node without remounting, so content inside (an
    editor, a form) never loses focus or state.
  -->
  <Teleport to="body" :disabled="isDocked">
    <div
      ref="panel"
      class="floating-window relative flex flex-col rounded-lg border border-outline-gray-2 bg-surface-white m-4 px-2.5 pb-2.5 pt-1.5"
      :class="isDocked ? '' : 'shadow-2xl'"
      :style="style"
    >
      <!-- Title bar — doubles as the drag handle while floating. When the host
           supplies a `header` slot it becomes the single, full-width header
           (and drag handle) in every mode; otherwise the built-in chrome
           renders, gated by `chromeWhenDocked` while docked. -->
      <div
        v-if="showTitleBar"
        ref="handle"
        class="flex select-none items-center justify-between gap-2"
        :class="[
          isFloating ? 'cursor-move' : isMinimized ? 'cursor-pointer' : '',
          $slots.header ? '' : 'gap-2 px-3 py-2',
        ]"
        @dblclick="!$slots.header && dockable && toggleMaximize()"
        @click="isMinimized && expandFromTray()"
      >
        <!-- Host-owned header: takes the whole row, supplies its own controls. -->
        <div v-if="$slots.header" class="min-w-0 flex-1">
          <slot
            name="header"
            v-bind="{ mode, dock, float, minimize, maximize, expandFromTray }"
          />
        </div>

        <!-- Built-in chrome -->
        <template v-else>
          <div class="flex min-w-0 items-center gap-2">
            <LucideGripVertical
              v-if="draggable && isFloating"
              class="h-4 w-4 shrink-0 text-ink-gray-4"
            />
            <span class="truncate text-sm font-medium text-ink-gray-8">
              <slot name="title" :mode="mode">{{ title }}</slot>
            </span>
          </div>

          <div class="flex shrink-0 items-center gap-1" @click.stop>
            <slot
              name="actions"
              v-bind="{ mode, dock, float, minimize, maximize }"
            />
            <Button
              v-if="dockable"
              variant="ghost"
              :tooltip="isDocked ? 'Pop out' : 'Dock'"
              @click="isDocked ? float() : dock()"
            >
              <template #icon>
                <component
                  :is="isDocked ? LucideExternalLink : LucidePin"
                  class="h-4 w-4"
                />
              </template>
            </Button>
            <Button variant="ghost" :disabled="isMinimized" @click="minimize">
              <template #icon><LucideMinus class="h-4 w-4" /></template>
            </Button>
            <Button
              v-if="isFloating || isMaximized"
              variant="ghost"
              @click="toggleMaximize"
            >
              <template #icon>
                <component
                  :is="isMaximized ? LucideMinimize2 : LucideMaximize2"
                  class="h-4 w-4"
                />
              </template>
            </Button>
          </div>
        </template>
      </div>

      <!-- Body — collapsed in the tray (minimized) -->
      <div v-show="!isMinimized" class="min-h-0 flex-1 overflow-auto">
        <slot :mode="mode" />
      </div>

      <!-- Bottom-right resize grip -->
      <div
        v-if="resizable && isFloating"
        class="absolute bottom-0 right-0 flex h-4 w-4 cursor-nwse-resize items-end justify-end p-0.5"
        @pointerdown.prevent="startResize"
      >
        <LucideGripVertical class="h-3 w-3 rotate-45 text-ink-gray-4" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import LucideGripVertical from '~icons/lucide/grip-vertical'
import LucideExternalLink from '~icons/lucide/external-link'
import LucidePin from '~icons/lucide/pin'
import LucideMinus from '~icons/lucide/minus'
import LucideMaximize2 from '~icons/lucide/maximize-2'
import LucideMinimize2 from '~icons/lucide/minimize-2'
import { Button } from '../Button'
import { useFloatingWindow } from './useFloatingWindow'
import type { WindowMode } from './types'

const props = withDefaults(
  defineProps<{
    /** `v-model:mode` — controlled window state. */
    mode?: WindowMode
    title?: string
    /** localStorage key to persist geometry under (null = don't persist). */
    storageKey?: string | null
    /** Default floating size used when popping out. */
    initialWidth?: number
    initialHeight?: number
    minWidth?: number
    minHeight?: number
    resizable?: boolean
    draggable?: boolean
    dockable?: boolean
    /** Render the title bar while docked. Off lets the host own its header. */
    chromeWhenDocked?: boolean
  }>(),
  {
    mode: 'docked',
    title: '',
    storageKey: null,
    initialWidth: 460,
    initialHeight: 520,
    minWidth: 380,
    minHeight: 300,
    resizable: true,
    draggable: true,
    dockable: true,
    chromeWhenDocked: true,
  },
)

const emit = defineEmits<{ 'update:mode': [mode: WindowMode] }>()

const panel = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

const {
  mode,
  style,
  startResize,
  dock,
  float,
  minimize,
  maximize,
  expandFromTray,
  setMode,
} = useFloatingWindow(panel, handle, {
  initialMode: props.mode,
  initialWidth: props.initialWidth,
  initialHeight: props.initialHeight,
  minWidth: props.minWidth,
  minHeight: props.minHeight,
  storageKey: props.storageKey,
})

const isDocked = computed(() => mode.value === 'docked')
const isFloating = computed(() => mode.value === 'floating')
const isMinimized = computed(() => mode.value === 'minimized')
const isMaximized = computed(() => mode.value === 'maximized')

const slots = useSlots()

// A host-supplied `header` slot is the single header + drag handle in every
// mode, so always show the bar then. Otherwise keep the built-in bar in every
// detached mode, dropping it while docked unless `chromeWhenDocked`.
const showTitleBar = computed(
  () => !!slots.header || !isDocked.value || props.chromeWhenDocked,
)

function toggleMaximize() {
  isMaximized.value ? float() : maximize()
}

// Two-way bind `mode` without looping.
watch(mode, (value) => emit('update:mode', value))
watch(
  () => props.mode,
  (value) => value !== mode.value && setMode(value),
)
</script>

<!--
  Global, intentionally unscoped. While a window is detached it's fixed at
  z-index 50; reka-ui teleports popovers (dropdowns, autocompletes, menus) to
  <body> and copies their content z-index — which is `auto` for most
  components — onto the positioning wrapper, so they render *behind* the window
  and become unclickable. Lift the popover layer to the app's popover z (100,
  matching NestedPopover). `!important` is required to beat reka's inline
  `z-index: auto`. Scoped to `.has-floating-window` so it only applies while a
  window is open; docked windows are in normal flow and need no override.
-->
<style>
body.has-floating-window [data-reka-popper-content-wrapper] {
  z-index: 100 !important;
}
</style>
