<script setup lang="ts">
import { TextInput } from 'frappe-ui'
</script>

<template>
  <TextInput placeholder="acme" required>
    <template #label="{ required }">
      <span class="font-semibold">Workspace name</span>
      <span v-if="required" class="text-ink-red-3">*</span>
    </template>
    <template #description>
      <span class="italic">Lowercase letters and dashes only.</span>
    </template>
  </TextInput>
</template>
