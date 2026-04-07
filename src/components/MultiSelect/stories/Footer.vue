<script setup lang="ts">
import { Button, MultiSelect } from 'frappe-ui'
import { ref } from 'vue'
import LucideCheck from '~icons/lucide/check-check'
import LucideTrash from '~icons/lucide/trash-2'

const state = ref()

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
  <MultiSelect :options="options" v-model="state">
    <template #footer="{ clearAll, selectAll }">
      <div class="my-2 flex justify-between">
        <Button theme="red" @click="clearAll">
          <template #prefix>
            <LucideTrash class="size-4" />
          </template>
          Clear All
        </Button>

        <Button @click="selectAll">
          <template #prefix>
            <LucideCheck class="size-4" />
          </template>
          Select All
        </Button>
      </div>
    </template>
  </MultiSelect>
</template>
