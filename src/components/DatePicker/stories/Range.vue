<script setup lang="ts">
import { ref } from 'vue'
import { DateRangePicker } from 'frappe-ui'

const value = ref('')
</script>

<template>
  <DateRangePicker v-model="value" placeholder="Select Range" label="Label" />

  <div class="mt-2 text-sm text-gray-600">Selected: {{ value || 'None' }}</div>
</template>
