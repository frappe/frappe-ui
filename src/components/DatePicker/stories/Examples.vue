<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from 'frappe-ui'

const value = ref('')
</script>

<template>
  <DatePicker v-model="value" placeholder="Select Date" label="Label" />
  <div class="mt-2 text-sm text-gray-600">Selected: {{ value || 'None' }}</div>
</template>
