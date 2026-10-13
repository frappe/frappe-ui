<template>
  <!-- The editor's glyphs, exported from the espresso-2.0 toolbar
       (30534:59617). They paint with `currentColor` and fill their box. -->
  <span
    class="inline-flex shrink-0 [&>svg]:block [&>svg]:size-full"
    aria-hidden="true"
    v-html="svg"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string }>()

const files = import.meta.glob<string>('../assets/rte/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const svg = computed(() => files[`../assets/rte/${props.name}.svg`] ?? '')
</script>
