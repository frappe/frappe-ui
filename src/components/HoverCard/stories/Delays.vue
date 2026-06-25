<script setup lang="ts">
import { Button, HoverCard } from 'frappe-ui'
</script>

<template>
  <HoverCard :hover-delay="0.1" :leave-delay="0.5">
    <template #trigger>
      <Button>Hover me</Button>
    </template>
    <template #default>
      <div class="p-3 text-p-sm text-ink-gray-7">
        Opens after 0.1s, closes 0.5s after the pointer leaves.
      </div>
    </template>
  </HoverCard>
</template>
