<script setup lang="ts">
import { Button, KeyboardShortcut, Tooltip } from 'frappe-ui'
</script>

<template>
  <div class="flex items-center gap-4">
    <Tooltip side="top">
      <template #content>
        <span class="flex items-center gap-1">
          Delete
          <KeyboardShortcut bg combo="Mod+Backspace" class="px-1" />
        </span>
      </template>
      <Button theme="red">Delete</Button>
    </Tooltip>

    <Tooltip side="top" bare>
      <template #content>
        <img
          src="https://frappeui.com/frappe-ui-logo.svg"
          alt="frappe-ui"
          class="size-20 rounded-4 bg-surface-white p-2 shadow-xl"
        />
      </template>
      <Button>Preview</Button>
    </Tooltip>
  </div>
</template>
