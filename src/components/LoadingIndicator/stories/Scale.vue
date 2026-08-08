<script setup lang="ts">
import { LoadingIndicator } from 'frappe-ui'
</script>

<template>
  <div class="flex items-center gap-6">
    <LoadingIndicator :scale="50" />
    <LoadingIndicator :scale="100" />
    <LoadingIndicator :scale="200" />
  </div>
</template>
