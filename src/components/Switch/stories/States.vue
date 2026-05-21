<script setup lang="ts">
import { Switch } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start">
    <Switch label="Default" />
    <Switch label="Required" required />
    <Switch label="Disabled" disabled />
    <Switch label="With error" error="You must enable this to continue." />
  </div>
</template>
