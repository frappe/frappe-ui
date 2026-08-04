<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioGroup } from 'frappe-ui'

const plan = ref()
</script>

<template>
  <RadioGroup v-model="plan" label="Choose a plan" required class="w-96">
    <Radio value="free" label="Free" />
    <Radio value="pro" label="Pro" />
    <Radio value="enterprise" label="Enterprise" />
  </RadioGroup>
</template>
