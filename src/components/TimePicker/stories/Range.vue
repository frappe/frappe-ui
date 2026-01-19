<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'
const val = ref()
</script>

<template>
  <TimePicker
    v-model="val"
    minTime="05:00"
    maxTime="09:00"
    :interval="10"
  />
  <div class="text-xs text-gray-500">Value: {{ val }}</div>
</template>
