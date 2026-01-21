<script setup lang="ts">
const classNames = [
  "shadow-none",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
];
</script>

<template>
  <div class="grid grid-cols-3 gap-6 mt-10">
    <div v-for="item in classNames" class="grid gap-3">
      <span>{{ item }} </span>

      <div
        :class="item"
        class="rounded border grid gap-3 p-3 bg-surface-cards h-20"
      >
      </div>
    </div>
  </div>
</template>
