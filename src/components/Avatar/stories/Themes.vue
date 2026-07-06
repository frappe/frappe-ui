<script setup lang="ts">
import { Avatar } from 'frappe-ui'
import type { AvatarTheme } from 'frappe-ui'

const themes: AvatarTheme[] = [
  'gray',
  'blue',
  'green',
  'amber',
  'red',
  'violet',
  'orange',
  'auto',
]
</script>

<template>
  <Avatar
    v-for="theme in themes"
    :key="theme"
    :label="theme === 'auto' ? 'Jane Doe' : theme"
    :theme="theme"
    size="lg"
  />
</template>
