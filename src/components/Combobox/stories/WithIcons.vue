<script setup lang="ts">
import { Combobox } from 'frappe-ui'
import { ref } from 'vue'

const value = ref('')

const options = [
  { label: 'Dashboard', value: 'dashboard', icon: '📊' },
  { label: 'Projects', value: 'projects', icon: '📁' },
  { label: 'Tasks', value: 'tasks', icon: '✅' },
]
</script>

<template>
  <Combobox v-model="value" :options="options" placeholder="Navigate to…" />
</template>
