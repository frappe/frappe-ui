<script setup lang="ts">
import { Rating } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Rating size="xs" :model-value="3" label="Extra small" />
    <Rating size="sm" :model-value="3" label="Small" />
    <Rating size="md" :model-value="3" label="Medium" />
    <Rating size="lg" :model-value="3" label="Large" />
  </div>
</template>
