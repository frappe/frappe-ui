<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect } from 'frappe-ui'

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
  <MultiSelect
    v-model="state"
    :options="options"
    placeholder="Select fruit"
    class="w-64"
  />
</template>
