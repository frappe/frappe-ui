<script setup lang="ts">
import { TimePicker } from 'frappe-ui'
import { ref } from 'vue'
const val = ref()
</script>

<template>
  <TimePicker v-model="val" minTime="05:00" maxTime="09:00" :interval="10" />
  <div class="text-xs text-gray-500">Value: {{ val }}</div>
</template>
