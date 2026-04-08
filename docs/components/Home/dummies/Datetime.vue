<template>
  <div class="grid gap-3 p-5">
    <div
      class="flex items-center justify-between rounded-sm bg-surface-cards p-2 shadow-lg dark:shadow-none"
    >
      <div class="h-3 w-1/2 rounded bg-surface-gray-3" />
      <div class="h-4 w-4 rounded bg-surface-gray-4" />
    </div>

    <div class="grid grid-cols-7 gap-2 rounded bg-surface-cards p-3 shadow-lg dark:shadow-none">
      <div v-for="i in 14" :key="i" class="h-4 rounded-sm bg-surface-gray-3" />
    </div>
  </div>
</template>
