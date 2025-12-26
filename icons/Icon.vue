<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{ name: string }>()

onMounted(() => {
  if (!document.getElementById('lucide-sprite')) {
    console.warn(
      'Lucide sprite not found! Make sure to use the spritePlugin.'
    )
  }
})
</script>

<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <use :href="`#${props.name}`" />
  </svg>
</template>
