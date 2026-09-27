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

const showCode = ref(false)

// Tailwind Typography cannot re-enable prose inside `.not-prose`, which every
// preview uses to shield itself from the article. Editor demos render their own
// prose content, so they opt out of it.
const isEditorDemo = computed(() => props.name?.startsWith('Editor'))
</script>

<template>
  <div class="my-4" :class="{ 'preview-wide': wide }">
    <div class="flex flex-col gap-1.5 rounded-[20px] bg-surface-gray-1 p-1.5">
      <!-- `vp-raw` stops VitePress from taking over link clicks in a demo.
           Without it, a `<router-link>` (Tabs route mode, Breadcrumbs) would
           send the docs site to the demo's URL instead of the in-memory
           router the theme installs for demos. -->
      <div
        data-demo-preview
        :class="[
          'play-card vp-raw rounded-[14px] bg-surface-base overflow-x-auto scrollbar min-h-[200px]',
          isEditorDemo ? '' : 'not-prose',
          selfLayout
            ? 'p-4'
            : 'p-4 sm:p-8 flex flex-wrap gap-3 items-center justify-center',
        ]"
      >
        <slot />
      </div>

      <!-- Show code toggle + the full code, revealed on demand. -->
      <div class="flex flex-col items-start">
        <Button
          variant="ghost"
          :aria-expanded="showCode"
          @click="showCode = !showCode"
        >
          <template #prefix>
            <span
              class="lucide-chevron-right size-4 transition-transform"
              :class="{ 'rotate-90': showCode }"
              aria-hidden="true"
            />
          </template>
          {{ showCode ? 'Hide code' : 'Show code' }}
        </Button>

        <div
          v-if="showCode"
          class="component-preview-code not-prose relative w-full"
        >
          <slot name="code" />
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
