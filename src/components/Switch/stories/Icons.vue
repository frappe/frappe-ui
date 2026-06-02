<script setup lang="ts">
import { Switch } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 w-80">
    <Switch
      icon="lucide-bell"
      switch-position="end"
      label="Notifications"
      class="w-full"
    />
    <Switch
      icon="lucide-mail"
      label="Email digest"
      description="A weekly summary delivered every Friday."
      class="w-full"
    />
  </div>
</template>
