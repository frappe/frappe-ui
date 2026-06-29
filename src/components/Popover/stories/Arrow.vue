<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover arrow>
    <template #trigger>
      <Button>With arrow</Button>
    </template>
    <template #default>
      <div class="p-3 text-p-sm text-ink-gray-7">
        An arrow points back at the trigger.
      </div>
    </template>
  </Popover>
</template>
