<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'

const value = ref('')
const options = [
  {
    label: 'Matcha Tiramisu',
    value: 'matcha-tiramisu',
  },
  {
    label: 'Strawberry Cheesecake',
    value: 'strawberry-cheesecake',
  },
  {
    label: 'Chocolate Lava Cake',
    value: 'chocolate-lava-cake',
  },
  {
    label: 'Mango Sticky Rice',
    value: 'mango-sticky-rice',
    disabled: true,
  },
  {
    label: 'Pistachio Baklava',
    value: 'pistachio-baklava',
  },
  {
    label: 'Ube Ice Cream',
    value: 'ube-ice-cream',
  },
  {
    label: 'Salted Caramel Tart',
    value: 'salted-caramel-tart',
  },
]
</script>

<template>
    <Select :options="options" v-model="value" />
    {{ value }}
</template>
