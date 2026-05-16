<script setup lang="ts">
import { ref } from 'vue'
import { DateRangePicker } from 'frappe-ui'

const value = ref<string[]>([])
const dualValue = ref<string[]>([])
</script>

<template>
  <div class="flex flex-col gap-6">
    <DateRangePicker v-model="value" placeholder="Select Range" label="Label" />
    <div class="text-sm text-gray-600">
      Selected: {{ value.length ? value.join(' to ') : 'None' }}
    </div>

    <DateRangePicker
      v-model="dualValue"
      placeholder="Select Range"
      label="Dual pane"
      dual-pane
    />
    <div class="text-sm text-gray-600">
      Selected: {{ dualValue.length ? dualValue.join(' to ') : 'None' }}
    </div>
  </div>
</template>
