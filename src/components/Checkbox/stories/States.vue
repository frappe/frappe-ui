<script setup lang="ts">
import { Checkbox } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start">
    <Checkbox label="Default" />
    <Checkbox label="Required" required />
    <Checkbox label="Disabled" disabled />
    <Checkbox label="With error" error="Required to continue." />
  </div>
</template>
