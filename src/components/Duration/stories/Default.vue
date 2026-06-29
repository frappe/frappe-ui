<script setup lang="ts">
import { ref } from 'vue'
import { Duration } from 'frappe-ui'

const value = ref<number | null>(5445)
</script>

<template>
  <Duration v-model="value" label="Time spent" />
</template>
