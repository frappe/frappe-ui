<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const active = ref(0)
let timer: number

onMounted(() => {
  timer = window.setInterval(() => {
    active.value = (active.value + 1) % 3
  }, 500)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="grid p-6 px-20">
    <div class="m-auto flex w-full items-center gap-1 rounded-sm bg-surface-gray-4 p-1">
      <div
        v-for="(_, i) in 3"
        :key="i"
        class="h-3 w-full rounded-sm transition-all duration-500 ease-in-out"
        :class="active === i ? 'bg-surface-white' : 'bg-surface-gray-2'"
      />
    </div>

    <div
      class="mt-2 flex w-full animate-pulse items-center rounded bg-surface-gray-4 p-5 dark:bg-surface-gray-3"
    />
  </div>
</template>
