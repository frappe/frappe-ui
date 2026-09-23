<script setup lang="ts">
import { Spinner } from 'frappe-ui'
</script>

<template>
  <div class="flex w-80 flex-col gap-2">
    <div class="flex items-center gap-2 text-sm text-ink-gray-5">
      <Spinner size="sm" track />
      Syncing 12 files
    </div>
    <div class="flex items-center gap-2 text-sm text-ink-red-7">
      <Spinner size="sm" track />
      Removing 3 members
    </div>
  </div>
</template>
