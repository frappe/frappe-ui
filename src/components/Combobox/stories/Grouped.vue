<script setup lang="ts">
import { Combobox } from 'frappe-ui'
import { ref } from 'vue'

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
  {
    group: 'Proteins',
    options: [
      { label: 'Chicken', value: 'chicken', icon: '🍗' },
      { label: 'Fish', value: 'fish', icon: '🐟' },
      { label: 'Beef', value: 'beef', icon: '🥩' },
      { label: 'Tofu', value: 'tofu', icon: '🪤', disabled: true },
    ],
  },
]
</script>

<template>
  <Combobox v-model="value" :options="options" placeholder="Pick an item" />
</template>
