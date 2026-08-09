<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const filter = ref('discussions')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Discussions', value: 'discussions' },
  { label: 'Tasks', value: 'tasks' },
]
</script>

<template>
  <TabButtons v-model="filter" :options="filters" />
</template>
