<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect } from 'frappe-ui'

const value = ref<string[]>(['read', 'write'])

const options = [
  { label: 'Read', value: 'read' },
  { label: 'Write', value: 'write' },
  { label: 'Delete', value: 'delete' },
  { label: 'Share', value: 'share' },
]

// The default summary reads "2 selected" past one selection. Joining the
// labels keeps a short, fixed list readable at a glance.
function labelsFor(values: string[]) {
  return options
    .filter((o) => values.includes(o.value))
    .map((o) => o.label)
    .join(', ')
}
</script>

<template>
  <MultiSelect
    v-model="value"
    :options="options"
    placeholder="Select permissions"
    class="w-72"
  >
    <template #summary="{ summary }">
      {{ value.length ? labelsFor(value) : summary }}
    </template>
  </MultiSelect>
</template>
