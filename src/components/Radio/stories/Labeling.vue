<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Radio } from 'frappe-ui'

const plan = ref('pro')
const showError = ref(false)

const error = computed(() => (showError.value ? 'Please choose a plan.' : ''))
</script>

<template>
  <div class="flex gap-8 items-start">
    <Radio
      v-model="plan"
      name="plan"
      value="pro"
      label="Pro plan"
      description="Billed annually."
      :error="error"
    />
    <div
      class="flex flex-col gap-2 items-start border-l border-outline-gray-2 pl-6"
    >
      <Checkbox v-model="showError" label="show error" />
    </div>
  </div>
</template>
