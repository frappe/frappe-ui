<script setup lang="ts">
import { Rating } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Rating size="sm" :model-value="3" label="Small" />
    <Rating size="md" :model-value="3" label="Medium" />
    <Rating size="lg" :model-value="3" label="Large" />
    <Rating size="xl" :model-value="3" label="Extra large" />
  </div>
</template>
