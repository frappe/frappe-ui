<script setup lang="ts">
import { Textarea } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start w-full max-w-sm">
    <Textarea variant="subtle" label="Subtle" placeholder="Write something..." />
    <Textarea variant="outline" label="Outline" placeholder="Write something..." />
    <Textarea variant="ghost" label="Ghost" placeholder="Write something..." />
  </div>
</template>
