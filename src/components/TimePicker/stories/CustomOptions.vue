<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

const val = ref('09:00')

const customOptions = [
  { value: '08:00' },
  { value: '09:00' },
  { value: '09:30' },
  { value: '10:00' },
  { value: '11:15' },
  { value: '13:45' },
]
</script>

<template>
  <TimePicker
    v-model="val"
    :interval="15"
    :options="customOptions"
    :allowCustom="true"
  />

  <div class="text-xs text-gray-500">Value: {{ val }}</div>
</template>
