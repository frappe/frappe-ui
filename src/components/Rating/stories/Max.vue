<script setup lang="ts">
import { Rating } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Rating :model-value="3" :max="5" label="5 stars" />
    <Rating :model-value="6" :max="10" label="10 stars" />
  </div>
</template>
