<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const active = ref(0);
let timer: number;

onMounted(() => {
  timer = window.setInterval(() => {
    active.value = (active.value + 1) % 3;
  }, 500);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div
    class="p-6 px-20 bg-surface-gray-1 rounded-t flex justify-center flex-wrap"
  >
    <div
      class="flex items-center gap-1 bg-surface-gray-4 rounded-sm p-1 m-auto w-full"
    >
      <div
        v-for="(_, i) in 3"
        :key="i"
        class="h-3 w-full rounded-sm transition-all duration-500 ease-in-out"
        :class='active === i ? "bg-surface-white" : "bg-surface-gray-2"'
      />
    </div>

    <div
      class="
        mt-2 p-5 animate-pulse rounded flex items-center w-full bg-surface-gray-4
        dark:bg-surface-gray-3
      "
    />
  </div>
</template>
