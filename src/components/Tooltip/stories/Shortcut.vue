<script setup lang="ts">
import { Button, KeyboardShortcut, Tooltip } from 'frappe-ui'
</script>

<template>
  <Tooltip>
    <template #content>
      <span class="flex items-center gap-2">
        Search
        <KeyboardShortcut combo="Mod+K" />
      </span>
    </template>
    <Button icon="lucide-search" aria-label="Search" />
  </Tooltip>
</template>
