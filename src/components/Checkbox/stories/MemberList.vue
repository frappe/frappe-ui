<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, MultiSelect } from 'frappe-ui'

const selected = ref<string[]>([])

const members = [
  { value: 'aaron-menezes', label: 'Aaron Menezes' },
  { value: 'vaani-kapoor', label: 'Vaani Kapoor' },
  { value: 'daniel-kapoor', label: 'Daniel Kapoor' },
  { value: 'steven-james', label: 'Steven James' },
  { value: 'dipen-gala', label: 'Dipen Gala' },
]
</script>

<template>
  <MultiSelect
    v-model="selected"
    :options="members"
    placeholder="Select members"
    class="w-64"
  >
    <template #item-prefix="{ item }">
      <Avatar :label="item.label" size="sm" />
    </template>
  </MultiSelect>
</template>
