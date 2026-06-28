<script setup lang="ts">
import Skeleton from './Skeleton.vue'
</script>

<template>
  <Story title="Skeleton" :layout="{ type: 'grid', width: '100%' }">
    <div class="space-y-8 p-8">
      <!-- Size and shape are controlled by the consumer via utility classes -->
      <div class="space-y-3">
        <Skeleton class="h-5 w-48" />
        <Skeleton class="h-5 w-72" />
        <Skeleton class="h-5 w-60" />
      </div>

      <!-- Avatar + lines -->
      <div class="flex items-center gap-3">
        <Skeleton class="size-10 rounded-full" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-4 w-40" />
          <Skeleton class="h-4 w-24" />
        </div>
      </div>

      <!-- Card -->
      <div class="max-w-md space-y-4">
        <Skeleton class="h-48 w-full rounded-lg" />
        <Skeleton class="h-5 w-3/5" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-4/5" />
      </div>
    </div>
  </Story>
</template>
