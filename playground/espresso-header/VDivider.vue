<template>
  <!-- Vertical rule for toolbars: a 20px line in a 28px row, optionally with
       4px of air on each side. -->
  <div
    class="flex h-7 items-center"
    :class="inset && 'px-1'"
    aria-hidden="true"
  >
    <div class="h-5 border-l border-outline-gray-1" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ inset?: boolean }>()
</script>
