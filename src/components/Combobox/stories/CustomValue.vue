<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

const value = ref('')
const options = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith']
</script>

<template>
  <div class="grid gap-3">
    <Combobox
      v-model="value"
      :options="options"
      :allow-custom-value="true"
      open-on-focus
      placeholder="Type a person"
      class="w-64"
    />

    <div class="text-sm text-gray-600">Selected: {{ value || 'None' }}</div>
  </div>
</template>
