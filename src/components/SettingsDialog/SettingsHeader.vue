<template>
  <!--
    Fixed (non-scrolling) header region of a panel. The border is always
    there, transparent, so it takes no space when it appears. It sits inside
    the side padding to line up with the rows below.
  -->
  <div class="shrink-0 px-[4.4rem] pt-10">
    <div
      class="border-b border-transparent pb-4 transition-colors data-[scrolled]:border-outline-gray-2"
      :data-scrolled="scrolled || undefined"
    >
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
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { settingsPanelScrolledKey } from './context'

defineProps<{
  /** Convenience heading. Omit and use the default slot for a custom header. */
  title?: string
  /** Optional sub-heading under the title. */
  description?: string
}>()

const scrolled = inject(settingsPanelScrolledKey, ref(false))

defineSlots<{
  /** Replaces the entire header (title/description/actions) with custom content. */
  default?: () => any
  /** Actions on the right of the default title header. */
  actions?: () => any
}>()
</script>
