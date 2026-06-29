<script setup lang="ts">
import { Button, useTheme } from 'frappe-ui'

// The full ThemeSwitcher is for settings panels; in a header, sidebar, or menu
// you usually want a single labelled button. Build it from the same `useTheme`
// composable so both controls drive the one `<html data-theme>`. Drops straight
// into a frappe-ui sidebar.
const { currentTheme, toggleTheme } = useTheme()
</script>

<template>
  <Button @click="toggleTheme">
    Toggle theme
    <template #prefix>
      <LucideSun
        v-if="currentTheme === 'dark'"
        class="size-4"
      />
      <LucideMoon
        v-else
        class="size-4"
      />
    </template>
  </Button>
</template>
