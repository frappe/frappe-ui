<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

const value = ref(3)
</script>

<template>
  <Rating
    v-model="value"
    clearable
    label="Click the selected star to clear"
  />
</template>
