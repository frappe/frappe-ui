<script setup lang="ts">
import { Rating } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Rating label="Default" :model-value="3" />
    <Rating label="Required" required :model-value="3" />
    <Rating label="Read-only" readonly :model-value="3" />
    <Rating
      label="With error"
      error="Please rate before submitting."
      :model-value="3"
    />
  </div>
</template>
