<script setup lang="ts">
// The File input page: the file's three inputs — File input, File input
// area and CSV files — one below the other, the outline on the right, and
// under it the controls of the one in view (FileInputExample.vue).
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import FileInputExample from './FileInputExample.vue'

const example = (type: string, title: string): Pattern => ({
  id: type,
  title,
  component: FileInputExample,
  props: { type },
})
const patterns: Pattern[] = [
  example('field', 'File input'),
  example('area', 'File input area'),
  example('sources', 'CSV files'),
]
</script>

<template>
  <PatternsPage
    title="File input patterns"
    description="The file inputs in the Frappe apps, each with the options it can take."
    width="700px"
    centered
    hide-titles
    gap="192px"
    :patterns="patterns"
  />
</template>
