<script setup lang="ts">
import { ref } from 'vue'
import { Duration } from 'frappe-ui'

const value = ref<number | null>(5445)
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Duration v-model="value" size="sm" />
    <Duration v-model="value" size="md" />
    <Duration v-model="value" size="lg" />
    <Duration v-model="value" size="xl" />
  </div>
</template>
