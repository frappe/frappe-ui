<script setup lang="ts">
import { MonthPicker } from 'frappe-ui'
import { ref } from 'vue'

const val = ref('')
</script>

<template>
  <MonthPicker v-model="val" />
</template>
