<script setup>
import { KeyboardShortcut } from 'frappe-ui'
</script>

<template>
  <div class="flex items-center gap-6">
    <KeyboardShortcut combo="Mod+K" />
    <KeyboardShortcut combo="Mod+Shift+K" bg />
    <KeyboardShortcut combo="Mod+Backspace" :alt-combos="['Delete']" bg />
  </div>
</template>
