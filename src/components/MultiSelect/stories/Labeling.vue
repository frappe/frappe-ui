<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, MultiSelect } from 'frappe-ui'

const value = ref<string[]>([])
const required = ref(true)
const showError = ref(false)

const error = computed(() =>
  showError.value ? 'Pick at least one fruit.' : '',
)

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
]
</script>

<template>
  <div class="flex gap-8 items-start">
    <MultiSelect
      v-model="value"
      :options="options"
      label="Favourite fruits"
      description="Pick as many as you like."
      :error="error"
      :required="required"
      placeholder="Pick some"
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
