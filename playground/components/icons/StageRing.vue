<script setup lang="ts">
/**
 * The stage mark the grouped table uses — a ring, not the filled disc
 * `StatusDot` draws. Traced off the file's group rows: 12px across with a 3px
 * stroke, so a 6px hole, sitting in the same 16px box as every other cell
 * glyph.
 *
 * The hole is left open rather than filled white, so a hovered or selected
 * row shows through it.
 *
 * `token` is the theme variable the ring takes its colour from, e.g.
 * `--surface-blue-6`. It is set as `color` and the stroke is `currentColor`,
 * which is the one way to reach every family: some (pink among them) have no
 * text utility, but every one has its variable.
 */
defineProps<{ token: string }>()
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    class="size-4 shrink-0"
    :style="{ color: `var(${token})` }"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="6" />
  </svg>
</template>
