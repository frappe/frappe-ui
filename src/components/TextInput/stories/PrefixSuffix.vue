<script setup lang="ts">
import { Avatar, TextInput } from 'frappe-ui'
</script>

<template>
  <TextInput placeholder="Search...">
    <template #prefix>
      <span class="lucide-search size-4 text-ink-gray-6" />
    </template>
  </TextInput>

  <TextInput placeholder="Amount">
    <template #suffix>
      <span class="text-p-sm text-ink-gray-6">USD</span>
    </template>
  </TextInput>

  <TextInput placeholder="Display name">
    <template #prefix>
      <Avatar
        size="sm"
        image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
      />
    </template>
  </TextInput>
</template>
