<script setup lang="ts">
import { ref } from 'vue'
import { ErrorMessage } from 'frappe-ui'

const message = ref('Invalid value')
</script>

<template>
  <ErrorMessage :message="message" />
</template>
