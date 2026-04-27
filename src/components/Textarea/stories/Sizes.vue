<script setup lang="ts">
import { Textarea } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start w-full max-w-sm">
    <Textarea size="sm" label="Small" placeholder="Write something..." />
    <Textarea size="md" label="Medium" placeholder="Write something..." />
    <Textarea size="lg" label="Large" placeholder="Write something..." />
    <Textarea size="xl" label="Extra large" placeholder="Write something..." />
  </div>
</template>
