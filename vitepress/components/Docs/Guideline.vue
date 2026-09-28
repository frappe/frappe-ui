<script setup lang="ts">
// One usage guideline in its own shell: a soft-shadow card holding a "do"
// example (green check) and a "don't" example (red cross), with the caption
// centered below the card. Reused across every component's Usage Guidelines
// section so they read identically. Each slot supplies its own inner spacing.
//
// The check/cross marks reuse Alert's solid status glyphs so the whole docs
// surface shares one icon set.
import SuccessSolidIcon from '../../../icons/SuccessSolidIcon.vue'
import CloseCircleSolidIcon from '../../../icons/CloseCircleSolidIcon.vue'

withDefaults(
  defineProps<{
    caption?: string
    // 'split' sets the do/don't examples side by side (compact content like
    // avatars); 'stack' places them one above the other with the mark on the
    // left (wide content like alerts).
    layout?: 'split' | 'stack'
    // Set false for a single annotated example that isn't a do/don't.
    mark?: boolean
  }>(),
  { layout: 'split', mark: true },
)
</script>

<template>
  <div class="flex flex-col gap-1.5 rounded-[20px] bg-surface-gray-1 p-1.5">
    <div
      class="play-card flex min-h-[240px] items-center justify-center rounded-[14px] bg-surface-base p-8"
    >
      <!-- Compact examples: do on the left, don't on the right, with a fixed
           gap between them so wider content (a menu, a combobox panel) never
           ends up flush against its pair. A guideline with only a "do"
           example centers it. -->
      <div
        v-if="layout === 'split'"
        class="flex items-start justify-center gap-10"
      >
        <div
          class="flex flex-col gap-4"
          :class="$slots.dont ? 'items-start' : 'items-center'"
        >
          <div class="flex min-h-10 items-center">
            <slot name="do" />
          </div>
          <SuccessSolidIcon
            v-if="mark"
            class="size-5 shrink-0 text-ink-green-5"
          />
        </div>

        <div v-if="$slots.dont" class="flex flex-col items-start gap-4">
          <div class="flex min-h-10 items-center">
            <slot name="dont" />
          </div>
          <CloseCircleSolidIcon
            v-if="mark"
            class="size-5 shrink-0 text-ink-red-5"
          />
        </div>
      </div>

      <!-- Wide examples: do above, don't below. The mark sits beside the
           example, and the rows are left-aligned inside a centered block so
           the do and don't examples line up with each other. -->
      <div v-else class="mx-auto flex w-fit flex-col gap-8">
        <div class="flex items-center gap-3">
          <SuccessSolidIcon
            v-if="mark"
            class="size-5 shrink-0 text-ink-green-5"
          />
          <div class="min-w-0">
            <slot name="do" />
          </div>
        </div>

        <div v-if="$slots.dont" class="flex items-center gap-3">
          <CloseCircleSolidIcon
            v-if="mark"
            class="size-5 shrink-0 text-ink-red-5"
          />
          <div class="min-w-0">
            <slot name="dont" />
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="caption || $slots.caption"
      class="px-2 py-1.5 text-center text-base text-ink-gray-7"
    >
      <slot name="caption">{{ caption }}</slot>
    </p>
  </div>
</template>
