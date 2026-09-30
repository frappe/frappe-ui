<script setup lang="ts">
/**
 * The view switcher's fourth glyph: dots with a line beside each — a list.
 *
 * Drawn rather than traced. The file's switcher has three tabs (node
 * 35208:100051) and no agenda among them, so this is the family carried on:
 * the same ring every other glyph is built from — 8 across, 4 hollow — with
 * a bar beside it where the grid views put another ring. Day is one ring,
 * Week three in a row, Month four in a square; a list is a ring and what it
 * says. If the file draws one later, this is the piece to replace.
 *
 * 16px in a 28px pill, `currentColor`, so the pill's own ink carries it.
 */
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="size-4 shrink-0"
    aria-hidden="true"
  >
    <circle cx="7" cy="10" r="3" stroke="currentColor" stroke-width="2" />
    <rect x="14" y="9" width="12" height="2" rx="1" fill="currentColor" />
    <circle cx="7" cy="22" r="3" stroke="currentColor" stroke-width="2" />
    <rect x="14" y="21" width="12" height="2" rx="1" fill="currentColor" />
  </svg>
</template>
