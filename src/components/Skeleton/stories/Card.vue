<script setup lang="ts">
import { Skeleton } from 'frappe-ui'
</script>

<template>
  <div class="w-64 space-y-4">
    <Skeleton class="h-40 w-full rounded-lg" />
    <Skeleton class="h-5 w-3/5" />
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-4/5" />
  </div>
</template>
