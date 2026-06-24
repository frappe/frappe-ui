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
      v-bind="$attrs"
      :data-state="mode"
      class="floating-window relative flex flex-col rounded-lg border border-outline-gray-2 bg-surface-elevation-1"
      :class="isDocked ? '' : 'shadow-2xl'"
      :style="style"
    >
      <!-- Title bar, doubles as the drag handle while floating. A host-supplied
           `header` slot replaces it entirely (and becomes the drag handle);
           otherwise the built-in chrome renders. -->
      <div
        ref="handle"
        class="flex select-none items-center justify-between gap-2"
        :class="[
          isFloating ? 'cursor-move' : '',
          $slots.header ? '' : 'gap-2 px-2.5 py-1.5',
        ]"
      >
        <!-- Host-owned header: takes the whole row, supplies its own controls. -->
        <div v-if="$slots.header" class="min-w-0 flex-1">
          <slot
            name="header"
            v-bind="{ mode, dock, float, minimize, expandFromTray }"
          />
        </div>

        <!-- Built-in chrome -->
        <template v-else>
          <div class="flex min-w-0 items-center gap-2">
            <span class="truncate text-sm font-medium text-ink-gray-8">
              {{ title }}
            </span>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <slot name="actions" v-bind="{ mode, dock, float, minimize }" />
            <!-- Minimize control, hidden when the window is not minimizable. In
                 the tray it's already minimized, so offer to expand it back out;
                 everywhere else offer to minimize. -->
            <template v-if="minimizable">
              <Button
                v-if="isMinimized"
                variant="ghost"
                label="Expand"
                tooltip="Expand"
                @click="expandFromTray"
              >
                <template #icon><LucideMaximize2 class="h-4 w-4" /></template>
              </Button>
              <Button
                v-else
                variant="ghost"
                label="Minimize"
                tooltip="Minimize"
                @click="minimize"
              >
                <template #icon><LucideMinus class="h-4 w-4" /></template>
              </Button>
            </template>
            <!-- Expand to a floating window when docked; close (dock back) once
                 detached. The close (X) action always sits last. -->
            <Button
              variant="ghost"
              :label="isDocked ? 'Pop out' : 'Close'"
              :tooltip="isDocked ? 'Pop out' : 'Close'"
              @click="isDocked ? float() : dock()"
            >
              <template #icon>
                <component
                  :is="isDocked ? LucideMaximize2 : LucideX"
                  class="h-4 w-4"
                />
              </template>
            </Button>
          </div>
        </template>
      </div>

      <!-- Body, collapsed in the tray (minimized) -->
      <div v-show="!isMinimized" class="min-h-0 flex-1 overflow-auto">
        <slot :mode="mode" />
      </div>

      <!-- Pinned footer (composer / action bar), collapsed in the tray. -->
      <div v-if="$slots.footer" v-show="!isMinimized" class="shrink-0">
        <slot name="footer" :mode="mode" />
      </div>

      <!-- Resize zones straddling each edge and corner (floating only), so the
           window can be dragged from any side. They're hidden from assistive
           tech; the bottom-right corner is rendered as a focusable button that
           also resizes with the arrow keys, the keyboard counterpart. -->
      <template v-if="isFloating">
        <div
          v-for="handle in resizeHandles"
          :key="handle.name"
          :data-resize="handle.name"
          aria-hidden="true"
          class="absolute"
          :class="handle.class"
          @pointerdown.prevent="startResize($event, handle.dir)"
        />
        <button
          type="button"
          data-resize="se"
          aria-label="Resize window"
          class="absolute -bottom-1 -right-1 size-3 cursor-nwse-resize rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
          @pointerdown.prevent="startResize($event, { x: 1, y: 1 })"
          @keydown="onResizeKey"
        />
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import LucideX from '~icons/lucide/x'
import LucideMinus from '~icons/lucide/minus'
import LucideMaximize2 from '~icons/lucide/maximize-2'
import { Button } from '../Button'
import { useFloatingWindow } from './useFloatingWindow'
import type { ResizeDir, WindowMode } from './types'

// The template root is <Teleport>, which can't receive fallthrough attributes,
// so forward them (class, style, etc.) onto the panel element explicitly.
defineOptions({ inheritAttrs: false })

/** Window state. Use `v-model:mode` to drive it from the host. */
const modeModel = defineModel<WindowMode>('mode', { default: 'docked' })

const props = withDefaults(
  defineProps<{
    /** Title shown in the built-in title bar. */
    title?: string
    /**
     * localStorage key to persist `{ mode, rect }` under. When `null`,
     * geometry resets every session.
     */
    storageKey?: string | null
    /**
     * Whether the window can collapse to the bottom-right tray. When `false`,
     * the minimize control is hidden, leaving only dock and pop-out, for
     * composer-style windows that should never minimize.
     */
    minimizable?: boolean
  }>(),
  {
    title: '',
    storageKey: null,
    minimizable: true,
  },
)

defineSlots<{
  /** The scrollable window body. Receives the current `mode`. */
  default?: (props: { mode: WindowMode }) => any
  /**
   * Pinned region below the scrollable body, for a composer or action bar.
   * Hidden, along with the body, while minimized.
   */
  footer?: (props: { mode: WindowMode }) => any
  /**
   * Replaces the built-in title bar entirely. Becomes the drag handle while
   * floating and must supply its own controls from the slot props.
   */
  header?: (props: {
    mode: WindowMode
    dock: () => void
    float: () => void
    minimize: () => void
    expandFromTray: () => void
  }) => any
  /** Extra controls inserted before the built-in window buttons. */
  actions?: (props: {
    mode: WindowMode
    dock: () => void
    float: () => void
    minimize: () => void
  }) => any
}>()

const panel = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

const {
  mode,
  style,
  startResize,
  resizeBy,
  dock,
  float,
  minimize,
  expandFromTray,
  setMode,
} = useFloatingWindow(panel, handle, {
  initialMode: modeModel.value,
  storageKey: props.storageKey,
})

const isDocked = computed(() => mode.value === 'docked')
const isFloating = computed(() => mode.value === 'floating')
const isMinimized = computed(() => mode.value === 'minimized')

interface ResizeHandle {
  name: string
  dir: ResizeDir
  class: string
}

// Invisible zones straddling each edge and three corners. They extend slightly
// past the panel so they sit over the shadow, not the body's scrollbar. Corners
// come after edges so they layer on top and win the cursor where they meet. The
// bottom-right corner is rendered separately, as the keyboard-capable button.
const resizeHandles: ResizeHandle[] = [
  {
    name: 'n',
    dir: { x: 0, y: -1 },
    class: '-top-1 inset-x-0 h-2 cursor-ns-resize',
  },
  {
    name: 's',
    dir: { x: 0, y: 1 },
    class: '-bottom-1 inset-x-0 h-2 cursor-ns-resize',
  },
  {
    name: 'w',
    dir: { x: -1, y: 0 },
    class: '-left-1 inset-y-0 w-2 cursor-ew-resize',
  },
  {
    name: 'e',
    dir: { x: 1, y: 0 },
    class: '-right-1 inset-y-0 w-2 cursor-ew-resize',
  },
  {
    name: 'nw',
    dir: { x: -1, y: -1 },
    class: '-top-1 -left-1 size-3 cursor-nwse-resize',
  },
  {
    name: 'ne',
    dir: { x: 1, y: -1 },
    class: '-top-1 -right-1 size-3 cursor-nesw-resize',
  },
  {
    name: 'sw',
    dir: { x: -1, y: 1 },
    class: '-bottom-1 -left-1 size-3 cursor-nesw-resize',
  },
]

// Keyboard resize: each arrow nudges the panel by a fixed step, the keyboard
// counterpart to dragging the bottom-right corner.
const RESIZE_STEP = 16
const RESIZE_DELTAS: Record<string, [number, number]> = {
  ArrowRight: [RESIZE_STEP, 0],
  ArrowLeft: [-RESIZE_STEP, 0],
  ArrowDown: [0, RESIZE_STEP],
  ArrowUp: [0, -RESIZE_STEP],
}

function onResizeKey(event: KeyboardEvent) {
  const delta = RESIZE_DELTAS[event.key]
  if (!delta) return
  event.preventDefault()
  resizeBy(...delta)
}

// The composable owns `mode` (it restores from storage), so mirror it into the
// v-model in both directions without looping. Immediate so a host's
// `v-model:mode` adopts a storage-restored mode on mount, not just on the next
// change.
watch(mode, (value) => (modeModel.value = value), { immediate: true })
watch(modeModel, (value) => value !== mode.value && setMode(value))
</script>

<!--
  Global, intentionally unscoped. While a window is detached it's fixed at
  z-index 50; reka-ui teleports popovers (dropdowns, autocompletes, menus) to
  <body> and copies their content z-index (which is `auto` for most
  components) onto the positioning wrapper, so they render *behind* the window
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
