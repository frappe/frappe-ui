<script setup lang="ts">
const bars = [22, 36, 28, 44, 30, 52, 34, 40, 26, 48, 32, 44, 28];
</script>

<template>
  <div
    class="p-3 bg-surface-gray-1 rounded-t flex items-end gap-6 overflow-hidden"
  >
    <div class="flex items-end gap-2 w-full bg-surface-cards p-4 pt-8 rounded">
      <div
        v-for="(h, i) in bars"
        :key="i"
        class="w-[10px] rounded-sm bg-surface-gray-4"
        :style="{ height: `${h * 2}px` }"
      />
    </div>
  </div>
</template>

