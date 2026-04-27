<script setup lang="ts">
import { TextInput } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start w-full max-w-sm">
    <TextInput size="sm" placeholder="Small" />
    <TextInput size="md" placeholder="Medium" />
    <TextInput size="lg" placeholder="Large" />
    <TextInput size="xl" placeholder="Extra large" />
  </div>
</template>
