<script setup lang="ts">
import { Button, KeyboardShortcut, Tooltip } from 'frappe-ui'
</script>

<template>
  <Tooltip>
    <template #content>
      <span class="flex items-center gap-1">
        Search
        <KeyboardShortcut bg combo="Mod+K" class="px-1" />
      </span>
    </template>
    <Button icon="lucide-search" aria-label="Search" />
  </Tooltip>
</template>
