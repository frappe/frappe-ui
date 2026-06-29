<script setup lang="ts">
import { Skeleton } from 'frappe-ui'
</script>

<template>
  <div class="w-64 space-y-3">
    <div v-for="i in 4" :key="i" class="flex items-center gap-3">
      <Skeleton class="size-10 rounded-full" />
      <div class="flex-1 space-y-2">
        <Skeleton class="h-4 w-40" />
        <Skeleton class="h-4 w-24" />
      </div>
    </div>
  </div>
</template>
