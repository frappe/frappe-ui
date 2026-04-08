<script setup lang="ts">
import { Alert, Button } from 'frappe-ui'
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <Button variant="solid" @click="visible = !visible"> Toggle Alert </Button>

  <Alert
    v-model="visible"
    title="Source successfully added"
    description="Discover the new feature to enhance your experience."
  />
</template>
