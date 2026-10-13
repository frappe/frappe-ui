<template>
  <!-- Espresso 2.0 glyphs exported from Figma. Monochrome icons paint with
       `currentColor`, so tint them with a `text-ink-*` utility. The SVG fills
       the box it's given (size it with `size-*`), so a 28px app logo also sits
       true in a 16px slot such as a frappe-ui menu row's icon box. -->
  <span
    class="inline-flex shrink-0 [&>svg]:block [&>svg]:size-full"
    aria-hidden="true"
    v-html="svg"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string }>()

const files = import.meta.glob<string>(['./icons/*.svg', './logos/*.svg'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

// `logo-<app>` resolves to an app logo; anything else to a glyph.
const svg = computed(() =>
  props.name.startsWith('logo-')
    ? files[`./logos/${props.name.slice(5)}.svg`]
    : files[`./icons/${props.name}.svg`],
)
</script>
