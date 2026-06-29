<script setup lang="ts">
import { Button, Popover } from 'frappe-ui'
</script>

<template>
  <Popover side="right" align="center">
    <template #trigger>
      <Button>Open on the right</Button>
    </template>
    <template #default>
      <div class="p-3 text-p-sm text-ink-gray-7">
        Positioned with <code>side="right"</code> and
        <code>align="center"</code>.
      </div>
    </template>
  </Popover>
</template>
