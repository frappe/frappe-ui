<script setup lang="ts">
let bars = [22, 36, 28, 44, 30, 52, 34, 40, 26, 48, 32, 44, 28]
// bars = [...bars,...bars]
</script>

<template>
  <div class="flex items-end gap-6 overflow-hidden p-3">
    <div
      class="flex w-full items-end gap-2 overflow-hidden rounded bg-surface-cards p-4 pt-8 shadow-lg dark:shadow-none"
    >
      <div
        v-for="(h, i) in bars"
        :key="i"
        class="min-w-[10px] rounded-sm bg-surface-gray-4"
        :style="{ height: `${h * 2}px` }"
      />
    </div>
  </div>
</template>
