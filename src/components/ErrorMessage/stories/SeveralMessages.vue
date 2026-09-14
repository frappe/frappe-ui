<script setup lang="ts">
import { ErrorMessage } from 'frappe-ui'

const messages = [
  'Email is required',
  'Password must be at least 8 characters',
]
</script>

<template>
  <ErrorMessage :message="messages" />
</template>
