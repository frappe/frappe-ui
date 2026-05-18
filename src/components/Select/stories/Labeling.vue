<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Select } from 'frappe-ui'

const value = ref('')
const required = ref(true)
const showError = ref(false)

const error = computed(() =>
  showError.value ? 'Please choose a fruit.' : '',
)

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]
</script>

<template>
  <div class="w-full flex gap-8 items-start">
    <Select
      v-model="value"
      :options="options"
      label="Favourite fruit"
      description="We'll pick a default for you when you don't choose."
      :error="error"
      :required="required"
      placeholder="Pick one"
      class="w-72"
    />
    <div
      class="flex flex-col gap-2 items-start border-l border-outline-gray-2 pl-6"
    >
      <Checkbox v-model="required" label="required" />
      <Checkbox v-model="showError" label="show error" />
    </div>
  </div>
</template>
