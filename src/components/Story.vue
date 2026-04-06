<script setup lang="ts">
defineProps<{
  title?: string
  previewCss?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <p v-if="title" class="text-sm font-medium text-ink-gray-5">{{ title }}</p>
    <div :class="previewCss">
      <slot />
    </div>
  </div>
</template>
