<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Checkbox, TextInput } from 'frappe-ui'

const search = ref('')
const members = ref([
  { name: 'Aaron Menezes', selected: false },
  { name: 'Vaani Kapoor', selected: true },
  { name: 'Daniel Kapoor', selected: true },
  { name: 'Steven James', selected: false },
  { name: 'Dipen Gala', selected: true },
])
</script>

<template>
  <div
    class="flex w-52 flex-col gap-2 rounded-lg border border-outline-gray-2 bg-surface-white p-1 shadow-sm"
  >
    <TextInput v-model="search" variant="subtle" placeholder="Members" />
    <div class="flex flex-col gap-0.5">
      <Checkbox
        v-for="member in members"
        :key="member.name"
        v-model="member.selected"
        variant="padded"
      >
        <template #label>
          <span class="inline-flex items-center gap-2">
            <Avatar :label="member.name" size="sm" />
            {{ member.name }}
          </span>
        </template>
      </Checkbox>
    </div>
  </div>
</template>
