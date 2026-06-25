<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover bare>
    <template #trigger>
      <Button>Custom surface</Button>
    </template>
    <template #default>
      <!-- bare: no panel shell, the content brings its own surface -->
      <div
        class="max-h-72 w-64 overflow-y-auto rounded-2xl bg-surface-gray-7 p-4 text-p-sm text-ink-white shadow-2xl"
      >
        This panel has no default chrome — the popover renders the content
        directly so it can use its own background, radius, and shadow.
      </div>
    </template>
  </Popover>
</template>
