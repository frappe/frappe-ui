<script setup lang="ts">
import { ErrorMessage } from 'frappe-ui'
import { ref } from 'vue'

const message = ref('Invalid value')
</script>

<template>
  <ErrorMessage :message="message" />
</template>
