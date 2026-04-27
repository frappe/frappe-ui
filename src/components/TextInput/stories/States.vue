<script setup lang="ts">
import { TextInput } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start w-full max-w-sm">
    <TextInput label="Default" placeholder="Enter input" />
    <TextInput label="Required" required placeholder="Enter input" />
    <TextInput label="Disabled" disabled placeholder="Enter input" />
    <TextInput
      label="With error"
      error="This field is required."
      placeholder="Enter input"
    />
  </div>
</template>
