<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from 'frappe-ui'

interface ComponentPreviewProps {
  name: string
  wide?: boolean
  // For demos that draw their own card chrome.
  selfLayout?: boolean
}

const props = defineProps<ComponentPreviewProps>()

const expanded = ref(false)

// Tailwind Typography cannot re-enable prose inside `.not-prose`, which every
// preview uses to shield itself from the article. Editor demos render their own
// prose content, so they opt out of it.
const isEditorDemo = computed(() => props.name?.startsWith('Editor'))
</script>

<template>
  <div class="my-4" :class="{ 'preview-wide': wide }">
    <div
      class="rounded-7 overflow-hidden border border-outline-gray-1 divide-y divide-outline-gray-1"
    >
      <div
        :class="[
          isEditorDemo ? '' : 'not-prose',
          'bg-surface-base overflow-x-auto scrollbar min-h-[200px]',
          selfLayout
            ? 'p-4'
            : 'p-4 sm:p-8 flex flex-wrap gap-3 items-center justify-center',
        ]"
      >
        <slot />
      </div>

      <div class="component-preview-code not-prose relative">
        <div
          :class="[
            expanded
              ? ''
              : 'max-h-[80px] sm:max-h-[96px] overflow-hidden [&_.shiki]:!max-h-none [&_.shiki]:!overflow-hidden [&_.copy]:hidden',
          ]"
        >
          <slot name="code" />
        </div>

        <div
          v-if="!expanded"
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-gray-1 via-surface-gray-1/70 dark:from-surface-base dark:via-surface-base/70 to-transparent"
        />

        <div
          v-if="!expanded"
          class="absolute inset-0 flex items-center justify-center"
        >
          <Button variant="outline" @click="expanded = true">View Code</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* `wide` bleeds a preview symmetrically out of Layout's 740px prose column,
   up to the width of the page container. It reads that width off the viewport
   — 220px sidebar + 80px page padding, plus slack for a scrollbar — because
   CSS gives an element no handle on the space its parent was allotted. That
   measurement assumes the aside is gone, so a page with a wide preview must
   set `outline: false`; otherwise the bleed runs under OnThisPage. Below `lg`
   the sidebar and the prose cap are both gone, so the bleed is zero anyway. */
@media (min-width: 1024px) {
  .preview-wide {
    --preview-bleed: max(0px, min(1000px, 100vw - 320px) - 100%);
    width: calc(100% + var(--preview-bleed));
    margin-inline: calc(var(--preview-bleed) / -2);
  }
}
</style>
