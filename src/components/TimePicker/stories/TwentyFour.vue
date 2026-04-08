<script setup lang="ts">
import { TimePicker } from 'frappe-ui'
import { ref } from 'vue'

const val = ref('13:30')
</script>

<template>
  <TimePicker v-model="val" :use12Hour="true" />
  <div class="text-xs text-gray-500">Value: {{ val }}</div>
</template>
