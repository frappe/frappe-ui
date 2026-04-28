<script setup lang="ts">
import { Password } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start w-full max-w-sm">
    <Password size="sm" placeholder="Small" />
    <Password size="md" placeholder="Medium" />
    <Password size="lg" placeholder="Large" />
    <Password size="xl" placeholder="Extra large" />
  </div>
</template>
