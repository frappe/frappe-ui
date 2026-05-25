<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

const value = ref(3.5)
</script>

<template>
  <Rating v-model="value" :step="0.5" label="Half-star rating" />
</template>
