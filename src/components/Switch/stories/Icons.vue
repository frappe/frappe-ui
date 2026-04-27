<script setup lang="ts">
import { Switch } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start">
    <Switch icon="lucide-bell" label="Notifications" />
    <Switch
      icon="lucide-mail"
      label="Email digest"
      description="A weekly summary delivered every Friday."
    />
  </div>
</template>
