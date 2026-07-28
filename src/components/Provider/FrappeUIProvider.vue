<template>
  <ConfigProvider :dir="dir">
    <slot />
    <Dialogs />
    <ToastProvider />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { computed, onMounted, ref } from 'vue'
import Dialogs from '../Dialogs.vue'
import ToastProvider from '../Toast/ToastProvider.vue'

const props = defineProps<{
  /** Direction for all reka-ui primitives. Defaults to the document's dir. */
  dir?: 'rtl' | 'ltr'
}>()

// reka-ui resolves every primitive's direction through useDirection(), which
// falls back to 'ltr' when no ConfigProvider is present — and some primitives
// write that value to the DOM as a real dir attribute (ScrollAreaRoot does),
// which then overrides <html dir="rtl"> for their whole subtree.
//
// The document is read in onMounted rather than during setup for two reasons:
// setup() also runs on the server during VitePress static generation, where
// there is no document; and reading it during the client's first render would
// disagree with the server's markup and trip a hydration mismatch on exactly
// those primitives that write dir. Deferring keeps the first client render
// identical to the server's, then corrects it in the same flush.
//
// An SSR'd RTL app should pass `dir` explicitly so the server emits the right
// direction to begin with — the document cannot be sniffed there.
const documentDir = ref<'rtl' | 'ltr'>('ltr')
onMounted(() => {
  documentDir.value = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
})

const dir = computed<'rtl' | 'ltr'>(() => props.dir ?? documentDir.value)
</script>
