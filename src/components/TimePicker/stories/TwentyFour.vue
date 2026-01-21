<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

const val = ref('13:30')
</script>

<template>
  <TimePicker v-model="val" :use12Hour="true" />
  <div class="text-xs text-gray-500">Value: {{ val }}</div>
</template>
