<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

const valueBasic = ref('')
</script>

<template>
  <TimePicker
    v-model="valueBasic"
    placeholder="Select time"
    placement="bottom-start"
  />
  <div class="mt-2 text-xs text-gray-500">Value: {{ valueBasic || '—' }}</div>
</template>
