<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover trigger="hover" :hover-delay="0.5">
    <template #target>
      <Button>Hover me</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-ink-gray-9">Popover content</div>
    </template>
  </Popover>
</template>
