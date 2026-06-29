<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover>
    <template #trigger>
      <Button>Click me</Button>
    </template>
    <template #default="{ close }">
      <div class="p-2 text-ink-gray-9">
        <p>Popover content</p>
        <Button class="mt-2" @click="close()">Close</Button>
      </div>
    </template>
  </Popover>
</template>
