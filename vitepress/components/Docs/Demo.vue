<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from 'frappe-ui'

interface ComponentPreviewProps {
  name: string
  // Break the preview out of the prose column — see the `.preview-wide`
  // comment below for the rule it comes with.
  wide?: boolean
  // The demo lays itself out: the frame keeps a modest inset but drops the
  // centering. For demos that render their own card chrome (charts).
  selfLayout?: boolean
}

const props = defineProps<ComponentPreviewProps>()

const expanded = ref(false)

// The editor renders its own `prose prose-v3` content, but Tailwind Typography's
// `.not-prose` (used here to shield demos from the docs article's prose) also
// suppresses prose *inside* it — and you can't re-enable it deeper in the tree.
// So editor demos opt their preview out of `.not-prose`; every other demo keeps
// the isolation unchanged.
const isEditorDemo = computed(() => props.name?.startsWith('Editor'))
</script>

<template>
  <!-- The article's prose spaces the elements it knows; a bare div is not one
       of them, so the block would sit against the paragraph under it. -->
  <div class="my-4" :class="{ 'preview-wide': wide }">
    <div
      class="rounded-xl overflow-hidden border border-outline-gray-1 divide-y divide-outline-gray-1"
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
