<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

const value = ref(0)
</script>

<template>
  <Rating v-model="value" label="Rate this article" />
</template>
