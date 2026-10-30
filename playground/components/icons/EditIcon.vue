<script setup lang="ts">
/**
 * Espresso's `icon/line/edit`, traced from the data grid's action cell
 * (node 34900:31853) — a 14px mark in a 16px box, so the 32 viewBox is drawn
 * at 2x. The square is open at its top-right corner and the pen runs out
 * through the gap; lucide's `square-pen` closes the square and keeps the pen
 * inside it, which reads as a different mark at 16px.
 *
 * The fill is `currentColor`, so the colour comes from a class the way it
 * does on every other glyph here. The file draws this one in ink-gray-9.
 */
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="size-4 shrink-0"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5 9C5 6.79086 6.79086 5 9 5H17C17.5523 5 18 4.55228 18 4C18 3.44772 17.5523 3 17 3H9C5.68629 3 3 5.68629 3 9V23C3 26.3137 5.68629 29 9 29H23C26.3137 29 29 26.3137 29 23V15C29 14.4477 28.5523 14 28 14C27.4477 14 27 14.4477 27 15V23C27 25.2091 25.2091 27 23 27H9C6.79086 27 5 25.2091 5 23V9ZM28.2509 5.16892C28.6414 4.77839 28.6414 4.14523 28.2509 3.7547C27.8604 3.36418 27.2272 3.36418 26.8367 3.7547L13.3723 17.2191C12.9818 17.6096 12.9818 18.2428 13.3723 18.6333C13.7629 19.0238 14.396 19.0238 14.7865 18.6333L28.2509 5.16892Z"
      fill="currentColor"
    />
  </svg>
</template>
