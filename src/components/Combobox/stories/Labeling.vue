<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Combobox } from 'frappe-ui'

const value = ref<string | null>(null)
const required = ref(true)
const showError = ref(false)

const error = computed(() => (showError.value ? 'Please pick an option.' : ''))

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
]
</script>

<template>
  <div class="w-full flex gap-8 items-start">
    <Combobox
      v-model="value"
      :options="options"
      label="Favourite fruit"
      description="Start typing to filter."
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
