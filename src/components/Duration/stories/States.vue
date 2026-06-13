<script setup lang="ts">
import { Duration } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Duration label="Default" :model-value="5445" />
    <Duration
      label="With description"
      description="Time spent on this task."
      :model-value="5445"
    />
    <Duration label="Required" required :model-value="5445" />
    <Duration label="Disabled" disabled :model-value="5445" />
    <Duration
      label="With error"
      error="Please enter a duration."
      :model-value="5445"
    />
  </div>
</template>
