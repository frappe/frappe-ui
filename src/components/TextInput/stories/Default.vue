<script setup lang="ts">
import { ref } from 'vue'
import { TextInput } from 'frappe-ui'

const value = ref('')
</script>

<template>
  <TextInput v-model="value" placeholder="Enter your name" />
</template>
