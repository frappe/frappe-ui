<script setup lang="ts">
// The Tag page: the file's four variants (node 25406:19493) — Solid,
// Subtle, Outline and Ghost — one below the other, the outline on the
// right, and under it the controls of the variant in view (TagExample.vue).
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import TagExample from './TagExample.vue'

const variant = (id: string, title: string): Pattern => ({
  id,
  title,
  component: TagExample,
  props: { variant: id },
})
const patterns: Pattern[] = [
  variant('solid', 'Solid'),
  variant('subtle', 'Subtle'),
  variant('outline', 'Outline'),
  variant('ghost', 'Ghost'),
]
</script>

<template>
  <PatternsPage
    title="Tag patterns"
    description="The tags in the Frappe apps, in each of their four variants."
    width="700px"
    centered
    hide-titles
    :patterns="patterns"
  />
</template>
