<script setup lang="ts">
// The Tree page: the file's three trees (node 35763:137741) — Default,
// Layers and Hierarchy — one below the other, the outline on the right,
// and under it the controls of the tree in view (TreeExample.vue).
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import TreeExample from './TreeExample.vue'

const patterns: Pattern[] = [
  {
    id: 'default',
    title: 'Default',
    component: TreeExample,
    props: { example: 'default' },
  },
  {
    id: 'layers',
    title: 'Layers',
    component: TreeExample,
    props: { example: 'layers' },
  },
  {
    id: 'hierarchy',
    title: 'Hierarchy',
    component: TreeExample,
    props: { example: 'hierarchy' },
  },
]
</script>

<template>
  <PatternsPage
    title="Tree patterns"
    description="The trees in the Frappe apps, each with the options it can take."
    width="700px"
    centered
    hide-titles
    :patterns="patterns"
  />
</template>
