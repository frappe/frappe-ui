<script setup lang="ts">
import { DateTimePicker } from 'frappe-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <DateTimePicker v-model="value" placeholder="Select Date & time" label="Label" />

  <div class="mt-2 text-sm text-gray-600">Selected: {{ value || 'None' }}</div>
</template>
