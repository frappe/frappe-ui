<script setup lang="ts">
import { Button, useColorScheme } from 'frappe-ui'

// The full ThemeSwitcher is for settings panels; in a header, sidebar, or menu
// you usually want a single labelled button. Build it from the same
// `useColorScheme` composable so both controls drive the one
// `<html data-theme>`. Drops straight into a frappe-ui sidebar.
const { colorScheme, toggleColorScheme } = useColorScheme()
</script>

<template>
  <Button @click="toggleColorScheme">
    Toggle theme
    <template #prefix>
      <LucideSun
        v-if="colorScheme === 'dark'"
        class="size-4"
      />
      <LucideMoon
        v-else
        class="size-4"
      />
    </template>
  </Button>
</template>
