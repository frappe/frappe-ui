<script setup>
import { ref } from 'vue'
import { Avatar, Button, TabButtons } from 'frappe-ui'

const filter = ref('events')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Events', value: 'events' },
  { label: 'Tasks', value: 'tasks' },
]
</script>

<template>
  <div class="flex w-full flex-wrap items-center gap-2">
    <Button variant="ghost" label="Jun 2026" icon-right="lucide-chevron-down" />
    <div class="flex items-center">
      <Button variant="ghost" icon="lucide-chevron-left" label="Previous" />
      <Button variant="ghost" label="Today" />
      <Button variant="ghost" icon="lucide-chevron-right" label="Next" />
    </div>
    <Button label="Week" icon-right="lucide-chevron-down" />
    <TabButtons v-model="filter" :options="filters" />
    <Button
      label="Lead"
      icon-left="lucide-users"
      icon-right="lucide-chevron-down"
    />
    <Button label="Santhosh" icon-right="lucide-chevron-down">
      <template #prefix>
        <Avatar size="xs" label="Santhosh" />
      </template>
    </Button>
  </div>
</template>
