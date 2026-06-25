<template>
  <div
    data-slot="content-body"
    data-panel
    :data-motion="motion"
    :data-state="state"
    :class="shellClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Shared floating-panel shell for popover-style surfaces (Popover, Select,
 * Combobox, DatePicker, TimePicker, …).
 *
 * It owns ONLY two things:
 *   1. the visual shell — `rounded-lg bg-surface-elevation-2 shadow-2xl
 *      ring-1 ring-black ring-opacity-5` — matching what the selection family
 *      renders today, plus the `data-slot="content-body"` hook, and
 *   2. the open/close motion wiring (`data-motion` + the co-located
 *      `popoverPanel.css`, supporting both the `animated` scale-from-trigger
 *      rhythm and the `instant` keyboard/Dropdown rhythm).
 *
 * It owns NO behavior and NO reka root: render it INSIDE a reka
 * `PopoverContent` / `SelectContent` / `ComboboxContent` / `DropdownMenuContent`
 * (or directly). Each consumer keeps its own reka `*Root`, `*Portal`,
 * `*Content`, `FocusScope` and a11y wiring, and renders its contents in the
 * default slot.
 *
 * It is a thin pass-through: Vue auto-merges any `class`/`style`/attrs onto the
 * single root, so consumers add layout (flex/grid/divide/min-w) and the
 * per-primitive `transform-origin` without losing the shell classes.
 */
import './popoverPanel.css'

withDefaults(
  defineProps<{
    /**
     * Open/close rhythm:
     *   - `'animated'` (default): pointer opens → scale-from-trigger entrance.
     *   - `'instant'`: keyboard / programmatic opens → ~80ms opacity fade only.
     * Drive this from `usePopoverMotion(open).motion`.
     */
    motion?: 'animated' | 'instant'
    /**
     * The reka content's `data-state`, forwarded onto the panel element so the
     * co-located motion CSS is self-contained. Omit when the parent reka
     * `*Content` already exposes `data-state` and you rely on reka's own state
     * (the motion CSS matches an ancestor `[data-state]` too).
     */
    state?: 'open' | 'closed'
  }>(),
  {
    motion: 'animated',
  },
)

defineSlots<{ default?: () => any }>()

// The standard elevated floating-panel shell. Kept verbatim in sync with the
// selection family's `content-body` so every popover surface shares one look.
// Consumer `class` (layout, transform-origin) auto-merges after this.
const shellClass =
  'overflow-hidden rounded-lg bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5 will-change-[opacity,transform]'
</script>
