<template>
  <div
    data-slot="content-body"
    data-panel
    data-motion="instant"
    :data-state="state"
    :class="shellClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Shared floating-panel shell for popover-style surfaces (Popover, Select,
 * Combobox, HoverCard, DatePicker, TimePicker, …).
 *
 * It owns ONLY two things:
 *   1. the visual shell — `rounded-6 bg-surface-elevation-2 shadow-2xl
 *      ring-1 ring-black ring-opacity-5` — matching what the selection family
 *      renders today, plus the `data-slot="content-body"` hook, and
 *   2. the open/close motion wiring (`data-motion` + the co-located
 *      `popoverPanel.css`).
 *
 * There is one rhythm and no prop to pick it: an ~80ms opacity fade on open,
 * nothing on close. `data-motion="instant"` stays on the element as the
 * documented styling hook. Nothing in the library scales in — a panel appears
 * at a fixed spot, so an entrance only puts motion between the press and the
 * content.
 *
 * It owns NO behavior and NO reka root: render it INSIDE a reka
 * `PopoverContent` / `SelectContent` / `ComboboxContent` / `DropdownMenuContent`
 * (or directly). Each consumer keeps its own reka `*Root`, `*Portal`,
 * `*Content`, `FocusScope` and a11y wiring, and renders its contents in the
 * default slot.
 *
 * It is a thin pass-through: Vue auto-merges any `class`/`style`/attrs onto the
 * single root, so consumers add layout (flex/grid/divide/min-w) without losing
 * the shell classes. No consumer needs a `transform-origin` — nothing here
 * transforms.
 */
import './popoverPanel.css'

defineProps<{
  /**
   * The reka content's `data-state`, forwarded onto the panel element so the
   * co-located motion CSS is self-contained. Omit when the parent reka
   * `*Content` already exposes `data-state` and you rely on reka's own state
   * (the motion CSS matches an ancestor `[data-state]` too).
   */
  state?: 'open' | 'closed'
}>()

defineSlots<{ default?: () => any }>()

// The standard elevated floating-panel shell. Kept verbatim in sync with the
// selection family's `content-body` so every popover surface shares one look.
// Consumer `class` (layout) auto-merges after this.
const shellClass =
  'overflow-hidden rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5 will-change-[opacity]'
</script>
