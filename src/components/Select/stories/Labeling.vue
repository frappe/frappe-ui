<script setup lang="ts">
import { computed, ref } from 'vue'
import { Select } from 'frappe-ui'

const value = ref('')

// Starts empty so the error shows on load. Picking an option clears it and
// the description takes the slot back — the error always wins while it's set.
const error = computed(() => (value.value ? '' : 'Please choose a fruit.'))

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]
</script>

<template>
  <Select
    v-model="value"
    :options="options"
    label="Favourite fruit"
    description="We'll pick a default for you when you don't choose."
    :error="error"
    required
    placeholder="Pick one"
    class="w-72"
  />
</template>
