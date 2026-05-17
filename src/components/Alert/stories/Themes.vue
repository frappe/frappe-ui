<script setup>
import { Alert } from 'frappe-ui'
const themes = ['green', 'yellow', 'red', 'blue']
</script>

<template>
  <div class="grid grid-cols-2">
    <Alert
      v-for="theme in themes"
      title="Source successfully added"
      description="Discover the new feature to enhance your experience.
      See how it can help you."
      :theme
    />
  </div>
</template>
