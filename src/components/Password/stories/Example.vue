<script setup lang="ts">
import { Password } from 'frappe-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <Password v-model="value" placeholder="Enter password" />
</template>
