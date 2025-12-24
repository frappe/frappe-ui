<template>
  <div
    class="p-5 flex justify-center"
  >
    <div class="flex flex-col gap-3">
      <div
        class="shadow-lg dark:shadow-none bg-surface-cards border border-outline-gray-3 rounded p-2 w-32 flex items-center gap-2"
      >
        <div class="flex w-full">
          <span class="h-1.5 w-1/2 bg-gray-500 rounded-l mb-1" />
          <span class="h-1.5 w-full bg-surface-gray-4 rounded-r mb-1" />
        </div>
      </div>

      <div
        class="shadow-lg dark:shadow-none bg-surface-cards border border-surface-gray-3 rounded p-2 w-32 flex items-center gap-2"
      >
        <div class="h-2 w-2 bg-green-400/40 rounded-full flex-shrink-0" />
        <div class="flex-1">
          <div class="h-1.5 w-full bg-surface-gray-3 rounded mb-1" />
          <div class="h-1.5 w-3/4 bg-surface-gray-3 rounded" />
        </div>
      </div>

      <div
        class="shadow-lg dark:shadow-none  bg-surface-cards border border-surface-gray-3 rounded p-2 w-32 flex items-center gap-2"
      >
        <div class="h-2 w-2 bg-red-400/40 rounded-full flex-shrink-0" />
        <div class="flex-1">
          <div class="h-1.5 w-full bg-surface-gray-3 rounded mb-1" />
          <div class="h-1.5 w-2/3 bg-surface-gray-3 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
