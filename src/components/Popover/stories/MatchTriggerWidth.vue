<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover match-trigger-width>
    <template #trigger>
      <Button class="w-64">Wide trigger</Button>
    </template>
    <template #default>
      <div class="p-3 text-p-sm text-ink-gray-7">
        The content's min-width matches the trigger width.
      </div>
    </template>
  </Popover>
</template>
