<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, MultiSelect } from 'frappe-ui'

const state = ref<string[]>([])

const img =
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=100&h=100&fit=crop'

const options = [
  { value: 'red-apple', label: 'Red Apple', img },
  { value: 'blueberry-burst', label: 'Blueberry Burst', img },
  { value: 'orange-grove', label: 'Orange Grove', img },
  { value: 'banana-split', label: 'Banana Split', img },
  { value: 'grapes-cluster', label: 'Grapes Cluster', img },
  { value: 'kiwi-slice', label: 'Kiwi Slice', img },
  { value: 'mango-fusion', label: 'Mango Fusion', img },
]
</script>

<template>
  <MultiSelect
    v-model="state"
    :options="options"
    placeholder="Select fruit"
    class="w-64"
  >
    <template #item-prefix="{ item }">
      <Avatar :image="(item as any).img" size="sm" />
    </template>
  </MultiSelect>
</template>
