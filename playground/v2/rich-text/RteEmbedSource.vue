<script setup lang="ts">
// Figma: espresso-2.0 › Embed (32354:128183) — the card an embed slot
// raises, and "Replace" on an embed's menu (embed-link new, 32354:128789):
// 380 across on a 12px radius under the xl shadow, 8px over its tab row
// and 14 under its last line, 16 between, 16 in from either side. The
// file draws Upload and Library beside the one tab here; those are a
// picture's ways in (RteImageSource), and an embed has only its link.
//
// The link is read before it is taken: the editor turns away anything
// but http(s) and anything off its allowlist (iframe-allowlist.ts), and
// says so under the field in place of the hint.
import { computed, ref } from 'vue'
import { Button, TextInput } from '../../../src'
import {
  processEmbedUrl,
  calculateAspectRatio,
  validateIframeUrl,
} from '../../../src/molecules/editor/extensions/iframe'

const props = defineProps<{
  /** the editor's own allowlist, when it has one of its own */
  allowlist?: readonly string[]
  /** the link already in place, when one is being replaced */
  initial?: string
}>()

const emit = defineEmits<{
  link: [{ src: string; aspectRatio: number }]
  close: []
}>()

const url = ref(props.initial ?? '')
const error = ref('')

const HINT =
  'Works with links of PDFs, Google Drive, Google Maps, Codepen, Figma, Notion etc.'
const hint = computed(() => error.value || HINT)

function embed() {
  const raw = url.value.trim()
  if (!raw) return
  const src = processEmbedUrl(raw)
  if (!validateIframeUrl(src, { allowlist: props.allowlist })) {
    error.value = 'That link is not one the editor can embed'
    return
  }
  error.value = ''
  emit('link', { src, aspectRatio: calculateAspectRatio(src).ratio })
}
</script>

<template>
  <div
    class="rte-source flex w-[380px] flex-col gap-4 rounded-6 bg-surface-elevation-2 pb-3.5 pt-2 shadow-xl"
  >
    <div
      class="flex h-7 items-center gap-6 border-b border-outline-gray-1 px-4"
    >
      <button
        type="button"
        class="rte-source-tab is-on text-ink-gray-8"
        aria-selected="true"
        role="tab"
      >
        Embed link
      </button>
      <button
        type="button"
        class="ml-auto flex size-6 items-center justify-center rounded-4 text-ink-gray-5 hover:bg-surface-gray-2"
        aria-label="Close"
        @click="emit('close')"
      >
        <span class="lucide-x size-3.5" aria-hidden="true" />
      </button>
    </div>
    <form class="flex flex-col gap-4 px-4" @submit.prevent="embed">
      <TextInput
        v-model="url"
        placeholder="https://www.youtube.com/@frappetech"
        autofocus
        @input="error = ''"
        @keydown.enter.prevent="embed"
      />
      <div class="flex flex-col gap-2">
        <Button type="submit" variant="solid" size="md" class="w-full">
          Embed link
        </Button>
        <p
          class="text-center text-[13px] leading-[1.5] tracking-[0.015em]"
          :class="error ? 'text-ink-red-4' : 'text-ink-gray-6'"
        >
          {{ hint }}
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* the tab in hand takes the rule's place: a 2px ink-gray-8 line the width
   of the word, one pixel over the card's rule */
.rte-source-tab {
  position: relative;
  height: 100%;
  font-size: 14px;
  line-height: 16px;
}
.rte-source-tab.is-on::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 2px;
  background: var(--ink-gray-8);
}
</style>
