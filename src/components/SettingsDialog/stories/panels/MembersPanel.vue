<script setup lang="ts">
import { Button, SettingsPanel } from 'frappe-ui'
</script>

<template>
  <SettingsPanel
    title="Members"
    description="Invite teammates and manage their roles."
  >
    <template #actions>
      <Button variant="solid">Invite</Button>
    </template>
    <p class="text-p-base text-ink-gray-6">3 members in this workspace.</p>
  </SettingsPanel>
</template>
