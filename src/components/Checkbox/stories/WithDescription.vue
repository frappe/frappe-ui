<script setup lang="ts">
import { reactive } from 'vue'
import { Checkbox } from 'frappe-ui'

const settings = reactive({
  roundToInteger: false,
  removeIfZero: false,
})

const helperText =
  'If enabled, the value specified or calculated in this component will not contribute to the earnings or deductions. However, its value can be referenced by other components that can be added or deducted.'
</script>

<template>
  <div class="flex flex-col gap-3 items-start w-[28rem]">
    <Checkbox
      v-model="settings.roundToInteger"
      label="Round to the nearest integer"
      :description="helperText"
    />
    <Checkbox
      v-model="settings.removeIfZero"
      label="Remove if zero valued"
      :description="helperText"
    />
  </div>
</template>
