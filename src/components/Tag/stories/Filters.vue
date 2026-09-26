<script setup>
import { ref } from 'vue'
import { Button, Tag } from 'frappe-ui'

const initial = [
  { id: 'status', label: 'Status: Open', theme: 'blue' },
  { id: 'priority', label: 'Priority: High', theme: 'red' },
  { id: 'owner', label: 'Owner: Me', theme: 'gray' },
  { id: 'label', label: 'Label: Billing', theme: 'violet' },
]
const filters = ref([...initial])

function remove(id) {
  filters.value = filters.value.filter((f) => f.id !== id)
}
</script>

<template>
  <div class="flex min-h-7 flex-wrap items-center gap-1.5">
    <Tag
      v-for="filter in filters"
      :key="filter.id"
      :theme="filter.theme"
      :label="filter.label"
      variant="subtle"
      dismissible
      @dismiss="remove(filter.id)"
    />
    <Button
      v-if="filters.length < initial.length"
      variant="ghost"
      size="sm"
      label="Reset"
      @click="filters = [...initial]"
    />
  </div>
</template>
