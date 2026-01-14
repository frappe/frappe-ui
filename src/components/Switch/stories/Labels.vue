<script setup lang="ts">
import { Switch } from 'frappe-ui'
</script>

<template>
  <Switch
    label="Enable Notifications"
    description="Get notified when something happens."
  />
  <Switch
    label="Enable Notifications"
    icon="inbox"
    description="This has an icon."
  />

  <Switch label="This is a disabled switch" :disabled="true" />
</template>
