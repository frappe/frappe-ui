<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover :dismissible="false">
    <template #trigger>
      <Button>Stays open</Button>
    </template>
    <template #default="{ close }">
      <div class="p-3 text-ink-gray-9">
        <p class="text-p-sm">
          Clicking outside won't close this. Use the button instead.
        </p>
        <Button class="mt-2" @click="close()">Close</Button>
      </div>
    </template>
  </Popover>
</template>
