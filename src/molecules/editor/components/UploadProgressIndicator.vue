<script setup lang="ts">
/**
 * Upload progress pill shown over media while a file uploads: percent +
 * cancel, in the same dark-pill language as MediaToolbar. Shared by the
 * single image/video node view and the gallery dialog cells so the two
 * can't drift apart.
 *
 * Positions itself in the top-right corner of the nearest positioned
 * ancestor; only the pill itself receives pointer events.
 */
defineProps<{ percent: number }>()

const emit = defineEmits<{ (e: 'cancel'): void }>()
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 flex items-start justify-end p-0.5"
    aria-live="polite"
  >
    <div
      class="pointer-events-auto flex items-center gap-2 rounded bg-black/65 px-1.5 py-1"
    >
      <span class="tabular-nums text-sm text-white">{{ percent }}%</span>
      <button
        type="button"
        class="lucide-x size-4 p-1 text-gray-500 hover:text-white"
        aria-label="Cancel upload"
        @click.stop="emit('cancel')"
      />
    </div>
  </div>
</template>
