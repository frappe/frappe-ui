<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

const value = ref('')

const options = [
  {
    group: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple', icon: '🍎' },
      { label: 'Banana', value: 'banana', icon: '🍌' },
      { label: 'Orange', value: 'orange', icon: '🍊' },
      { label: 'Grape', value: 'grape', icon: '🍇' },
    ],
  },
  {
    group: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot', icon: '🥕' },
      { label: 'Broccoli', value: 'broccoli', icon: '🥦' },
      { label: 'Tomato', value: 'tomato', icon: '🍅' },
      { label: 'Lettuce', value: 'lettuce', icon: '🥬' },
    ],
  },
]
</script>

<template>
  <Combobox v-model="value" :options="options" placeholder="Pick an item" open-on-focus class="w-72">
    <template #item-prefix="{ item }">
      <span class="text-base">{{ item.icon }}</span>
    </template>
  </Combobox>
</template>
