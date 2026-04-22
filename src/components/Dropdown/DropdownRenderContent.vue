<script setup lang="ts">
defineProps<{
  content?: any
}>()
</script>

<template>
  <component :is="{ render: () => content }" />
</template>
