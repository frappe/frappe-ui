<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Slider } from 'frappe-ui'

const value = ref([40])
const required = ref(true)
const showError = ref(false)

const error = computed(() =>
  showError.value ? 'Please pick a value greater than 50.' : '',
)
</script>

<template>
  <div class="flex gap-8 items-start">
    <Slider
      v-model="value"
      label="Volume"
      description="Adjust the volume."
      :error="error"
      :required="required"
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
