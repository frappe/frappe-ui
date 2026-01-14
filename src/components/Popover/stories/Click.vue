<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover>
    <template #target="{ togglePopover }">
      <Button @click="togglePopover()">Click me</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-ink-gray-9">Popover content</div>
    </template>
  </Popover>
</template>
