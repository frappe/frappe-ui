<script setup lang="ts">
import { Button, Tooltip } from 'frappe-ui'
</script>

<template>
  <Tooltip arrow-class="fill-surface-white" placement="top">
    <template #body>
      <div
        class="min-w-[6rem] rounded bg-surface-white px-2 py-1 text-xs text-ink-gray-9 shadow-xl"
      >
        Test
      </div>
    </template>
    <Button theme="red">Delete</Button>
  </Tooltip>
</template>
