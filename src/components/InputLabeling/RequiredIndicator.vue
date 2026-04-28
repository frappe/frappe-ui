<template>
  <template v-if="required">
    <span class="text-ink-red-3 select-none" aria-hidden="true">*</span>
    <span class="sr-only">(required)</span>
  </template>
</template>
<script setup lang="ts">
defineProps<{ required?: boolean }>()
</script>
