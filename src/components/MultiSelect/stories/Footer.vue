<script setup lang="ts">
import { ref } from 'vue'
import { Button, MultiSelect } from 'frappe-ui'

const state = ref<string[]>([])

const options = [
  { value: 'red-apple', label: 'Red Apple' },
  { value: 'blueberry-burst', label: 'Blueberry Burst' },
  { value: 'orange-grove', label: 'Orange Grove' },
  { value: 'banana-split', label: 'Banana Split' },
  { value: 'grapes-cluster', label: 'Grapes Cluster' },
  { value: 'kiwi-slice', label: 'Kiwi Slice' },
  { value: 'mango-fusion', label: 'Mango Fusion' },
]
</script>

<template>
  <MultiSelect v-model="state" :options="options" class="w-64">
    <template #footer="{ clearAll, selectAll, selectedOptions }">
      <div
        class="flex items-center justify-between gap-2 border-t border-outline-gray-1 px-2 py-1.5"
      >
        <Button theme="red" variant="ghost" @click="clearAll">
          <template #prefix>
            <span class="lucide-trash-2 size-4" />
          </template>
          Clear ({{ selectedOptions.length }})
        </Button>

        <Button variant="ghost" @click="selectAll">
          <template #prefix>
            <span class="lucide-check-check size-4" />
          </template>
          Select All
        </Button>
      </div>
    </template>
  </MultiSelect>
</template>
