<script setup lang="ts">
import { ref } from 'vue'
import { Alert, Button } from 'frappe-ui'

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
