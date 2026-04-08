<script setup lang="ts">
import { Avatar, MultiSelect } from 'frappe-ui'
import { ref } from 'vue'

const state = ref()

const img = 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=100&h=100&fit=crop'

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
  <MultiSelect :options="options" v-model="state" placeholder="Select fruit">
    <template #option="{ item }">
      <Avatar :image="item.img" size="sm" class="mr-2" />
      {{ item.label }}
    </template>
  </MultiSelect>
</template>
