<template>
  <ConfigProvider :dir="dir">
    <slot />
    <Dialogs />
    <ToastProvider />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { computed } from 'vue'
import Dialogs from '../Dialogs.vue'
import ToastProvider from '../Toast/ToastProvider.vue'

const props = defineProps<{
  /** Direction for all reka-ui primitives. Defaults to the document's dir. */
  dir?: 'rtl' | 'ltr'
}>()

// reka-ui resolves every primitive's direction through useDirection(), which
// falls back to 'ltr' when no ConfigProvider is present — and some primitives
// write that value to the DOM as a real dir attribute (ScrollAreaRoot does),
// which then overrides <html dir="rtl"> for their whole subtree. Seeding the
// provider from the document keeps RTL apps correct without every call site
// having to pass `dir` down.
// The document is guarded because setup() also runs on the server during
// VitePress static generation; an SSR'd RTL app should pass `dir` explicitly
// rather than rely on the sniff. Same shape as Tabs.vue.
const dir = computed<'rtl' | 'ltr'>(
  () =>
    props.dir ??
    (typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
      ? 'rtl'
      : 'ltr'),
)
</script>
