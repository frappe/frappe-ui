<script setup lang="ts">
import { TextInput } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start w-full max-w-sm">
    <TextInput variant="subtle" placeholder="Subtle" />
    <TextInput variant="outline" placeholder="Outline" />
    <TextInput variant="ghost" placeholder="Ghost" />
  </div>
</template>
