<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from 'frappe-ui'

const value = ref('')
</script>

<template>
  <Textarea v-model="value" placeholder="Write something..." />
</template>
