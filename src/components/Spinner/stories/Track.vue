<script setup lang="ts">
import { Spinner } from 'frappe-ui'
</script>

<template>
  <div class="flex items-center gap-6">
    <Spinner size="lg" />
    <Spinner size="lg" track />
    <Spinner size="lg" theme="red" />
    <Spinner size="lg" theme="red" track />
  </div>
</template>
