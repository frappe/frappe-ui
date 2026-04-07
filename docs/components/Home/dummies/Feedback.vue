<template>
  <div class="flex justify-center p-5">
    <div class="flex flex-col gap-3">
      <div
        class="flex w-32 items-center gap-2 rounded border border-outline-gray-3 bg-surface-cards p-2 shadow-lg dark:shadow-none"
      >
        <div class="flex w-full">
          <span class="mb-1 h-1.5 w-1/2 rounded-l bg-gray-500" />
          <span class="mb-1 h-1.5 w-full rounded-r bg-surface-gray-4" />
        </div>
      </div>

      <div
        class="border-surface-gray-3 flex w-32 items-center gap-2 rounded border bg-surface-cards p-2 shadow-lg dark:shadow-none"
      >
        <div class="h-2 w-2 flex-shrink-0 rounded-full bg-green-400/40" />
        <div class="flex-1">
          <div class="mb-1 h-1.5 w-full rounded bg-surface-gray-3" />
          <div class="h-1.5 w-3/4 rounded bg-surface-gray-3" />
        </div>
      </div>

      <div
        class="border-surface-gray-3 flex w-32 items-center gap-2 rounded border bg-surface-cards p-2 shadow-lg dark:shadow-none"
      >
        <div class="h-2 w-2 flex-shrink-0 rounded-full bg-red-400/40" />
        <div class="flex-1">
          <div class="mb-1 h-1.5 w-full rounded bg-surface-gray-3" />
          <div class="h-1.5 w-2/3 rounded bg-surface-gray-3" />
        </div>
      </div>
    </div>
  </div>
</template>
