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
          $slots.header ? '' : 'gap-2 px-3 py-2',
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
            <LucideGripVertical
              v-if="isFloating"
              class="h-4 w-4 shrink-0 text-ink-gray-4"
            />
            <span class="truncate text-sm font-medium text-ink-gray-8">
              {{ title }}
            </span>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <slot name="actions" v-bind="{ mode, dock, float, minimize }" />
            <Button
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
            <!-- In the tray the window is already minimized, so offer to expand
                 it back out; everywhere else offer to minimize. -->
            <Button
              v-if="isMinimized"
              variant="ghost"
              tooltip="Expand"
              @click="expandFromTray"
            >
              <template #icon><LucideMaximize2 class="h-4 w-4" /></template>
            </Button>
            <Button v-else variant="ghost" tooltip="Minimize" @click="minimize">
              <template #icon><LucideMinus class="h-4 w-4" /></template>
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

      <!-- Bottom-right resize grip -->
      <div
        v-if="isFloating"
        class="absolute bottom-0 right-0 flex h-4 w-4 cursor-nwse-resize items-end justify-end p-0.5"
        @pointerdown.prevent="startResize"
      >
        <LucideGripVertical class="h-3 w-3 rotate-45 text-ink-gray-4" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import LucideGripVertical from '~icons/lucide/grip-vertical'
import LucideExternalLink from '~icons/lucide/external-link'
import LucidePin from '~icons/lucide/pin'
import LucideMinus from '~icons/lucide/minus'
import LucideMaximize2 from '~icons/lucide/maximize-2'
import { Button } from '../Button'
import { useFloatingWindow } from './useFloatingWindow'
import type { WindowMode } from './types'

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
    /** Default floating width, used when popping out. */
    initialWidth?: number
    /** Default floating height, used when popping out. */
    initialHeight?: number
    /** Smallest width the panel can be resized to. */
    minWidth?: number
    /** Smallest height the panel can be resized to. */
    minHeight?: number
  }>(),
  {
    title: '',
    storageKey: null,
    initialWidth: 460,
    initialHeight: 520,
    minWidth: 380,
    minHeight: 300,
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
  dock,
  float,
  minimize,
  expandFromTray,
  setMode,
} = useFloatingWindow(panel, handle, {
  initialMode: modeModel.value,
  initialWidth: props.initialWidth,
  initialHeight: props.initialHeight,
  minWidth: props.minWidth,
  minHeight: props.minHeight,
  storageKey: props.storageKey,
})

const isDocked = computed(() => mode.value === 'docked')
const isFloating = computed(() => mode.value === 'floating')
const isMinimized = computed(() => mode.value === 'minimized')

// The composable owns `mode` (it restores from storage), so mirror it into the
// v-model in both directions without looping.
watch(mode, (value) => (modeModel.value = value))
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
