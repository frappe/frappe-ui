<script setup lang="ts">
import { ref } from 'vue'
import { Breadcrumbs, Button, ToastProvider, toast } from '../../src'
import EmailComposer from './EmailComposer.vue'
import type { Draft } from './EmailComposer.vue'
import ComposerIcon from './ComposerIcon.vue'

/**
 * The Email composer page: a 48px header with the Compose button at its
 * right end (the button is node 35722:62466 — sm, solid, the edit glyph
 * before "Compose"), and an empty stage the composer floats over, pinned
 * to the bottom-right corner 24 in from either edge.
 *
 * The header is the calendar's (node 35240:71384): 48 tall, 18 left so the
 * breadcrumb's word starts on the body's 20, 20 right, a 1px outline-gray-1
 * rule along the bottom. Nothing in the design places the button — the
 * node is the button alone — so it takes the place New takes on the
 * calendar: the last thing on the right.
 */
const open = ref(false)

/**
 * The bin closes the composer and says so in a toast, with Undo: the draft
 * as it was comes back into a fresh composer. The toasts are the library's,
 * rendered by its ToastProvider on this page.
 */
const draft = ref<Draft | null>(null)
function discarded(d: Draft) {
  toast('Draft discarded', {
    action: {
      label: 'Undo',
      onClick: () => {
        draft.value = d
        open.value = true
      },
    },
  })
}
function closed() {
  open.value = false
  draft.value = null
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <header
      class="flex h-12 shrink-0 items-center justify-between border-b border-outline-gray-1 py-2.5 pl-[18px] pr-5"
    >
      <Breadcrumbs :items="[{ label: 'Mail' }]" />
      <Button size="sm" variant="solid" label="Compose" @click="open = true">
        <template #prefix>
          <ComposerIcon name="edit" class="size-4" />
        </template>
        Compose
      </Button>
    </header>

    <!-- the stage: the composer sits in its bottom-right corner, 24 in -->
    <div class="relative min-h-0 flex-1">
      <EmailComposer
        v-if="open"
        :initial="draft"
        @close="closed"
        @discard="discarded"
      />
    </div>
    <ToastProvider />
  </div>
</template>
