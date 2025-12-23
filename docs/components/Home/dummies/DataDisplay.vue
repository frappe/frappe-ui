<template>
  <div class="p-3 grid grid-cols-3 gap-2">
    <div
      class="rounded bg-surface-cards dark:bg-surface-cards p-2 flex flex-col gap-2 shadow-lg dark:shadow-none "
      v-for="_ in 3"
    >
      <div class="h-2 w-8 rounded bg-surface-gray-2" />
      <div class="h-2 w-full rounded bg-surface-gray-2" />
      <div class="h-3 w-full rounded bg-surface-gray-2" />
      <div class="h-3 w-full rounded bg-surface-gray-2" />
    </div>
  </div>
</template>
