<template>
  <!-- Fixed (non-scrolling) header region of a panel. -->
  <div class="shrink-0 px-[4.4rem] pt-10">
    <slot>
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-1">
          <h2 v-if="title" class="text-lg font-semibold text-ink-gray-8">
            {{ title }}
          </h2>
          <p v-if="description" class="text-base text-ink-gray-6">
            {{ description }}
          </p>
        </div>
        <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
          <slot name="actions" />
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Convenience heading. Omit and use the default slot for a custom header. */
  title?: string
  /** Optional sub-heading under the title. */
  description?: string
}>()

defineSlots<{
  /** Replaces the entire header (title/description/actions) with custom content. */
  default?: () => any
  /** Actions on the right of the default title header. */
  actions?: () => any
}>()
</script>
