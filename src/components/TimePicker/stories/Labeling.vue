<script setup lang="ts">
import { TimePicker } from 'frappe-ui'
</script>

<template>
  <div class="flex w-72 flex-col gap-4 items-start">
    <TimePicker label="Default" model-value="14:30" />
    <TimePicker
      label="With description"
      description="Pick when the meeting should start."
      model-value="14:30"
    />
    <TimePicker label="Required" required model-value="14:30" />
    <TimePicker label="Disabled" disabled model-value="14:30" />
    <TimePicker
      label="With error"
      error="Please select a time."
      model-value="14:30"
    />
  </div>
</template>
