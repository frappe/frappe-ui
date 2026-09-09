<script setup lang="ts">
import { TextInput } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 w-full max-w-sm">
    <TextInput size="xs" placeholder="Extra small" />
    <TextInput size="sm" placeholder="Small" />
    <TextInput size="md" placeholder="Medium" />
    <TextInput size="lg" placeholder="Large" />
  </div>
</template>
