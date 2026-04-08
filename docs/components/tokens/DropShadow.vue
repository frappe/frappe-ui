<script setup lang="ts">
const classNames = ['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl']
</script>

<template>
  <div class="mt-10 grid grid-cols-3 gap-6">
    <div v-for="item in classNames" class="grid gap-3">
      <span>{{ item }} </span>

      <div :class="item" class="grid h-20 gap-3 rounded border bg-surface-cards p-3"></div>
    </div>
  </div>
</template>
