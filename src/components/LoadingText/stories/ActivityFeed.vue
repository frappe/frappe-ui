<script setup lang="ts">
import { LoadingText } from 'frappe-ui'
</script>

<template>
  <div class="w-80 rounded-6 border border-outline-gray-1 bg-surface-base">
    <div class="border-b border-outline-gray-1 px-4 py-3">
      <div class="text-base-medium text-ink-gray-8">Activity</div>
    </div>
    <div class="px-4 py-6">
      <LoadingText text="Loading activity..." />
    </div>
  </div>
</template>
