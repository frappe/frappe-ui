<template>
  <div class="p-5 grid gap-3">
    <div
      class="bg-surface-cards rounded-sm p-2 flex items-center justify-between shadow-lg dark:shadow-none"
    >
      <div class="h-3 w-1/2 bg-surface-gray-3 rounded" />
      <div class="h-4 w-4 bg-surface-gray-4 rounded" />
    </div>

    <div class="bg-surface-cards rounded p-3 grid grid-cols-7 gap-2 shadow-lg dark:shadow-none">
      <div
        v-for="i in 14"
        :key="i"
        class="h-4 rounded-sm bg-surface-gray-3"
      />
    </div>
  </div>
</template>
