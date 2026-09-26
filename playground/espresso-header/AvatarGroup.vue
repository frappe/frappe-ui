<template>
  <!-- Overlapping 24px avatars, each ringed in the surface colour, ending in
       an overflow count. -->
  <div class="flex items-center">
    <img
      v-for="(src, i) in images"
      :key="i"
      :src="src"
      alt=""
      class="size-6 rounded-full shadow-[0_0_0_2px_var(--surface-base)]"
      :class="i > 0 && '-ml-1'"
    />
    <span
      v-if="more"
      class="-ml-1 grid size-6 place-items-center rounded-full bg-surface-gray-2 text-base-medium text-ink-gray-7 shadow-[0_0_0_2px_var(--surface-base)]"
    >
      {{ more }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ images: string[]; more?: number }>()
</script>
