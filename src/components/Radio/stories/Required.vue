<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'frappe-ui'

const plan = ref('')
</script>

<template>
  <div class="inline-flex flex-col gap-2">
    <p class="text-base font-medium text-ink-gray-8">
      Choose a plan
      <span class="text-ink-red-3 select-none" aria-hidden="true">*</span>
      <span class="sr-only">(required)</span>
    </p>
    <Radio v-model="plan" name="plan-required" value="free" label="Free" />
    <Radio v-model="plan" name="plan-required" value="pro" label="Pro" />
    <Radio
      v-model="plan"
      name="plan-required"
      value="enterprise"
      label="Enterprise"
    />
  </div>
</template>
