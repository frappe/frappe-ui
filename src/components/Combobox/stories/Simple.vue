<script setup lang="ts">
import { Combobox } from 'frappe-ui'
import { ref } from 'vue'

const value = ref('')

const options = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith']
</script>

<template>
  <Combobox v-model="value" :options="options" placeholder="Select an option" show-cancel />

  <div class="text-sm text-gray-600">Selected: {{ value || 'None' }}</div>
</template>
