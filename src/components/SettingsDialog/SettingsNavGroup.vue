<template>
  <div>
    <div
      v-if="label || $slots.label"
      class="flex h-7 items-center px-2 text-base text-ink-gray-5"
    >
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="flex flex-col gap-0.5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Group heading shown above its items. */
  label?: string
}>()
</script>
