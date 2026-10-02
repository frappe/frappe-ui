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
    // left (wide content like alerts). 'bleed' shows a single page-scale
    // mockup (the "do" slot) that runs off the card's right and bottom edges,
    // cropped like a screenshot, so it reads as a real page.
    layout?: 'split' | 'stack' | 'bleed'
    // Set false for a single annotated example that isn't a do/don't.
    mark?: boolean
    // In 'stack' layout, place the mark centered below the example instead of
    // to its left. Useful for wide examples where a side mark looks stranded.
    markBelow?: boolean
  }>(),
  { layout: 'split', mark: true, markBelow: false },
)
</script>

<template>
  <div class="flex flex-col gap-1.5 rounded-[20px] bg-surface-gray-1 p-1.5">
    <div
      v-if="layout === 'bleed'"
      class="play-card h-[380px] overflow-hidden rounded-[14px] bg-surface-base pl-16 pt-12"
    >
      <slot name="do" />
    </div>
    <div
      v-else
      class="play-card flex min-h-[240px] items-center justify-center rounded-[14px] bg-surface-base p-8"
    >
      <!-- Compact examples: do on the left, don't on the right, with a fixed
           gap between them so wider content (a menu, a combobox panel) never
           ends up flush against its pair. A guideline with only a "do"
           example centers it. -->
      <!-- Two rows: the examples, then the marks. Each example is centred
           against the other in the first row, so their middles line up, and
           the marks share the second row, so they sit on one line at the
           same 16px gap from the examples as in the stacked layout. -->
      <div
        v-if="layout === 'split'"
        class="grid grid-rows-[auto_auto] items-center gap-x-10 gap-y-4"
        :class="$slots.dont ? 'justify-items-start' : 'justify-items-center'"
      >
        <div class="col-start-1 row-start-1 flex items-center">
          <slot name="do" />
        </div>
        <SuccessSolidIcon
          v-if="mark"
          class="col-start-1 row-start-2 size-5 shrink-0 text-ink-green-5"
        />
        <template v-if="$slots.dont">
          <div class="col-start-2 row-start-1 flex items-center">
            <slot name="dont" />
          </div>
          <CloseCircleSolidIcon
            v-if="mark"
            class="col-start-2 row-start-2 size-5 shrink-0 text-ink-red-5"
          />
        </template>
      </div>

      <!-- Wide examples: do above, don't below. The mark sits beside the
           example, and the rows are left-aligned inside a centered block so
           the do and don't examples line up with each other. -->
      <div v-else class="mx-auto flex w-fit flex-col gap-8">
        <div
          class="flex gap-4"
          :class="markBelow ? 'flex-col items-center' : 'items-center'"
        >
          <SuccessSolidIcon
            v-if="mark"
            class="size-5 shrink-0 text-ink-green-5"
            :class="markBelow && 'order-last'"
          />
          <div class="min-w-0">
            <slot name="do" />
          </div>
        </div>

        <div
          v-if="$slots.dont"
          class="flex gap-4"
          :class="markBelow ? 'flex-col items-center' : 'items-center'"
        >
          <CloseCircleSolidIcon
            v-if="mark"
            class="size-5 shrink-0 text-ink-red-5"
            :class="markBelow && 'order-last'"
          />
          <div class="min-w-0">
            <slot name="dont" />
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="caption || $slots.caption"
      class="mx-auto max-w-md text-balance px-2 py-1.5 text-center text-base text-ink-gray-7"
    >
      <slot name="caption">{{ caption }}</slot>
    </p>
  </div>
</template>
